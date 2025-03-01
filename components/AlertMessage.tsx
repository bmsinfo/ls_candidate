"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, XIcon } from "lucide-react";

type AlertType = "default" | "destructive" | "error";

interface AlertMessageProps {
  type?: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
}

export default function AlertMessage({
  type = "default",
  title,
  message,
  onClose,
}: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  const alertVariant = type === "default" ? "default" : type;

  return (
    <Alert
      variant={alertVariant}
      className="relative flex items-center  justify-between rounded-none "
    >
      <div className="flex">
        {alertVariant === "error" && (
          <AlertCircle className="h-5 text-white w-5 mr-2 flex-shrink-0" />
        )}

        <AlertTitle className="flex items-center text-white mb-0">
          {title} :
        </AlertTitle>

        <AlertDescription className="text-white ml-1">
          {message}
        </AlertDescription>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className=" top-2 right-2 group"
        onClick={handleClose}
      >
        <XIcon className="h-4 w-4 text-white group-hover:text-red-500" />
        <span className="sr-only">Close</span>
      </Button>
    </Alert>
  );
}
