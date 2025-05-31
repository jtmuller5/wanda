import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface PhoneVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  onSuccess: () => void
}

export default function PhoneVerificationModal({ 
  isOpen, 
  onClose, 
  phoneNumber, 
  onSuccess 
}: PhoneVerificationModalProps) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  
  const { setupRecaptcha, signInWithPhone, verifyOtp } = useAuth()

  const sendOtp = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Setup reCAPTCHA
      const appVerifier = setupRecaptcha('recaptcha-container')
      
      // Convert phone number to international format
      const formattedPhone = phoneNumber.startsWith('+1') 
        ? phoneNumber 
        : `+1${phoneNumber.replace(/\D/g, '')}`
      
      // Send OTP
      const result = await signInWithPhone(formattedPhone, appVerifier)
      setConfirmationResult(result)
      setStep('otp')
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      setError(error.message || 'Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtpCode = async () => {
    if (!confirmationResult) return
    
    setLoading(true)
    setError('')
    
    try {
      await verifyOtp(confirmationResult, otp)
      onSuccess()
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      setError('Invalid verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'phone') {
      sendOtp()
    } else {
      verifyOtpCode()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          ×
        </button>

        {/* reCAPTCHA container (invisible) */}
        <div id="recaptcha-container"></div>

        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {step === 'phone' ? 'Verify Your Phone' : 'Enter Verification Code'}
          </h2>
          <p className="text-slate-600">
            {step === 'phone' 
              ? `We'll send a verification code to ${phoneNumber}`
              : `Enter the 6-digit code sent to ${phoneNumber}`
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'phone' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                disabled
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-center text-lg tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (step === 'otp' && otp.length !== 6)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {step === 'phone' ? 'Sending...' : 'Verifying...'}
              </div>
            ) : (
              step === 'phone' ? 'Send Verification Code' : 'Verify & Continue'
            )}
          </button>
        </form>

        {step === 'otp' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setStep('phone')
                setOtp('')
                setError('')
                setConfirmationResult(null)
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Use a different phone number
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
