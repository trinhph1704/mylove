import { useRef, useState, useEffect } from 'react';

const MUSIC_URL = '/music.mp3';
const LETTER_MUSIC_URL = '/letter-music.mp3';
const FADE_MS = 600;
const FADE_STEPS = 15;

interface Props {
  isLetterView: boolean;
}

function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  ref: React.MutableRefObject<ReturnType<typeof setInterval> | undefined>,
  onDone?: () => void
) {
  if (ref.current) clearInterval(ref.current);

  let step = 0;
  const stepTime = FADE_MS / FADE_STEPS;
  const delta = (to - from) / FADE_STEPS;
  audio.volume = Math.min(1, Math.max(0, from));

  ref.current = setInterval(() => {
    step++;
    audio.volume = Math.min(1, Math.max(0, from + delta * step));
    if (step >= FADE_STEPS) {
      clearInterval(ref.current);
      ref.current = undefined;
      audio.volume = Math.min(1, Math.max(0, to));
      onDone?.();
    }
  }, stepTime);
}

export default function MusicPlayer({ isLetterView }: Props) {
  const mainAudioRef = useRef<HTMLAudioElement>(null);
  const letterAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Separate fade refs for each track - no conflicts!
  const mainFadeRef = useRef<ReturnType<typeof setInterval>>();
  const letterFadeRef = useRef<ReturnType<typeof setInterval>>();

  const MAIN_VOL = 0.4;
  const LETTER_VOL = 0.5;

  // Initial setup & autoplay
  useEffect(() => {
    const mainAudio = mainAudioRef.current;
    const letterAudio = letterAudioRef.current;
    if (!mainAudio || !letterAudio) return;

    mainAudio.volume = MAIN_VOL;
    mainAudio.loop = true;
    letterAudio.volume = 0;
    letterAudio.loop = true;

    // Preload letter music so it's ready when needed
    letterAudio.load();

    const tryPlay = () => {
      mainAudio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {});
    };

    tryPlay();

    const startOnInteraction = () => {
      if (!hasInteracted) {
        mainAudio
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(() => {});
      }
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };

    document.addEventListener('click', startOnInteraction, { once: true });
    document.addEventListener('touchstart', startOnInteraction, { once: true });

    return () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      if (mainFadeRef.current) clearInterval(mainFadeRef.current);
      if (letterFadeRef.current) clearInterval(letterFadeRef.current);
    };
  }, []);

  // Switch music when entering/leaving letter view
  useEffect(() => {
    const mainAudio = mainAudioRef.current;
    const letterAudio = letterAudioRef.current;
    if (!mainAudio || !letterAudio || !isPlaying) return;

    if (isLetterView) {
      // Fade out main music
      fadeVolume(mainAudio, mainAudio.volume, 0, mainFadeRef, () => {
        mainAudio.pause();
      });

      // Start letter music with fade in
      letterAudio.currentTime = 0;
      letterAudio.volume = 0;
      const playLetter = () => {
        letterAudio
          .play()
          .then(() => {
            fadeVolume(letterAudio, 0, LETTER_VOL, letterFadeRef);
          })
          .catch(() => {
            // If play fails, retry on next user click
            const retry = () => {
              letterAudio.play().then(() => {
                fadeVolume(letterAudio, 0, LETTER_VOL, letterFadeRef);
              }).catch(() => {});
              document.removeEventListener('click', retry);
            };
            document.addEventListener('click', retry, { once: true });
          });
      };

      // Ensure audio is ready before playing
      if (letterAudio.readyState >= 2) {
        playLetter();
      } else {
        letterAudio.addEventListener('canplay', playLetter, { once: true });
        letterAudio.load();
      }
    } else {
      // Fade out letter music
      fadeVolume(letterAudio, letterAudio.volume, 0, letterFadeRef, () => {
        letterAudio.pause();
        letterAudio.currentTime = 0;
      });

      // Fade in main music
      mainAudio.volume = 0;
      mainAudio
        .play()
        .then(() => {
          fadeVolume(mainAudio, 0, MAIN_VOL, mainFadeRef);
        })
        .catch(() => {});
    }
  }, [isLetterView, isPlaying]);

  const toggle = () => {
    const mainAudio = mainAudioRef.current;
    const letterAudio = letterAudioRef.current;
    if (!mainAudio || !letterAudio) return;

    if (isPlaying) {
      mainAudio.pause();
      letterAudio.pause();
      setIsPlaying(false);
    } else {
      const activeAudio = isLetterView ? letterAudio : mainAudio;
      activeAudio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={mainAudioRef} src={MUSIC_URL} loop preload="auto" />
      <audio ref={letterAudioRef} src={LETTER_MUSIC_URL} loop preload="auto" />
      <button
        className={`music-toggle ${isPlaying ? 'playing' : 'paused'}`}
        onClick={toggle}
        aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
      >
        <span className="music-icon">{isPlaying ? '♫' : '🔇'}</span>
      </button>
    </>
  );
}
