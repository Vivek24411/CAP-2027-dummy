export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type RegisterBanner = {
  // Phrases scrolled in order, separated by sparkles.
  phrases: string[];
  href: string;
  // Read by screen readers instead of the repeated scrolling text.
  label: string;
};

export type Showcase = {
  rewards: ImageAsset;
  banner: RegisterBanner;
  stage: ImageAsset;
};
