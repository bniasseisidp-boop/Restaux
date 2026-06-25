import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Phone, MapPin, Mail, Clock, ChefHat, ArrowUp, Heart } from 'lucide-react'

function FacebookIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

gsap.registerPlugin(ScrollTrigger)

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Footer() {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: ref.current, start: 'top 90%' } }
    )
  }, [])

  return (
    <footer ref={ref} className="footer-gradient border-t border-white/5 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-rouge flex items-center justify-center">
                <ChefHat size={17} className="text-blanc" />
              </div>
              <div>
                <h3 className="font-playfair text-xl text-blanc font-bold">Le Chef</h3>
                <p className="text-blanc/30 text-[9px] tracking-[0.4em] uppercase">Restaurant & Café</p>
              </div>
            </div>
            <p className="text-blanc/40 text-xs leading-relaxed mb-6">
              Une expérience gastronomique authentique au cœur de Dakar. Cuisine sénégalaise
              raffinée dans une ambiance chaleureuse depuis 2018.
            </p>
            {/* Social */}
            <a
              href="https://www.facebook.com/people/Restaurant-Cafe-LE-CHEF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877F2]/10 border border-[#1877F2]/20 px-4 py-2 text-[#1877F2] text-xs hover:bg-[#1877F2]/20 transition-colors"
            >
              <FacebookIcon size={13} /> Suivez-nous
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-blanc font-semibold text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
              <div className="w-4 h-px bg-rouge" /> Navigation
            </h4>
            <ul className="space-y-3">
              {[
                ['À Propos', 'about'],
                ['Notre Menu', 'menu'],
                ['Nos Packs', 'packs'],
                ['Tarifs', 'pricing'],
                ['Réservation', 'reservation'],
                ['Localisation', 'location'],
              ].map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-blanc/40 hover:text-rouge text-xs tracking-wide transition-colors flex items-center gap-2"
                  >
                    <div className="w-3 h-px bg-rouge/30 group-hover:w-5 transition-all" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-blanc font-semibold text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
              <div className="w-4 h-px bg-rouge" /> Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={13} className="text-rouge mt-0.5 flex-shrink-0" />
                <p className="text-blanc/40 text-xs leading-relaxed">
                  DIEUPPEUL I, Villa N°2207<br />
                  En face Université Bourguiba<br />
                  Dakar, Sénégal
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={13} className="text-rouge flex-shrink-0" />
                <a href="tel:+221338241333" className="text-blanc/40 hover:text-rouge text-xs transition-colors">
                  +221 33 824 13 33
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={13} className="text-rouge flex-shrink-0" />
                <a href="mailto:contact@lechef-dakar.com" className="text-blanc/40 hover:text-rouge text-xs transition-colors">
                  contact@lechef-dakar.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & WhatsApp */}
          <div>
            <h4 className="text-blanc font-semibold text-sm tracking-widets uppercase mb-5 flex items-center gap-2">
              <div className="w-4 h-px bg-rouge" /> Horaires
            </h4>
            <ul className="space-y-2 mb-6">
              {[
                ['Lundi — Vendredi', '09h30 – 23h00'],
                ['Samedi', '09h30 – 23h30'],
                ['Dimanche', '10h00 – 22h00'],
              ].map(([day, hours]) => (
                <li key={day} className="flex justify-between text-xs gap-3">
                  <span className="text-blanc/40">{day}</span>
                  <span className="text-blanc/70">{hours}</span>
                </li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/221338241333?text=Bonjour%20Le%20Chef%20!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 px-4 py-2.5 text-[#25D366] text-xs hover:bg-[#25D366]/20 transition-colors w-full justify-center"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Commander via WhatsApp
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-rouge/20 to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-blanc/20 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Restaurant Le Chef — Dakar, Sénégal. Tous droits réservés.
          </div>

          {/* MULTI BRAIN TECH signature */}
          <div className="flex items-center gap-2 text-blanc/20 text-xs">
            Made with <Heart size={10} className="text-rouge" /> by{' '}
            <span className="text-rouge/60 font-semibold tracking-wider">MULTI BRAIN TECH</span>
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 border border-rouge/20 flex items-center justify-center text-blanc/30 hover:text-rouge hover:border-rouge transition-all duration-300"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  )
}
