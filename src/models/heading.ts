// A section heading pairs a bold sans part with an italic serif part, e.g. "Why *CAP*".
export type HeadingContent = {
  // The italic serif part, e.g. "Why" or "About".
  accent: string;
  // The bold sans part, e.g. "CAP?" or "Us".
  title: string;
  // Which part reads first. Defaults to the accent ("Why CAP?"); "title" gives "What is *E-Summit?*".
  lead?: "accent" | "title";
};
