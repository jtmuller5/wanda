export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Wanda
            </h3>
            <p className="text-slate-300 text-lg mb-6 max-w-md">
              Your voice-first local discovery companion. Find amazing places without taking your eyes off the road.
            </p>
            
            {/* Phone CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 max-w-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">📞</div>
                <p className="text-sm mb-2">Call Wanda Now</p>
                <a 
                  href="tel:+18436489138" 
                  className="text-2xl font-bold hover:text-blue-200 transition-colors"
                >
                  (843) 648-9138
                </a>
                <p className="text-xs mt-2 text-blue-100">Available 24/7</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-slate-300">
              <li>Voice Search</li>
              <li>Smart Recommendations</li>
              <li>Text Directions</li>
              <li>Multi-language Support</li>
              <li>Preference Learning</li>
              <li>No App Required</li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Find</h4>
            <ul className="space-y-2 text-slate-300">
              <li>Restaurants</li>
              <li>Coffee Shops</li>
              <li>Shopping</li>
              <li>Entertainment</li>
              <li>Activities</li>
              <li>Local Gems</li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">100+</div>
              <div className="text-slate-400 text-sm">Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-slate-400 text-sm">Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-400">0s</div>
              <div className="text-slate-400 text-sm">Setup Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">∞</div>
              <div className="text-slate-400 text-sm">Discoveries</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm">
            © 2025 Wanda. Built for the Vapi Build Challenge.
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-slate-400 text-sm">Powered by:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300">Vapi</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm text-slate-300">Google Maps</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm text-slate-300">OpenAI</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-8">
          <p className="text-slate-300 text-lg mb-4">
            Ready to discover amazing places? Give Wanda a call!
          </p>
          <a 
            href="tel:+18436489138"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <span>📞</span>
            <span>Call (843) 648-9138</span>
          </a>
        </div>
      </div>
    </footer>
  )
}