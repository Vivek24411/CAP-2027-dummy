import type { EarnCoinsContent } from "@/models/earnCoins";

// Copy is taken as-is from the Figma file (it still mentions Mood Indigo / MI Coins) —
// update before launch.
export const earnCoins: EarnCoinsContent = {
  heading: { accent: "Earn Coins", title: "win exciting awards!" },
  description:
    "As part of the College Connect Program, every task and event you complete brings you closer to incredible perks with MI Coins - Mood Indigo's exclusive reward currency. The more you contribute, the more you earn!",
  coinsLeft: { src: "/images/coins/coins-left.png", alt: "", width: 573, height: 443 },
  coinsRight: { src: "/images/coins/coins-right.png", alt: "", width: 573, height: 443 },
};
