import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Menu from '../components/Menu/Menu'
import Packs from '../components/Packs/Packs'
import Pricing from '../components/Pricing/Pricing'
import Reservation from '../components/Reservation/Reservation'
import Location from '../components/Location/Location'
import Footer from '../components/Footer/Footer'

export default function Home() {
  return (
    <div className="bg-noir-900 min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Packs />
      <Pricing />
      <Reservation />
      <Location />
      <Footer />
    </div>
  )
}
