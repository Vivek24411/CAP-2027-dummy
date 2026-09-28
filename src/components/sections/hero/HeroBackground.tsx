import Image from "next/image";
import type { ImageAsset } from "@/models/showcase";
import { Constellation } from "./constellation/Constellation";

// The hero illustration as a normal (optimised, preloaded) <Image>, with the hover
// constellation layer on top of it (invisible until the mouse moves over the hero).
export function HeroBackground({ image }: { image: ImageAsset }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <Constellation image={image} />
    </div>
  );
}
