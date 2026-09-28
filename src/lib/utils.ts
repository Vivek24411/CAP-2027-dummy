// Joins class names and skips falsy values: cn("a", isActive && "b") -> "a b"
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
