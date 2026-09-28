import type { Stat } from "@/models/whatIs";
import { StatCounter } from "./StatCounter";

// Full-width band with E-Summit's numbers, directly under the video.
export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <div className="bg-[#000a1d] px-4 py-8 md:py-7">
      <ul className="mx-auto grid max-w-[90rem] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat) => (
          <li key={stat.id}>
            <StatCounter stat={stat} />
          </li>
        ))}
      </ul>
    </div>
  );
}
