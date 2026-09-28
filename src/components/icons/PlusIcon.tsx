import { cn } from "@/lib/utils";

// Plus that rotates 45° into an × when `open`.
export function PlusIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className={cn(
        "transition-[rotate,color] duration-300 ease-out motion-reduce:transition-none",
        open && "rotate-45",
        className,
      )}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
