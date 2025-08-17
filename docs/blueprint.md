# **App Name**: AFK Journey Data Scraper

## Core Features:

- Character List Scraping: Scrape character list from the main page of prydwen.gg/afk-journey/characters/
- Subpage Navigation: Follow links for each character subpage, such as prydwen.gg/afk-journey/characters/indris.
- Data Extraction: Extract the character data, according to the fields 'id', 'name', 'rarity', 'faction', 'class', 'pve', 'pvp', 'priority', 'imageUrl', 'rarityUrl', 'factionUrl', and 'classUrl'. Look on the subpages for <img width="160" height="160" and src= for 'imageUrl' and 'id' from the name of the image, alt= for 'name', class="column priority" for 'priority', PVE investment for 'pve', PVP investment for 'pvp', "A" or "B" for 'rarity', <picture> and src= for the rarityUrl', and 'classUrl'.
- JSON Formatting: Format extracted data into JSON.
- Start Scraping: Provide a button to kick off the scraping, which exports data into the app state.
- Data Presentation: Present data to the user in a formatted manner. Display character data in a table or card format, ensuring all extracted fields are visible.

## Style Guidelines:

- Primary color: A desaturated, fairly dark purple (#4A4158) evokes a sense of mystery, depth, and slight royalty appropriate to the source data.
- Background color: An extremely desaturated, very dark purple (#141316), not far from true black, ensures readability in a dark scheme and helps the content stand out.
- Accent color: A saturated, bright pink (#E65DB7) adds a touch of excitement and contrast, drawing attention to important elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif. 'Inter' offers a modern, neutral aesthetic suitable for displaying data clearly and legibly.
- Use simple, line-based icons for character attributes (faction, type) to maintain a clean and consistent visual style. Icons should complement the overall aesthetic and be easily recognizable.
- Implement a clean, grid-based layout to display the extracted data. Ensure proper spacing and alignment for readability. Use cards or tables to present character information in an organized manner.