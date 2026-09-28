"use client";

import Image from "next/image";
import { useRef } from "react";
import { useVideoPlayback } from "@/controllers/useVideoPlayback";
import { gsap, motionEnabled, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { VideoContent } from "@/models/whatIs";

function PlayPauseIcon({ playing, className }: { playing: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      {playing ? (
        <>
          <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
          <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
        </>
      ) : (
        <path d="M4.5 2.8v10.4a.8.8 0 0 0 1.2.7l8.4-5.2a.8.8 0 0 0 0-1.4L5.7 2.1a.8.8 0 0 0-1.2.7Z" />
      )}
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="m10.5 6 3.5 4m0-4-3.5 4" />
      ) : (
        <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.3 3.8a6 6 0 0 1 0 8.4" />
      )}
    </svg>
  );
}

const controlButton =
  "-m-2.5 flex size-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10";

// Framed video that plays (muted) when it scrolls into view and pauses when it leaves
// (see useVideoPlayback). Poster + a large play button until it starts, then a slim
// control bar. As the frame scrolls toward the centre of the screen it grows from 88% to
// full size and its corners tighten (scrubbed with the scroll).
export function VideoPlayer({ video }: { video: VideoContent }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { started, playing, muted, progress, failed, togglePlay, toggleMute, seek } =
    useVideoPlayback(videoRef);

  useGSAP(() => {
    if (!motionEnabled()) return;
    gsap.fromTo(
      frameRef.current,
      { scale: 0.88, clipPath: "inset(0% round 32px)" },
      {
        scale: 1,
        clipPath: "inset(0% round 12px)",
        ease: "none",
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      },
    );
  });

  return (
    <div
      ref={frameRef}
      className="border-line bg-surface rounded-card mx-auto w-full max-w-[60rem] border p-1.5 will-change-transform md:p-2"
    >
      <div className="bg-raised relative aspect-video overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-label={video.title}
          className="size-full object-cover"
        >
          {video.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>

        {/* The poster (optimised by next/image) sits on top until frames are actually playing */}
        <Image
          src={video.poster}
          alt=""
          fill
          sizes="(min-width: 1000px) 944px, 100vw"
          className={cn(
            "pointer-events-none object-cover transition-opacity duration-700 ease-out",
            started ? "opacity-0" : "opacity-100",
          )}
        />

        {!started && !failed && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={`Play video: ${video.title}`}
            className="group absolute inset-0 flex items-center justify-center bg-[#05070d]/20"
          >
            <span className="text-background flex size-18 items-center justify-center rounded-full bg-[#e8ebf2]/90 shadow-[0_8px_30px_rgb(0_0_0/0.35)] transition-[scale,background-color] duration-200 ease-out group-hover:scale-105 group-hover:bg-[#e8ebf2] md:size-24">
              <PlayPauseIcon playing={false} className="ml-1 size-6 md:size-8" />
            </span>
          </button>
        )}

        {started && !failed && (
          <div className="text-foreground absolute inset-x-2 bottom-2 flex h-9 items-center gap-3 rounded-full bg-[#05070d]/70 px-3 backdrop-blur-md md:inset-x-3 md:bottom-3 md:gap-4 md:px-4">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className={controlButton}
            >
              <PlayPauseIcon playing={playing} className="size-4" />
            </button>

            {/* Visual track + an invisible native range on top for mouse, touch and keyboard */}
            <div className="relative flex h-6 flex-1 items-center">
              <div className="h-[3px] w-full rounded-full bg-white/20">
                <div
                  className="bg-foreground h-full rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div
                aria-hidden="true"
                className="bg-foreground absolute size-2.5 -translate-x-1/2 rounded-full shadow"
                style={{ left: `${progress * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(progress * 1000)}
                onChange={(event) => seek(Number(event.target.value) / 1000)}
                aria-label="Seek video"
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              />
            </div>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className={controlButton}
            >
              <SpeakerIcon muted={muted} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
