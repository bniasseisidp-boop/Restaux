import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const PLANS = [
  {
    id: 1,
    name: 'Formule Rapide',
    subtitle: 'Pour aller vite',
    price: '5 000',
    per: 'par personne',
    popular: false,
    color: 'border-white/10',
    features: [
      'Plat du jour au choix',
      'Boisson incluse',
      'Dessert maison',
      'Service 20 min max',
      'Pain artisanal',
      null,
    ],
  },
  {
    id: 2,
    name: 'Formule Midi',
    subtitle: 'Le classique du Chef',
    price: '8 500',
    per: 'par personne',
    popular: true,
    color: 'border-rouge',
    features: [
      'Entrée au choix',
      'Plat principal',
      'Dessert maison',
      'Boisson fraîche',
      'Pain et mise en bouche',
      'Café ou thé',
    ],
  },
  {
    id: 3,
    name: 'Pack Premium',
    subtitle: "L'expérience complète",
    price: '15 000',
    per: 'par personne',
    popular: false,
    color: 'border-white/10',
    features: [
      '3 services complets',
      'Vin ou boisson premium',
      'Pain & mise en bouche',
      'Dessert gastronomique',
      'Café & mignardises',
      'Service personnalisé',
    ],
  },
]

function PricingCard({ plan, index }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.7,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' }
      }
    )
  }, [index])

  return (
    <div
      ref={ref}
      className={`relative border ${plan.color} transition-all duration-500 ${
        plan.popular ? 'bg-noir-700 scale-105 shadow-2xl shadow-rouge/20' : 'bg-noir-700/50'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-rouge text-blanc text-[10px] px-5 py-1.5 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles size={10} /> Plus populaire
          </div>
        </div>
      )}

      {plan.popular && (
        <div className="absolute inset-0 pointer-events-none"
             style={{ boxShadow: 'inset 0 0 40px rgba(224,30,55,0.05)' }} />
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-blanc/40 text-xs tracking-widest uppercase mb-2">{plan.subtitle}</p>
          <h3 className="font-playfair text-2xl text-blanc font-bold mb-6">{plan.name}</h3>
          <div className="flex items-end gap-2">
            <span className="font-playfair text-5xl text-blanc font-bold">{plan.price}</span>
            <div>
              <span className="text-rouge font-bold">FCFA</span>
              <p className="text-blanc/30 text-xs">{plan.per}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px w-full mb-8 ${plan.popular ? 'bg-rouge/30' : 'bg-white/5'}`} />

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className={`flex items-center gap-3 text-sm ${feature ? 'text-blanc/70' : 'text-blanc/20'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                feature
                  ? plan.popular ? 'bg-rouge/20 border border-rouge/40' : 'bg-white/5 border border-white/10'
                  : 'bg-white/5'
              }`}>
                {feature && <Check size={11} className={plan.popular ? 'text-rouge' : 'text-blanc/50'} />}
              </div>
              <span>{feature || '—'}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
          className={`w-full py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
            plan.popular
              ? 'bg-rouge text-blanc hover:bg-rouge-bright glow-red-hover'
              : 'border border-white/10 text-blanc/70 hover:text-blanc hover:border-rouge/50'
          }`}
        >
          Choisir cette formule
        </button>
      </div>
    </div>
  )
}

export default function Pricing() {
  const headerRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: headerRef.current, start: 'top 80%' } }
    )
  }, [])

  return (
    <section id="pricing" className="py-24 bg-noir-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 80px)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={headerRef} className="text-center mb-20">
          <span className="section-label">Nos Tarifs</span>
          <h2 className="section-title mb-4">
            Des Prix <span className="text-gradient-red italic">Transparents</span>
          </h2>
          <p className="text-blanc/50 max-w-xl mx-auto text-sm leading-relaxed">
            Qualité supérieure à prix juste. Chaque formule inclut le service et les taxes.
            Possibilité de personnalisation sur demande.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-blanc/30 text-xs mt-12 max-w-md mx-auto">
          * Tarifs par personne, taxes incluses. Pour les groupes (+10 personnes), contactez-nous pour un devis personnalisé.
          Paiement sur place : espèces, Orange Money, Wave.
        </p>
      </div>
    </section>
  )
}
