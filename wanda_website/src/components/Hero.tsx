import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneVerificationModal from './PhoneVerificationModal'

export default function Hero() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (phoneNumber && phoneNumber.length >= 14) {
      setShowVerificationModal(true)
    }
  }

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false)
    navigate('/dashboard')
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
            Wanda
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mt-2 font-light tracking-wide">
            Your Voice-First Local Discovery Companion
          </p>
        </div>

        {/* Main headline */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Discover Amazing Places
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Without Taking Your Eyes Off The Road
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Call Wanda to find restaurants, shops, and activities near you. Get personalized recommendations 
            based on your preferences, and receive directions via text - all hands-free.
          </p>
        </div>

        {/* Phone number input */}
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  maxLength={14}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  📱
                </div>
              </div>
              <button
                onClick={handleGetStarted}
                disabled={phoneNumber.length < 14}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Get Started
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-3">
              Enter your phone number to access your Wanda profile and call history
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Ready to Explore? Call Wanda Now!
              </h3>
              <a 
                href="tel:+18436489138" 
                className="inline-flex items-center text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                (843) 648-9138
                <span className="ml-3 text-2xl group-hover:animate-bounce">📱</span>
              </a>
              <p className="text-slate-600 mt-4">
                Available 24/7 • No app download required
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">100+</div>
            <div className="text-slate-600">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">24/7</div>
            <div className="text-slate-600">Always Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-600">0s</div>
            <div className="text-slate-600">Setup Time</div>
          </div>
        </div>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        phoneNumber={phoneNumber}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  )
}