import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { loggerAPI} from '@/lib/logger';

const CancelDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {
          loggerAPI({
            event: 'terms_and_conditions',
            status: 'candidate not accepted the terms and conditions'
          })
         
        }} variant="outline" className=" bg-red-600 text-white">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Acceptance Required</DialogTitle>
          <DialogDescription>
            You need to accept the terms and conditions in order to proceed
            further.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <DialogTrigger asChild>
            <Button>Close</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;
