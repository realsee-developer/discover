"use client";

import { useEffect, useRef, useState } from "react";

type YouTubePlayerProps = {
  videoId: string;
  title?: string;
};

type YTPlayerInstance = {
  destroy(): void;
  cueVideoById(videoId: string): void;
  loadVideoById(videoId: string): void;
  getIframe(): HTMLIFrameElement;
  getVideoData(): { video_id?: string };
};

type YTPlayerOptions = {
  videoId: string;
  host?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YTPlayerInstance }) => void;
    onError?: () => void;
  };
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: YTPlayerOptions,
  ) => YTPlayerInstance;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

let youtubeAPILoader: Promise<YTNamespace> | null = null;

function loadYouTubeIframeAPI() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("YouTube Player can only be loaded in the browser."),
    );
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeAPILoader) {
    return youtubeAPILoader;
  }

  youtubeAPILoader = new Promise<YTNamespace>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${YOUTUBE_IFRAME_API_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("error", () => {
        youtubeAPILoader = null;
        reject(new Error("Failed to load YouTube IFrame API."));
      });
    } else {
      const script = document.createElement("script");
      script.src = YOUTUBE_IFRAME_API_SRC;
      script.async = true;
      script.onerror = () => {
        youtubeAPILoader = null;
        reject(new Error("Failed to load YouTube IFrame API."));
      };
      document.head.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        youtubeAPILoader = null;
        reject(new Error("YouTube IFrame API did not initialize correctly."));
      }
      window.onYouTubeIframeAPIReady = undefined;
    };
  });

  return youtubeAPILoader;
}

export default function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadYouTubeIframeAPI()
      .then((YT) => {
        if (!isMounted || !containerRef.current) {
          return;
        }

        playerRef.current = new YT.Player(containerRef.current, {
          videoId,
          host: "https://www.youtube.com",
          playerVars: {
            rel: 0,
            modestbranding: 1,
            controls: 1,
            autoplay: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) {
                return;
              }

              const iframe = event.target.getIframe();
              iframe.setAttribute("title", title ?? "YouTube video player");
              iframe.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              );
              iframe.setAttribute("allowfullscreen", "true");
              iframe.setAttribute("loading", "lazy");
              setIsReady(true);
            },
            onError: () => {
              if (!isMounted) {
                return;
              }
              setHasError(true);
            },
          },
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setHasError(true);
      });

    return () => {
      isMounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [title, videoId]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const currentVideoId = playerRef.current.getVideoData().video_id;
    if (currentVideoId === videoId) {
      return;
    }

    try {
      playerRef.current.cueVideoById(videoId);
    } catch (_error) {
      setHasError(true);
    }
  }, [videoId]);

  return (
    <div className="relative h-full w-full">
      {!isReady && !hasError ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-cyber-gray-900/80"
        />
      ) : null}

      <div ref={containerRef} className="h-full w-full" />

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-gray-900/90 text-sm text-cyber-gray-300">
          Video unavailable. Please try again later.
        </div>
      ) : null}
    </div>
  );
}
