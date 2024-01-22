"use server";

import { routes } from "@/app/routes";
import { auth, clerkClient } from "@clerk/nextjs";
import { FormStateHandler } from "@/app/types";
import { redirect } from "next/navigation";
import onboardNewTeam from "@/lib/logic/teams/onboardNewTeam";
import db from "@/lib/services/db/db";
import safeParseURL from "@/utils/safeParseURL";
import summarizeWebsiteMessaging from "@/lib/logic/aiCapabilities/summarizeWebsiteMessaging";
import cacheHelpers from "@/lib/next-helpers/cacheHelpers";
import openAIClient from "@/lib/services/openAI/client";
import runJob from "@/jobs/runJob";
import syncTeamKeyPhrases from "@/jobs/applicationSyncing/syncTeamKeyPhrases";
import makeRequestError from "../makeRequestError";

const unauthError = makeRequestError({
  code: 401,
  message: "You must be logged in to create a team.",
});

// todo add error handling - probably add a form action wrapper for generic fallbacks
const handleCompanyDomainSubmission: FormStateHandler = async (_, formData) => {
  cacheHelpers.noStore();
  const reqAuth = auth();

  if (!reqAuth.userId) {
    return unauthError;
  }

  const domainResponse = formData.get("company_url");
  const parsedURL = safeParseURL(domainResponse?.toString() ?? "");
  const finalUrl = parsedURL?.origin;

  if (!finalUrl) {
    return makeRequestError({ code: 400, message: "Invalid URL" });
  }

  const user = await clerkClient.users.getUser(reqAuth.userId);

  if (!user) {
    return unauthError;
  }

  const existingTeam = await db.teams.findFirst({
    where: {
      primaryDomain: finalUrl,
      createdByUserId: reqAuth.userId,
    },
  });

  if (existingTeam) {
    return redirect(routes.welcomeAbout({ t: existingTeam.id }));
  }

  const messagingProfile = await summarizeWebsiteMessaging(finalUrl);

  const name = messagingProfile?.companyName ?? parsedURL.hostname;
  const { team } = await onboardNewTeam({
    primaryDomain: finalUrl,
    description: messagingProfile?.summary ?? "",
    createdByUserId: reqAuth.userId,
    createdByEmail: user.emailAddresses[0].emailAddress,
    createdByName:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.emailAddresses[0].emailAddress,
    clerkOrgName: parsedURL.hostname,
    name,
  });

  if (!team) {
    return makeRequestError({ code: 500, message: "Something went wrong" });
  }

  if (messagingProfile) {
    await db.messagingProfile.create({
      data: {
        messagingProfile: messagingProfile ?? {},
        teamId: team.id,
      },
    });

    const { keywords } = messagingProfile;

    if (keywords.length > 0) {
      const keywordsToInit = [
        ...keywords.map((keyword) => ({
          phrase: keyword,
          traits: [],
        })),
        {
          phrase: name,
          traits: ["BRANDED", "SELF"],
        },
      ];
      const keywordEmbeddings = await openAIClient.getEmbeddings({
        input: keywordsToInit.map(({ phrase }) => phrase),
      });

      const keyPhrases = keywordsToInit.map(({ phrase }, index) => ({
        phrase,
        phraseEmbeddings: keywordEmbeddings.data[index]?.embedding,
        teamId: team.id,
      }));

      await db.trackedKeyPhrases.createMany({
        data: keyPhrases,
      });
    }
  }

  await runJob(syncTeamKeyPhrases, { teamId: team.id });
  redirect(routes.welcomeAbout({ t: team.id }));
};

export default handleCompanyDomainSubmission;
