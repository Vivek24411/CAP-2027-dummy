// Empty slot shown until a contact is added in data/about.ts. Same shape and hover as ContactCard.
export function AboutCard() {
  return (
    <div className="border-line bg-surface hover:border-line-strong rounded-card aspect-[4/5] w-full border transition-[translate,border-color] duration-200 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0" />
  );
}
