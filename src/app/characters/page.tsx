"use client";

import * as React from "react";
import { CharacterTable } from "@/components/character-table/character-table";
import { columns } from "@/components/character-table/columns";
import type { Character } from "@/lib/types";

export default function CharactersPage() {
    const [data, setData] = React.useState<Character[]>([]);

    React.useEffect(() => {
        const storedCharacters = localStorage.getItem("characters");
        if (storedCharacters) {
            setData(JSON.parse(storedCharacters));
        }
    }, []);

    const handleDataUpdate = (updatedData: Character[]) => {
        setData(updatedData);
        localStorage.setItem("characters", JSON.stringify(updatedData));
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Character Data</h1>
            {data.length > 0 ? (
                <CharacterTable columns={columns} data={data} onDataUpdate={handleDataUpdate} />
            ) : (
                <p>No character data found. Go back to the <a href="/" className="text-accent hover:underline">home page</a> to scrape data.</p>
            )}
        </div>
    );
}
