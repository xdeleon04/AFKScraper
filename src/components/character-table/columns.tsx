
"use client"

import type { ColumnDef, SortingFn, Row } from "@tanstack/react-table"
import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "./data-table-column-header";
import type { Character } from "@/lib/types"
import { Badge } from "@/components/ui/badge";

const getPriorityClass = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'very high':
      return 'bg-purple-500 hover:bg-purple-500/80';
    case 'high':
      return 'bg-red-500 hover:bg-red-500/80';
    case 'medium':
      return 'bg-yellow-500 hover:bg-yellow-500/80';
    case 'low':
      return 'bg-green-500 hover:bg-green-500/80';
    default:
      return 'bg-gray-500 hover:bg-gray-500/80';
  }
}

const getInvestmentClass = (investment: string) => {
    if (investment.includes('+15')) return 'text-purple-400';
    if (investment.includes('+10')) return 'text-green-400';
    if (investment.includes('+8')) return 'text-sky-400';
    if (investment.includes('+5')) return 'text-yellow-400';
    return 'text-gray-400';
};

const prioritySorting: SortingFn<Character> = (rowA: Row<Character> | Character, rowB: Row<Character> | Character, columnId) => {
  const priorityOrder = ['Very High', 'High', 'Medium', 'Low', 'N/A'];
  
  // The sorting function can be called with either a Row object or the raw data object.
  // We need to handle both cases.
  const priorityA = 'original' in rowA ? (rowA.original as any)[columnId] : (rowA as any)[columnId];
  const priorityB = 'original' in rowB ? (rowB.original as any)[columnId] : (rowB as any)[columnId];
  
  const indexA = priorityOrder.indexOf(priorityA);
  const indexB = priorityOrder.indexOf(priorityB);
  
  const finalIndexA = indexA === -1 ? priorityOrder.length : indexA;
  const finalIndexB = indexB === -1 ? priorityOrder.length : indexB;

  return finalIndexA - finalIndexB;
};

const investmentSorting: SortingFn<Character> = (rowA: Row<Character> | Character, rowB: Row<Character> | Character, columnId) => {
  const investmentOrder = ['+10 → +15', '+5 → +10 → +15', '+8 → +10', '+5 → +10', '+5', '+0', 'N/A'];

  // The sorting function can be called with either a Row object or the raw data object.
  const investmentA = 'original' in rowA ? (rowA.original as any)[columnId] : (rowA as any)[columnId];
  const investmentB = 'original' in rowB ? (rowB.original as any)[columnId] : (rowB as any)[columnId];

  const indexA = investmentOrder.indexOf(investmentA);
  const indexB = investmentOrder.indexOf(investmentB);

  const finalIndexA = indexA === -1 ? investmentOrder.length : indexA;
  const finalIndexB = indexB === -1 ? investmentOrder.length : indexB;

  return finalIndexA - finalIndexB;
};


export const columns: ColumnDef<Character>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Character" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <Image 
            src={row.original.imageUrl} 
            alt={row.original.name} 
            width={40} 
            height={40}
            className="rounded-full"
            data-ai-hint="character avatar"
          />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return <Badge className={getPriorityClass(priority)}>{priority}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    sortingFn: prioritySorting,
  },
  {
    accessorKey: "pve",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PVE Investment" />
    ),
    cell: ({ row }) => {
      const pve = row.getValue("pve") as string
      return <span className={getInvestmentClass(pve)}>{pve}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    sortingFn: investmentSorting,
  },
  {
    accessorKey: "pvp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PVP Investment" />
    ),
    cell: ({ row }) => {
       const pvp = row.getValue("pvp") as string
      return <span className={getInvestmentClass(pvp)}>{pvp}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    sortingFn: investmentSorting,
  },
  {
    accessorKey: "rarity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rarity" />
    ),
    cell: ({ row }) => {
        return (
            <div className="flex items-center gap-2">
                <Image src={row.original.rarityUrl} alt={row.original.rarity} width={24} height={24} data-ai-hint="fantasy badge" />
                <span>{row.getValue("rarity")}</span>
            </div>
        )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "faction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Faction" />
    ),
    cell: ({ row }) => {
        return (
            <div className="flex items-center gap-2">
                <Image src={row.original.factionUrl} alt={row.original.faction} width={24} height={24} data-ai-hint="fantasy crest" />
                <span>{row.getValue("faction")}</span>
            </div>
        )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "class",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
        return (
            <div className="flex items-center gap-2">
                <Image src={row.original.classUrl} alt={row.original.class} width={24} height={24} data-ai-hint="fantasy icon" />
                <span>{row.getValue("class")}</span>
            </div>
        )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "completed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => {
      const completed = row.getValue("completed");
      return completed ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-muted-foreground" />;
    },
    enableSorting: true,
    enableHiding: true,
  },
]
