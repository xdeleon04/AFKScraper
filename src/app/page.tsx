"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { scrapeAndProcessCharacters } from "@/lib/actions";
import type { Character } from "@/lib/types";
import { CharacterCard } from "@/components/character-card";
import { CharacterCardSkeleton } from "@/components/character-card-skeleton";
import { Download, Wand2 } from "lucide-react";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsLoading(true);
    setCharacters([]);
    const result = await scrapeAndProcessCharacters();
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Scraping Failed",
        description: result.error,
      });
    } else {
      setCharacters(result.data || []);
      toast({
        title: "Scraping Successful",
        description: `Found ${result.data?.length || 0} characters.`,
      });
    }
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (characters.length === 0) return;

    const dataToDownload = characters.map(char => ({
      id: parseInt(char.id, 10),
      name: char.name,
      rarity: char.rarity,
      faction: char.faction,
      class: char.class,
      pve: char.pve,
      pvp: char.pvp,
      priority: char.priority,
      completed: false, // Defaulted to false as requested
      imageUrl: char.imageUrl,
      rarityUrl: char.rarityUrl,
      factionUrl: char.factionUrl,
      classUrl: char.classUrl,
    }));

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "characters.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          AFK Journey Data Scraper
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Click the button below to scrape the latest character data from{" "}
          <a
            href="https://prydwen.gg/afk-journey/characters/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            prydwen.gg
          </a>
          .
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button
            onClick={handleScrape}
            disabled={isLoading}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
          >
            <Wand2 className="mr-2 h-5 w-5" />
            {isLoading ? "Scraping, please wait..." : "Start Scraping"}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={characters.length === 0 || isLoading}
            variant="outline"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Download JSON
          </Button>
        </div>
      </div>

      <div>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <CharacterCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && characters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
