import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award, Leaf, Flame } from 'lucide-react'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  { icon: Flame, title: 'Passion', desc: 'Chaque plat est le résultat d\'un amour profond de la cuisine sénégalaise.' },
  { icon: Leaf, title: 'Fraîcheur', desc: 'Ingrédients sélectionnés chaque matin auprès de nos producteurs locaux.' },
  { icon: Award, title: 'Excellence', desc: 'Standards gastronomiques de haute qualité, service attentionné et chaleureux.' },
]

const PHOTOS = [
  { src: '/images/pr1.jpg', alt: 'Plat Le Chef', className: 'w-full h-56 object-cover', delay: 0 },
  { src: '/images/acc.jpg', alt: 'Ambiance Le Chef', className: 'w-full h-56 object-cover mt-8', delay: 0.1 },
  { src: '/images/pr2.jpg', alt: 'Cuisine Le Chef', className: 'w-full h-44 object-cover -mt-4', delay: 0.2 },
  { src: '/images/ex.jpg', alt: 'Salle Le Chef', className: 'w-full h-44 object-cover mt-4', delay: 0.3 },
]

export default function About() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(leftRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: leftRef.current, start: 'top 75%' } }
    )
    gsap.fromTo(rightRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: rightRef.current, start: 'top 75%' } }
    )
    gsap.fromTo('.stat-item',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } }
    )
  }, [])

  return (
    <section id="about" className="py-24 bg-noir-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5"
           style={{ background: 'linear-gradient(to left, #e01e37, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Images collage */}
          <div ref={leftRef} className="relative">
            <div className="grid grid-cols-2 gap-3">
              {PHOTOS.map((photo, i) => (
                <motion.div
                  key={i}
                  className={`rounded-2xl overflow-hidden ${photo.className.includes('mt-8') ? 'mt-8' : photo.className.includes('-mt-4') ? '-mt-4' : photo.className.includes('mt-4') ? 'mt-4' : ''}`}
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(224,30,55,0.15), 0 8px 32px rgba(0,0,0,0.5)' }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className={`w-full object-cover transition-transform duration-700 hover:scale-105 ${photo.className.includes('h-56') ? 'h-56' : 'h-44'}`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-4 left-4 rounded-2xl p-5 backdrop-blur"
              style={{ background: 'rgba(10,10,10,0.92)', border: '1px solid rgba(224,30,55,0.3)', boxShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
              <p className="text-rouge font-bold text-2xl font-playfair">+6</p>
              <p className="text-blanc/50 text-xs mt-1 tracking-widest uppercase">Années d'Excellence</p>
            </motion.div>
          </div>

          {/* Text content */}
          <div ref={rightRef}>
            <span className="section-label">Notre Histoire</span>
            <h2 className="section-title mb-6">
              Un Restaurant <br />
              <span className="text-gradient-red italic">Né de la Passion</span>
            </h2>

            <div className="space-y-4 text-blanc/60 text-sm leading-relaxed mb-8">
              <p>
                Fondé en 2018 au cœur de Dieuppeul, <strong className="text-blanc">Restaurant Le Chef</strong> est né
                d'une passion profonde pour la gastronomie sénégalaise et africaine. Notre chef, fort de
                plus de 15 ans d'expérience, réinvente chaque jour les recettes traditionnelles.
              </p>
              <p>
                Du thiéboudienne royal aux grillades flambées, chaque plat raconte une histoire.
                Nous sélectionnons nos ingrédients chaque matin auprès des producteurs locaux
                pour garantir la fraîcheur et l'authenticité de nos saveurs.
              </p>
              <p>
                Que vous veniez pour un déjeuner d'affaires, un dîner romantique ou un repas en
                famille, l'équipe du Chef vous accueille dans une ambiance chaleureuse et élégante.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4 mb-10">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-rouge/10 border border-rouge/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-rouge/20 group-hover:scale-110 transition-all mt-0.5"
                       style={{ boxShadow: '0 2px 8px rgba(224,30,55,0.1)' }}>
                    <Icon size={16} className="text-rouge" />
                  </div>
                  <div>
                    <h4 className="text-blanc font-semibold text-sm mb-1">{title}</h4>
                    <p className="text-blanc/40 text-xs leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-rouge"
            >
              Réservez une expérience
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: '200+', label: 'Plats par jour' },
            { value: '50+', label: 'Recettes originales' },
            { value: '15', label: 'Ans d\'expérience chef' },
            { value: '98%', label: 'Clients satisfaits' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="stat-item bg-noir-800 px-8 py-8 text-center group cursor-default rounded-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
              whileHover={{
                y: -4,
                boxShadow: '0 12px 32px rgba(224,30,55,0.15), 0 4px 20px rgba(0,0,0,0.3)',
                borderColor: 'rgba(224,30,55,0.3)',
              }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-playfair text-4xl text-rouge font-bold mb-2">{stat.value}</p>
              <p className="text-blanc/40 text-xs tracking-widest uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
