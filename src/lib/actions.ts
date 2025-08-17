"use server";

import * as cheerio from "cheerio";
import type { Character } from "./types";

const BASE_URL = "https://prydwen.gg";
const CHARACTERS_PATH = "/afk-journey/characters/";

export async function scrapeAndProcessCharacters(): Promise<{
  data: Character[] | null;
  error: string | null;
}> {
  try {
    const mainPageResponse = await fetch(`${BASE_URL}${CHARACTERS_PATH}`);
    if (!mainPageResponse.ok) {
      return { data: null, error: "Failed to fetch main character page." };
    }
    const mainPageHtml = await mainPageResponse.text();
    const $ = cheerio.load(mainPageHtml);

    const characterLinks: string[] = [];
    $(".character-list .character-item a").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        characterLinks.push(href);
      }
    });

    const characterPromises = characterLinks.map(async (link) => {
      try {
        const subPageResponse = await fetch(`${BASE_URL}${link}`);
        if (!subPageResponse.ok) {
          console.error(`Failed to fetch subpage: ${link}`);
          return null;
        }
        const subPageHtml = await subPageResponse.text();
        const $$ = cheerio.load(subPageHtml);

        const imageUrl = $$('img[width="160"][height="160"]').attr("src") || "";
        const id = imageUrl.split("/").pop()?.split(".")[0] || "unknown";
        const name = $$('img[width="160"][height="160"]').attr("alt") || "Unknown";

        const getInfo = (selector: string) => ({
          text: $$(selector).find("span").text().trim(),
          url: $$(selector).find("picture img").attr("src") || "",
        });

        const rarityInfo = getInfo(".rarity");
        const factionInfo = getInfo(".faction");
        const classInfo = getInfo(".class-type");

        const character: Character = {
          id,
          name,
          rarity: rarityInfo.text,
          faction: factionInfo.text,
          class: classInfo.text,
          pve: $$(".column.pve p").text().trim(),
          pvp: $$(".column.pvp p").text().trim(),
          priority: $$(".column.priority p").text().trim(),
          imageUrl: `${BASE_URL}${imageUrl}`,
          rarityUrl: `${BASE_URL}${rarityInfo.url}`,
          factionUrl: `${BASE_URL}${factionInfo.url}`,
          classUrl: `${BASE_URL}${classInfo.url}`,
        };
        return character;
      } catch (e) {
        console.error(`Error processing character at link ${link}:`, e);
        return null;
      }
    });

    const characters = (await Promise.all(characterPromises)).filter(
      (c): c is Character => c !== null
    );
    
    return { data: characters, error: null };
  } catch (error) {
    console.error("An error occurred during scraping:", error);
    return {
      data: null,
      error: "An unexpected error occurred. See server logs for details.",
    };
  }
}
