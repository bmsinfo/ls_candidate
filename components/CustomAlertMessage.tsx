import { Card, CardContent } from "@/components/ui/card";
import { CircleAlertIcon } from "./ui/icons";

export default function CustomAlertMessage({
  title,
  description,
}: {
  title: string | number;
  description: string | null | undefined;
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
        <CircleAlertIcon className="h-8 w-8 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
