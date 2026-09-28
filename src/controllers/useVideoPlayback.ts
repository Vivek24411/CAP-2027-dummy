"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  // Wait this long after the video is in view before starting it.
  delayMs?: number;
  // How much of the video must be visible to count as "in view" (0–1).
  threshold?: number;
};

// Scroll-driven playback for a muted video:
//
//   ~600px before it's on screen → start buffering, so playback starts smoothly
//   in view                      → wait `delayMs`, then play (muted, so browsers allow it)
//   scrolled away                → pause, and resume the same way when it comes back
//   paused by the visitor        → stays paused until they press play again
//
// Visitors who prefer reduced motion get a play button instead of autoplay.
// If no source can be loaded, `failed` turns true so the caller can keep the poster.
export function useVideoPlayback(
  videoRef: RefObject<HTMLVideoElement | null>,
  { delayMs = 400, threshold = 0.5 }: Options = {},
) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let startTimer = 0;
    let frame = 0;

    // Smooth progress bar: read currentTime every frame while playing (timeupdate is ~4 Hz).
    const trackProgress = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
      frame = requestAnimationFrame(trackProgress);
    };
    const onPlaying = () => {
      setStarted(true);
      setPlaying(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(trackProgress);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(frame);
    };
    // <source> errors don't bubble, so listen in the capture phase.
    const onError = () => {
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || video.error) setFailed(true);
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError, true);

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        video.preload = "auto";
        video.load();
        preloadObserver.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(startTimer);
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        if (reduceMotion || userPaused.current) return;
        startTimer = window.setTimeout(() => {
          if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) return;
          video.play().catch(() => {
            // Autoplay blocked — the play button still works.
          });
        }, delayMs);
      },
      { threshold },
    );
    preloadObserver.observe(video);
    playObserver.observe(video);

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      preloadObserver.disconnect();
      playObserver.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError, true);
    };
  }, [videoRef, delayMs, threshold]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.preload = "auto";
      video.play().catch(() => setFailed(true));
    } else {
      userPaused.current = true;
      video.pause();
    }
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, [videoRef]);

  // `fraction` is 0–1 along the video.
  const seek = useCallback(
    (fraction: number) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;
      video.currentTime = fraction * video.duration;
      setProgress(fraction);
    },
    [videoRef],
  );

  return { started, playing, muted, progress, failed, togglePlay, toggleMute, seek };
}
