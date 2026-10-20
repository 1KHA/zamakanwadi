'use client';

import { useEffect, useState } from 'react';

interface Props {
  /** YouTube video id, e.g. "54r-UGo2h-o". */
  videoId: string;
  /** Optional dimming applied to the video itself (e.g. "opacity-90"). */
  videoClassName?: string;
}

/**
 * Silent, looping, non-interactive video background.
 *
 * Notes that matter:
 *  - `loop=1` alone does nothing for a single video; YouTube requires
 *    `playlist=<same id>` for it to repeat.
 *  - `mute=1` is mandatory — browsers block autoplay with sound.
 *  - `playsinline=1` stops iOS from hijacking into fullscreen.
 *  - `pointer-events-none` makes the whole thing inert: no clicks, no pause,
 *    no YouTube chrome reachable.
 *  - The iframe mounts only after hydration so it never competes with the
 *    hero text for the initial paint (protects LCP).
 *  - A 16:9 iframe is scaled to cover any viewport ratio via the
 *    100vw/56.25vw + 177.78vh/100vh min-size trick.
 *
 * There is no poster image: the section's own dark background shows for the
 * moment before the video fades in, and for users who prefer reduced motion.
 */
export default function HeroVideoBackground({ videoId, videoClassName = '' }: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // Respect users who ask for less motion — they keep the plain background.
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Defer past first paint so the hero renders instantly.
    const id = window.setTimeout(() => setShowVideo(true), 100);
    return () => window.clearTimeout(id);
  }, []);

  if (!showVideo) return null;

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId, // required for loop on a single video
    controls: '0',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3', // no annotations
    disablekb: '1',
    fs: '0',
    playsinline: '1',
    cc_load_policy: '0',
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
        videoReady ? 'opacity-100' : 'opacity-0'
      } ${videoClassName}`}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title=""
        aria-hidden="true"
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setVideoReady(true)}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[100vw] min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
      />
    </div>
  );
}
