"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { scrapeAndProcessCharacters } from "@/lib/actions";
import type { Character } from "@/lib/types";
import { CharacterCard } from "@/components/character-card";
import { CharacterCardSkeleton } from "@/components/character-card-skeleton";
import { Wand2 } from "lucide-react";

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
        <Button
          onClick={handleScrape}
          disabled={isLoading}
          className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
          size="lg"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          {isLoading ? "Scraping, please wait..." : "Start Scraping"}
        </Button>
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
