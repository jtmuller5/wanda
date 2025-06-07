import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation transparent={true} />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}
