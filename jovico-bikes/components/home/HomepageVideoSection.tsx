'use client'
// components/home/HomepageVideoSection.tsx
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Props {
    videoUrl: string
    poster?: string
    title?: string
    subtitle?: string
}

export function HomepageVideoSection({ videoUrl, poster, title, subtitle }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(true)
    const [muted, setMuted] = useState(true)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        video.play().catch(() => setPlaying(false))
    }, [])

    function togglePlay() {
        const video = videoRef.current
        if (!video) return
        if (video.paused) {
            video.play()
            setPlaying(true)
        } else {
            video.pause()
            setPlaying(false)
        }
    }

    function toggleMute() {
        const video = videoRef.current
        if (!video) return
        video.muted = !video.muted
        setMuted(video.muted)
    }

    return (
        <section className='relative overflow-hidden bg-slate-950'>
            {/* Video */}
            <div className='relative aspect-video sm:aspect-[21/9] max-h-[80vh]'>
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={poster || undefined}
                    loop
                    muted
                    playsInline
                    autoPlay
                    preload='metadata'
                    className='w-full h-full object-cover'
                    onCanPlay={() => setLoaded(true)}
                />

                {/* Dark overlay gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent' />
                <div className='absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent' />

                {/* Text overlay */}
                {(title || subtitle) && (
                    <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-16 max-w-3xl'>
                        {title && (
                            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight'>
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className='text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl'>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Video controls — bottom right */}
                <div className='absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={toggleMute}
                        className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-colors'
                        aria-label={muted ? 'Unmute video' : 'Mute video'}
                    >
                        {muted ? (
                            <VolumeX className='w-4 h-4 sm:w-5 sm:h-5' />
                        ) : (
                            <Volume2 className='w-4 h-4 sm:w-5 sm:h-5' />
                        )}
                    </button>
                    <button
                        type='button'
                        onClick={togglePlay}
                        className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-colors'
                        aria-label={playing ? 'Pause video' : 'Play video'}
                    >
                        {playing ? (
                            <Pause className='w-4 h-4 sm:w-5 sm:h-5' />
                        ) : (
                            <Play className='w-4 h-4 sm:w-5 sm:h-5' />
                        )}
                    </button>
                </div>

                {/* Loading skeleton */}
                {!loaded && (
                    <div className='absolute inset-0 bg-slate-900 flex items-center justify-center'>
                        <div className='flex gap-1.5'>
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className='w-2 h-8 bg-slate-700 rounded-full animate-pulse'
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
