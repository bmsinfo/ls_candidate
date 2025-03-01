import { toast } from "sonner";

interface NotifyProps {
  type?: "success" | "error";
  message: string;
}

export const notify = ({ type, message }: NotifyProps) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
      break;
  }
};
