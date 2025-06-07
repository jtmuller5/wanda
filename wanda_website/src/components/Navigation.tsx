import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import PhoneVerificationModal from './PhoneVerificationModal'

interface NavigationProps {
  transparent?: boolean
}

export default function Navigation({ transparent = false }: NavigationProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleLoginClick = () => {
    setShowPhoneInput(true)
  }

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false)
    setShowPhoneInput(false)
    setPhoneNumber('')
    // Navigation will be handled by the app routing logic
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

  const handlePhoneSubmit = () => {
    if (phoneNumber && phoneNumber.length >= 14) {
      setShowVerificationModal(true)
      setShowPhoneInput(false)
    }
  }

  const navClasses = transparent 
    ? "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-white/20"
    : "bg-white shadow-sm border-b border-slate-200"

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center space-x-3">
              {/* Clickable logo section */}
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 -m-1"
              >
                {/* Placeholder for icon */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                
                <h1 className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wanda
                </h1>
              </button>
            </div>

            {/* Center - Phone Number */}
            <div className="flex items-center">
              {/* Desktop version */}
              <a 
                href="tel:+18436489138" 
                className="hidden md:inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-lg font-semibold text-blue-600 group-hover:text-blue-700">
                  (843) 648-9138
                </span>
                <span className="ml-2 text-lg group-hover:animate-bounce">📱</span>
              </a>
              
              {/* Mobile version */}
              <a 
                href="tel:+18436489138" 
                className="md:hidden inline-flex items-center px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200 group"
                title="Call Wanda: (843) 648-9138"
              >
                <span className="text-xl group-hover:animate-bounce">📱</span>
              </a>
            </div>

            {/* Right side - Auth buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-slate-600">
                    {user.phoneNumber}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  {showPhoneInput ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-40 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        maxLength={14}
                        autoFocus
                      />
                      <button
                        onClick={handlePhoneSubmit}
                        disabled={phoneNumber.length < 14}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-colors"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => {
                          setShowPhoneInput(false)
                          setPhoneNumber('')
                        }}
                        className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleLoginClick}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-200"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false)
          setShowPhoneInput(false)
          setPhoneNumber('')
        }}
        phoneNumber={phoneNumber}
        onSuccess={handleVerificationSuccess}
      />
    </>
  )
}