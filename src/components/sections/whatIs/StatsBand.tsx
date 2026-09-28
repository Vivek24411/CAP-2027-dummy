import type { Stat } from "@/models/whatIs";
import { StatCounter } from "./StatCounter";

// Full-width band with E-Summit's numbers, directly under the video: hairlines top and
// bottom, a faint blue horizon glow, and dividers between the figures.
export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <div className="relative border-y border-white/[0.08] bg-[#000a1d] bg-[radial-gradient(60%_140%_at_50%_120%,rgb(2_133_226/0.18),transparent_70%)] px-4 py-10 md:py-12">
      <ul className="mx-auto grid max-w-[72rem] grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/[0.08]">
        {stats.map((stat) => (
          <li key={stat.id}>
            <StatCounter stat={stat} />
          </li>
        ))}
      </ul>
    </div>
  );
}
