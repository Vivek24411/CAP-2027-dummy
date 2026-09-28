import type { HeadingContent } from "@/models/heading";

export type VideoSource = {
  src: string;
  // MIME type, e.g. "video/webm" or "video/mp4". The browser plays the first one it supports.
  type: string;
};

export type VideoContent = {
  sources: VideoSource[];
  // Still frame shown until the video starts (and instead of it if the file is missing).
  poster: string;
  // Accessible name for the video.
  title: string;
};

export type Stat = {
  id: string;
  // Rendered as-is in the HTML; counts up once on the client when the band scrolls into view.
  value: number;
  suffix: string;
  label: string;
};

export type WhatIsContent = {
  heading: HeadingContent;
  video: VideoContent;
  story: {
    heading: string;
    paragraphs: string[];
  };
  // Labels around the logo: first diagram has two, second has four.
  diagramLabels: {
    two: [ideate: string, build: string];
    four: [disrupt: string, ideate: string, build: string, impact: string];
  };
  outro: string;
  // E-Summit in numbers, shown in a band under the video.
  stats: Stat[];
};
