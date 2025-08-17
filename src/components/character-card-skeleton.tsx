import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CharacterCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-48" />
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="flex flex-col gap-3 text-sm flex-grow justify-center">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
