"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

interface RickrollAudioContextValue {
  isPlaying: boolean
  tick: number
  toggleRickroll: () => void
}

const RickrollAudioContext = createContext<RickrollAudioContextValue | null>(
  null
)

export function RickrollAudioProvider({
  audioUrl,
  children,
}: {
  audioUrl: string | null
  children: ReactNode
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [audioUrl])

  const toggleRickroll = useCallback(() => {
    if (!audioUrl) return

    if (!audioRef.current) {
      const audio = new Audio(audioUrl)
      audio.addEventListener("timeupdate", () =>
        setTick((current) => current + 1)
      )
      audio.addEventListener("ended", () => setIsPlaying(false))
      audio.addEventListener("pause", () => setIsPlaying(false))
      audioRef.current = audio
    }

    const audio = audioRef.current
    if (audio.paused) {
      void audio.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      )
    } else {
      audio.pause()
    }
  }, [audioUrl])

  const value = useMemo(
    () => ({ isPlaying, tick, toggleRickroll }),
    [isPlaying, tick, toggleRickroll]
  )

  return (
    <RickrollAudioContext.Provider value={value}>
      {children}
    </RickrollAudioContext.Provider>
  )
}

export function useRickrollAudio() {
  const context = useContext(RickrollAudioContext)
  if (!context) {
    throw new Error(
      "useRickrollAudio must be used within RickrollAudioProvider"
    )
  }
  return context
}
