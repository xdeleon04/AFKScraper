"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import type { Character } from "@/lib/types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  data: Character[]
}

const IconOption = ({ url, alt, label }: { url: string; alt: string; label: string }) => (
  <div className="flex items-center gap-2">
    <Image src={url} alt={alt} width={16} height={16} data-ai-hint="fantasy icon" />
    <span>{label}</span>
  </div>
)

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const rarities = React.useMemo(() => {
    const rarityMap = new Map(data.map(c => [c.rarity, c.rarityUrl]));
    return Array.from(rarityMap.entries()).map(([label, url]) => ({
      value: label,
      label: label,
      icon: () => <IconOption url={url} alt={label} label={label}/>,
    }));
  }, [data]);

  const factions = React.useMemo(() => {
    const factionMap = new Map(data.map(c => [c.faction, c.factionUrl]));
    return Array.from(factionMap.entries()).map(([label, url]) => ({
      value: label,
      label: label,
      icon: () => <IconOption url={url} alt={label} label={label}/>
    }));
  }, [data]);

  const classes = React.useMemo(() => {
    const classMap = new Map(data.map(c => [c.class, c.classUrl]));
    return Array.from(classMap.entries()).map(([label, url]) => ({
      value: label,
      label: label,
      icon: () => <IconOption url={url} alt={label} label={label}/>
    }));
  }, [data]);

  const pve = [
    { label: '+0', value: '+0' },
    { label: '+5', value: '+5' },
    { label: '+5 → +10', value: '+5 → +10' },
    { label: '+8 → +10', value: '+8 → +10' },
    { label: '+10 → +15', value: '+10 → +15' },
    { label: '+5 → +10 → +15', value: '+5 → +10 → +15' },
  ];

  const pvp = [
    { label: '+0', value: '+0' },
    { label: '+5', value: '+5' },
    { label: '+5 → +10', value: '+5 → +10' },
    { label: '+8 → +10', value: '+8 → +10' },
    { label: '+10 → +15', value: '+10 → +15' },
    { label: '+5 → +10 → +15', value: '+5 → +10 → +15' },
  ];
  
  const priorities = React.useMemo(() => {
    const prioritySet = new Set(data.map(c => c.priority));
    return Array.from(prioritySet).map(p => ({ label: p, value: p }));
  }, [data]);


  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("rarity") && (
          <DataTableFacetedFilter
            column={table.getColumn("rarity")}
            title="Rarity"
            options={rarities}
          />
        )}
        {table.getColumn("faction") && (
          <DataTableFacetedFilter
            column={table.getColumn("faction")}
            title="Faction"
            options={factions}
          />
        )}
        {table.getColumn("class") && (
          <DataTableFacetedFilter
            column={table.getColumn("class")}
            title="Class"
            options={classes}
          />
        )}
         {table.getColumn("pve") && (
          <DataTableFacetedFilter
            column={table.getColumn("pve")}
            title="PVE"
            options={pve}
          />
        )}
         {table.getColumn("pvp") && (
          <DataTableFacetedFilter
            column={table.getColumn("pvp")}
            title="PVP"
            options={pvp}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
