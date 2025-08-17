import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Character } from "@/lib/types";
import { Shield, Swords, Star } from "lucide-react";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Image
          src={character.imageUrl}
          alt={`Image of ${character.name}`}
          width={250}
          height={250}
          className="w-full h-auto object-cover"
          data-ai-hint="character portrait"
        />
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
          <CardTitle className="text-white text-xl font-bold truncate">
            {character.name}
          </CardTitle>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Image src={character.rarityUrl} alt={character.rarity} width={32} height={32} title={character.rarity} data-ai-hint="fantasy badge" />
            <Image src={character.factionUrl} alt={character.faction} width={32} height={32} title={character.faction} data-ai-hint="fantasy crest" />
            <Image src={character.classUrl} alt={character.class} width={32} height={32} title={character.class} data-ai-hint="fantasy icon" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">{character.faction}</Badge>
          <Badge variant="outline">{character.class}</Badge>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-3 text-sm flex-grow justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Swords className="w-4 h-4 text-accent" />
              <span>PVE</span>
            </div>
            <span className="font-semibold">{character.pve}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-accent" />
              <span>PVP</span>
            </div>
            <span className="font-semibold">{character.pvp}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="w-4 h-4 text-accent" />
              <span>Priority</span>
            </div>
            <span className="font-semibold">{character.priority}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
