import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen() {
  const logoRef = useRef(null)
  const lineRef = useRef(null)
  const subtitleRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!logoRef.current || !lineRef.current || !subtitleRef.current) return

    const tl = gsap.timeline()
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 24, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo(lineRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.9, ease: 'power2.inOut' },
      '-=0.3'
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    )

    let prog = 0
    const interval = setInterval(() => {
      prog = Math.min(prog + Math.random() * 14, 100)
      setProgress(Math.floor(prog))
      if (prog >= 100) clearInterval(interval)
    }, 80)

    return () => { clearInterval(interval); tl.kill() }
  }, [])

  return (
    <div className="loading-screen">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl"
             style={{ background: 'radial-gradient(circle, rgba(224,30,55,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Flame icon */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full animate-ping opacity-10"
               style={{ background: '#e01e37' }} />
          <div className="absolute inset-2 rounded-full"
               style={{ border: '1px solid rgba(224,30,55,0.25)' }} />
          <svg viewBox="0 0 40 50" className="w-9 h-11 relative z-10 animate-pulse" fill="none">
            <defs>
              <linearGradient id="fg2" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="100%" stopColor="#e01e37" />
              </linearGradient>
            </defs>
            <path fill="url(#fg2)"
              d="M20 2C18 8 10 14 10 22c0 5.5 4.5 10 10 10s10-4.5 10-10c0-3-1.5-6-3-8.5C25.5 16.5 24 20 20 20c-2.2 0-4-1.8-4-4 0-4.5 3.5-9.5 4-14z" />
          </svg>
        </div>

        {/* Logo */}
        <div ref={logoRef} className="text-center" style={{ opacity: 0 }}>
          <h1 className="font-playfair text-6xl text-blanc tracking-widest">
            Le <span className="text-rouge">Chef</span>
          </h1>
        </div>

        {/* Line */}
        <div ref={lineRef} className="origin-center" style={{ opacity: 0, width: 220, height: 1,
          background: 'linear-gradient(90deg, transparent, #e01e37 30%, #d4a017 50%, #e01e37 70%, transparent)' }} />

        {/* Subtitle */}
        <p ref={subtitleRef} className="text-[11px] tracking-[0.5em] uppercase"
           style={{ opacity: 0, color: 'rgba(255,255,255,0.35)' }}>
          Restaurant &amp; Café — Dakar
        </p>

        {/* Progress */}
        <div className="w-48 mt-2">
          <div className="flex justify-between mb-1.5">
            <span className="text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>Chargement</span>
            <span className="text-[9px] font-mono" style={{ color: 'rgba(224,30,55,0.5)' }}>{progress}%</span>
          </div>
          <div className="h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-100"
                 style={{
                   width: `${progress}%`,
                   background: 'linear-gradient(90deg, #c01a30, #e01e37)',
                   boxShadow: '0 0 6px rgba(224,30,55,0.5)',
                 }} />
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 text-center">
        <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 9, letterSpacing: '0.4em' }} className="uppercase">
          Powered by <span style={{ color: 'rgba(224,30,55,0.35)' }}>Multi Brain Tech</span>
        </p>
      </div>
    </div>
  )
}
