
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
    $("div.avatar-card a").each((_, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith("/afk-journey/characters/")) {
        characterLinks.push(href);
      }
    });

    const uniqueLinks = [...new Set(characterLinks)];

    if (uniqueLinks.length === 0) {
        return { data: [], error: "Could not find any character links on the page." };
    }

    const characterPromises = uniqueLinks.map(async (link) => {
      try {
        const subPageResponse = await fetch(`${BASE_URL}${link}`);
        if (!subPageResponse.ok) {
          console.error(`Failed to fetch subpage: ${link}`);
          return null;
        }
        const subPageHtml = await subPageResponse.text();
        const $$ = cheerio.load(subPageHtml);

        const name = $$('.combined h2 > strong:first-child').text().trim();
        const imageUrl = $$('.afk-ex-row.data .column.character img').attr("src") || "";
        const id = imageUrl.split("/").pop()?.split(".")[0] || name.toLowerCase().replace(/\s/g, '-');
        
        const h2Text = $$('.combined > h2').text();
        const rarityMatch = h2Text.match(/is an (A-Level|S-Level)/);
        const rarityText = rarityMatch ? rarityMatch[1] : 'Unknown';

        const strongs = $$('.combined > h2 > strong');
        const factionText = $$(strongs[0]).text().trim(); 
        const classText = $$(strongs[1]).text().trim();
        
        const gatsbyImages = $$('.combined > h2 .gatsby-image-wrapper');
        const rarityUrl = $$(gatsbyImages[0]).find('img').attr('src') || '';
        const classUrl = $$(gatsbyImages[1]).find('img').src() || '';
        const factionUrl = $$(gatsbyImages[2]).find('img').src() || '';
        
        const investmentRows = $$('.afk-ex-row.data .column.ex');
        const pve = $$(investmentRows[0]).find('strong').text().trim();
        const pvp = $$(investmentRows[1]).find('strong').text().trim();
        const priority = $$('.afk-ex-row.data .column.priority p').text().trim();

        const character: Character = {
          id,
          name,
          rarity: rarityText,
          faction: factionText,
          class: classText,
          pve,
          pvp,
          priority,
          imageUrl: `${BASE_URL}${imageUrl}`,
          rarityUrl: `${BASE_URL}${rarityUrl}`,
          factionUrl: `${BASE_URL}${factionUrl}`,
          classUrl: `${BASE_URL}${classUrl}`,
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
