import * as cheerio from "cheerio";
import { redditEndpoints } from "@/lib/services/reddit/endpoints";
import runScrapingBeeRequest from "@/lib/services/scrapingBee/runScrapingBeeRequest";
import { redditScrapeConfig } from "./redditScrapeConfig";
import { RedditItemSearchContext } from "./types";

interface LifecycleParams<TItemType> {
  onItem: (item: TItemType, cheerio: cheerio.Cheerio<cheerio.Element>) => void;
}

const scrapeRedditSearch =
  <TItemType>(type: "POST" | "COMMENT") =>
  async (searchTerm: string, { onItem }: LifecycleParams<TItemType>) => {
    const res = await runScrapingBeeRequest((client) =>
      client.get({
        url: (type === "POST"
          ? redditEndpoints.searchPosts
          : redditEndpoints.searchComments)(searchTerm),
        params: redditScrapeConfig,
      }),
    );

    if (!res) {
      return;
    }

    const $ = cheerio.load(res);
    const list = $("[data-faceplate-tracking-context]");

    list.each((index, post) => {
      const postCheerio = $(post);
      const contextData = postCheerio.attr("data-faceplate-tracking-context");
      if (!contextData) return;

      try {
        try {
          const context = JSON.parse(contextData) as TItemType & {
            search?: RedditItemSearchContext;
          };

          // we don't want these
          if (context.search) {
            return;
          }

          onItem(context, postCheerio);
        } catch (error) {
          // todo handle gracefully
          console.error("Error parsing JSON data:", contextData);
        }
      } catch (error) {
        // todo handle gracefully
        console.error("Other generic error:", contextData);
      }
    });
  };

export default scrapeRedditSearch;
