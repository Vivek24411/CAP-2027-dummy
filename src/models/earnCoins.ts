import type { HeadingContent } from "@/models/heading";
import type { ImageAsset } from "@/models/showcase";

export type EarnCoinsContent = {
  heading: HeadingContent;
  description: string;
  coinsLeft: ImageAsset;
  coinsRight: ImageAsset;
};
