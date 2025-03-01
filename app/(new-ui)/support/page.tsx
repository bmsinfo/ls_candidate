import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SupportPage() {
  // TODO: send log to log server
  return (
    <div className="h-[calc(100vh-83px)] bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2 text-center justify-center">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <span>Oops Service Unavailable</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            We apologize, but we are currently unable to start your interview
            session.
          </p>

          <p className="text-sm text-muted-foreground">
            Our team is working diligently to resolve this issue. We appreciate
            your patience and understanding.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">Contact Support</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
