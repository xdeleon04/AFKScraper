
"use server";

import * as cheerio from "cheerio";
import type { Character } from "./types";

const BASE_URL = "https://prydwen.gg";
const CHARACTERS_PATH = "/afk-journey/characters/";
let fallbackId = 100;

export async function scrapeAndProcessCharacters(): Promise<{
  data: Character[] | null;
  error: string | null;
}> {
  try {
    const mainPageResponse = await fetch(`${BASE_URL}${CHARACTERS_PATH}`);
    if (!mainPageResponse.ok) {
      return { data: null, error: `Failed to fetch main character page. Status: ${mainPageResponse.status}` };
    }
    const mainPageHtml = await mainPageResponse.text();
    const $ = cheerio.load(mainPageHtml);

    const characterLinks: string[] = [];
    $("div.avatar-card a").each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith("/afk-journey/characters/")) {
        characterLinks.push(href);
      }
    });

    const uniqueLinks = [...new Set(characterLinks)];

    if (uniqueLinks.length === 0) {
        return { data: [], error: "Could not find any character links on the page. The website structure may have changed." };
    }

    const characterPromises = uniqueLinks.map(async (link) => {
      try {
        const subPageResponse = await fetch(`${BASE_URL}${link}`);
        if (!subPageResponse.ok) {
          console.error(`Failed to fetch subpage: ${link}, Status: ${subPageResponse.status}`);
          return null;
        }
        const subPageHtml = await subPageResponse.text();
        const $$ = cheerio.load(subPageHtml);

        const name = $$('.combined h2 > strong').first().text().trim();
        if (!name) {
            console.warn(`Could not find character name on page: ${link}`);
            return null;
        }

        const strongs = $$('.combined > h2 > strong');
        const rarityText = $$(strongs[1]).text().trim();
        const classText = $$(strongs[2]).text().trim();
        const factionText = $$(strongs[3]).text().trim();

        const gatsbyImages = $$('.combined > h2 .gatsby-image-wrapper picture img');
        const rarityUrl = $$(gatsbyImages[0]).attr('data-src') || '';
        const classUrl = $$(gatsbyImages[1]).attr('data-src') || '';
        const factionUrl = $$(gatsbyImages[2]).attr('data-src') || '';

        const afkExRow = $$('.afk-ex-row.data .column.character img');
        const imageUrl = $$(afkExRow[1]).attr('data-src') || '';
        const id = imageUrl.split("/").pop()?.match(/^\d+/)?.[0] || (fallbackId++).toString();

        const priority = $$('.column.priority p').text().trim() || 'N/A';

        const investmentColumns = $$('.column.ex');
        const pve = $$(investmentColumns[0]).find('strong').text().trim() || 'N/A';
        const pvp = $$(investmentColumns[1]).find('strong').text().trim() || 'N/A';

        const character: Character = {
          id,
          name,
          rarity: rarityText,
          faction: factionText,
          class: classText,
          pve,
          pvp,
          priority,
          imageUrl: imageUrl ? `${BASE_URL}${imageUrl}` : 'https://placehold.co/250x250.png',
          rarityUrl: rarityUrl ? `${BASE_URL}${rarityUrl}` : 'https://placehold.co/32x32.png',
          factionUrl: factionUrl ? `${BASE_URL}${factionUrl}` : 'https://placehold.co/32x32.png',
          classUrl: classUrl ? `${BASE_URL}${classUrl}` : 'https://placehold.co/32x32.png',
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      data: null,
      error: `An unexpected error occurred: ${errorMessage}. See server logs for details.`,
    };
  }
}
