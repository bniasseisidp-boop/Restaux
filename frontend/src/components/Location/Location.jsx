import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Clock, Navigation, ExternalLink, ChefHat, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

gsap.registerPlugin(ScrollTrigger)

const INFO_CARDS = [
  {
    icon: MapPin,
    title: 'Adresse',
    color: '#e01e37',
    lines: ['DIEUPPEUL I, VILLA N°2207', 'En face Université Bourguiba', 'Dakar, Sénégal'],
    action: { label: 'Itinéraire Google Maps', href: 'https://maps.google.com/?q=DIEUPPEUL+I+VILLA+2207+DAKAR' }
  },
  {
    icon: Phone,
    title: 'Contacts',
    color: '#3b82f6',
    lines: ['+221 33 824 13 33', 'info@lechef-dakar.com'],
    action: { label: 'Appeler maintenant', href: 'tel:+221338241333' }
  },
  {
    icon: Clock,
    title: 'Horaires',
    color: '#10b981',
    lines: ['Lun – Ven : 09h30 – 23h00', 'Samedi : 09h30 – 23h30', 'Dimanche : 10h00 – 22h00'],
    action: null
  },
  {
    icon: FacebookIcon,
    title: 'Réseaux Sociaux',
    color: '#1877f2',
    lines: ['Restaurant Café Le Chef', 'Suivez-nous sur Facebook'],
    action: { label: 'Notre page Facebook', href: 'https://www.facebook.com/people/Restaurant-Cafe-LE-CHEF' }
  },
]

export default function Location() {
  const sectionRef = useRef(null)
  const mapRef = useRef(null)
  const cardsRef = useRef(null)
  const bannerRef = useRef(null)

  useEffect(() => {
    if (cardsRef.current?.children) {
      gsap.fromTo(cardsRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }
    if (mapRef.current) {
      gsap.fromTo(mapRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.9, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }
    if (bannerRef.current) {
      gsap.fromTo(bannerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: bannerRef.current, start: 'top 85%' } }
      )
    }
  }, [])

  return (
    <section id="location" ref={sectionRef} className="py-24 bg-noir-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-16">
          <span className="section-label">Où Nous Trouver</span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="section-title">
              Notre <span className="text-gradient-red italic">Localisation</span>
            </h2>
            <p className="text-blanc/50 max-w-md text-sm leading-relaxed">
              Situés en plein cœur de Dakar, à deux pas de l'Université Bourguiba.
              Parking disponible à proximité.
            </p>
          </div>
        </div>

        {/* Main grid: cards + map */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">

          {/* Info cards */}
          <div ref={cardsRef} className="lg:col-span-2 flex flex-col gap-3">
            {INFO_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="group rounded-2xl p-5 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${card.color}08`
                    e.currentTarget.style.borderColor = `${card.color}25`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${card.color}20`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}
                    >
                      <Icon size={18} style={{ color: card.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-blanc font-semibold text-sm mb-2 tracking-wide">{card.title}</h4>
                      {card.lines.map((line, i) => (
                        <p key={i} className="text-blanc/50 text-xs leading-relaxed">{line}</p>
                      ))}
                      {card.action && (
                        <a
                          href={card.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs mt-3 font-semibold transition-all duration-200 group-hover:gap-2.5"
                          style={{ color: card.color }}
                        >
                          <ArrowRight size={11} /> {card.action.label}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Map */}
          <div ref={mapRef} className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden h-[480px] lg:h-full min-h-[400px]"
                 style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
              {/* Logo overlay */}
              <div className="absolute top-4 left-4 z-10 rounded-xl px-4 py-2.5 flex items-center gap-2"
                   style={{ background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(224,30,55,0.25)' }}>
                <div className="w-6 h-6 rounded-lg bg-rouge flex items-center justify-center">
                  <ChefHat size={12} className="text-blanc" />
                </div>
                <div>
                  <p className="text-blanc text-xs font-bold font-playfair leading-none">Le Chef</p>
                  <p className="text-blanc/35 text-[9px] tracking-widest uppercase">Restaurant & Café</p>
                </div>
              </div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.8!2d-17.4677!3d14.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQzJzAwLjEiTiAxN8KwMjgnMDMuNyJX!5e0!3m2!1sfr!2ssn!4v1234567890"
                width="100%" height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Restaurant Le Chef"
              />

              {/* Maps button */}
              <a
                href="https://maps.google.com/?q=DIEUPPEUL+I+VILLA+2207+DAKAR"
                target="_blank" rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl text-blanc text-xs font-semibold transition-all"
                style={{
                  background: '#e01e37',
                  boxShadow: '0 4px 16px rgba(224,30,55,0.4)',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(224,30,55,0.6)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(224,30,55,0.4)'}
              >
                <Navigation size={13} /> Ouvrir dans Maps
              </a>
            </div>
          </div>
        </div>

        {/* ── Professional banner ── */}
        <div ref={bannerRef} className="relative rounded-3xl overflow-hidden"
             style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          {/* Background photo */}
          <img
            src="/images/loc.jpg"
            alt="Restaurant Le Chef Dakar"
            className="w-full object-cover"
            style={{ height: 320, objectPosition: 'center 30%' }}
          />

          {/* Multi-layer gradient overlay for pro look */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(105deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.85) 100%)' }} />
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)' }} />

          {/* Decorative red accent */}
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{ background: 'linear-gradient(90deg, transparent, #e01e37, #d4a017, #e01e37, transparent)' }} />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

                {/* Left: branding */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-rouge flex items-center justify-center"
                         style={{ boxShadow: '0 0 20px rgba(224,30,55,0.5)' }}>
                      <ChefHat size={18} className="text-blanc" />
                    </div>
                    <span className="text-blanc/40 text-xs tracking-[0.4em] uppercase">Restaurant & Café</span>
                  </div>

                  <h3 className="font-playfair text-4xl lg:text-5xl text-blanc font-bold mb-2 leading-tight">
                    Le <span className="text-rouge">Chef</span>
                  </h3>

                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, #e01e37, transparent)' }} />
                    <p className="text-blanc/50 text-sm tracking-widest uppercase">Dieuppeul I — Dakar, Sénégal</p>
                  </div>
                  <p className="text-blanc/30 text-xs mt-2">
                    Villa N°2207, En face Université Bourguiba
                  </p>
                </div>

                {/* Right: quick info + CTAs */}
                <div className="flex flex-col gap-4 lg:items-end">
                  {/* Hours pill */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                       style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <div>
                      <p className="text-blanc text-xs font-semibold">Ouvert aujourd'hui</p>
                      <p className="text-blanc/40 text-[10px]">09h30 — 23h00</p>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex items-center gap-3">
                    <a
                      href="#reservation"
                      onClick={e => { e.preventDefault(); document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }) }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-blanc text-sm font-semibold transition-all"
                      style={{ background: '#e01e37', boxShadow: '0 4px 16px rgba(224,30,55,0.4)' }}
                    >
                      Réserver une table
                    </a>
                    <a
                      href="tel:+221338241333"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Phone size={13} /> Appeler
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16"
               style={{ background: 'linear-gradient(to top, rgba(10,10,10,1), transparent)' }} />
        </div>

      </div>
    </section>
  )
}
