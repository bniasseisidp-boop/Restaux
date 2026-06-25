import { useEffect, useRef, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const RestaurantScene = lazy(() => import('./RestaurantScene'))

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const { isDark } = useTheme()
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const scrollRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })
    tl.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )
    .fromTo('.hero-label',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.hero-title-line',
      { opacity: 0, y: 80, skewY: 5 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.15, ease: 'power4.out' }
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    , '-=0.3')
    .fromTo('.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    , '-=0.3')
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-noir-900">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full bg-gradient-to-br from-noir-900 via-[#150008] to-noir-900" />
        }>
          <RestaurantScene />
        </Suspense>
      </div>

      {/* Overlay gradient — dark/light aware */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(20,0,5,0.85) 50%, rgba(10,10,10,0.90) 100%)'
            : 'linear-gradient(135deg, rgba(245,241,235,0.93) 0%, rgba(255,245,240,0.88) 50%, rgba(245,241,235,0.93) 100%)',
        }}
      />

      {/* Red accent lines */}
      <div className="absolute top-0 left-0 w-px h-40 bg-gradient-to-b from-rouge to-transparent z-20" />
      <div className="absolute top-0 left-0 h-px w-40 bg-gradient-to-r from-rouge to-transparent z-20" />
      <div className="absolute bottom-0 right-0 w-px h-40 bg-gradient-to-t from-rouge to-transparent z-20" />
      <div className="absolute bottom-0 right-0 h-px w-40 bg-gradient-to-l from-rouge to-transparent z-20" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20">
        <div className="max-w-4xl">
          {/* Label */}
          <div className="hero-label flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-rouge" />
            <span className="text-rouge text-xs tracking-[0.5em] uppercase font-semibold">
              Depuis 2018 — Dakar, Sénégal
            </span>
          </div>

          {/* Main title */}
          <div className="overflow-hidden mb-2">
            <h1 className="hero-title-line font-playfair text-6xl md:text-8xl lg:text-9xl text-blanc font-bold leading-none tracking-tight">
              Le
            </h1>
          </div>
          <div className="overflow-hidden mb-6">
            <h1 className="hero-title-line font-playfair text-6xl md:text-8xl lg:text-9xl text-gradient-red font-bold leading-none tracking-tight italic">
              Chef
            </h1>
          </div>

          {/* Subtitle */}
          <p className="hero-subtitle text-blanc/60 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light">
            Une expérience gastronomique unique au cœur de Dakar.
            Saveurs authentiques, ambiance raffinée, moments inoubliables.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={() => scrollTo('reservation')}
              className="hero-cta btn-rouge group"
            >
              <span>Réserver une table</span>
              <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo('menu')}
              className="hero-cta btn-outline"
            >
              Voir notre carte
            </button>
          </div>

          {/* Stats */}
          <div className="hero-cta flex gap-12">
            {[
              { value: '200+', label: 'Plats servis/jour' },
              { value: '5★', label: 'Note clients' },
              { value: '6ans', label: "D'excellence" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-playfair text-3xl text-blanc font-bold">{stat.value}</p>
                <p className="text-blanc/40 text-xs tracking-widest uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollTo('about')}
      >
        <span className="text-blanc/30 text-xs tracking-[0.3em] uppercase">Découvrir</span>
        <div className="w-px h-16 bg-gradient-to-b from-rouge to-transparent animate-pulse" />
      </div>

      {/* Restaurant name tag */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-2">
        <p
          className="text-blanc/20 text-xs tracking-[0.4em] uppercase"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Restaurant & Café — +221 33 824 13 33
        </p>
      </div>
    </section>
  )
}
