import { cn } from "@/lib/utils";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("bg-primary py-2 w-full flex items-end", className)}>
      <div className="container max-w-7xl flex items-center justify-center px-4 ">
        <div className="flex items-center gap-2 text-sm text-white">
          <span>Powered by -</span>
          <span>LegoSapien</span>
          <span>&copy; 2024</span>
        </div>
      </div>
    </footer>
  );
}
