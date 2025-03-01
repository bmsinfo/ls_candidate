'use server';

import { Hourglass, HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function ExpiredInviteCard({
  message = "Your invite link has expired, but don't worry! We can fix this in a jiffy.",
}: {
  message: string;
}) {
  return (
    <Card className="w-full bg-gray-50 max-w-md mx-auto overflow-hidden">
      <div className=" bg-gray-50 p-6 text-white">
        <CardHeader className="space-y-1 p-0">
          <div className="flex items-center space-x-2 text-red-500">
            <Hourglass className="w-8 h-8" />
            <CardTitle className="text-2xl font-bold">
              Oops! Time&apos;s Up
            </CardTitle>
          </div>
        </CardHeader>
        {/* <p className="mt-2 text-red-500">{message}</p> */}
        <p className="mt-2 text-red-500">{message}</p>
      </div>
      <CardContent className="space-y-6 p-6">
        <div className="text-center">
          <Button variant="outline" className="w-full">
            <HelpCircle className="w-4 h-4 mr-2" />
            Contact HR
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t p-4">
        <p className="text-xs text-gray-500 text-center w-full">
          If you believe this is an error or you&apos;re having trouble, please
          reach out to our support team.
        </p>
      </CardFooter>
    </Card>
  );
}
