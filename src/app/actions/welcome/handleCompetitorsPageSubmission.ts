"use server";

import _ from "lodash";
import { redirect } from "next/navigation";
import { Teams } from "@prisma/client/edge";

import { routes } from "@/app/routes";
import { FormStateHandler } from "@/app/types";
import findOrInitializeCompetitor from "@/lib/logic/competitors/findOrInitializeCompetitor";
import splitStringOnCommas from "@/utils/splitStringOnCommas";
import findOrCreateCompetitorRelationship from "@/lib/logic/competitors/findOrCreateCompetitorRelationship";
import findOrCreateKeyPhrase from "@/lib/logic/keyPhrases/findOrCreateKeyPhrase";
import postCompetitorToAirtable from "@/lib/logic/teams/postCompetitorToAirtable";

const handleCompetitorsPageSubmission: FormStateHandler<{
  team: Teams;
  message?: string;
}> = async ({ team }, formData) => {
  if (!team) {
    return redirect(routes.welcome());
  }

  const customCompetitors = splitStringOnCommas(
    formData.get("custom_competitors")?.toString() ?? "",
  );

  const competitors = Array.from(formData.keys())
    .filter((key) => key.startsWith("int_comp_"))
    .map((key) => key.slice("int_comp_".length));

  const competitorDomains = _.uniq([
    ...competitors,
    ...customCompetitors,
  ]).slice(0, 2);
  const competitorDocuments = await Promise.all(
    competitorDomains.map(findOrInitializeCompetitor),
  );

  await Promise.all(
    competitorDocuments.map((competitor) =>
      postCompetitorToAirtable(team, competitor),
    ),
  );

  await Promise.all([
    ...competitorDocuments.map(({ id, name }) =>
      findOrCreateKeyPhrase({
        teamId: id,
        phrase: name,
        traits: ["BRANDED"],
      }),
    ),
    ...competitorDocuments.map(({ id }) =>
      findOrCreateCompetitorRelationship({
        competitorId: id,
        teamId: team.id,
      }),
    ),
  ]);

  return redirect(routes.welcomeCompetitorInfo({ t: team.id }));
};

export default handleCompetitorsPageSubmission;
