export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Call Wanda",
      description: "Dial (843) 648-9138 from any phone. No app download or account setup required.",
      icon: "📞",
      color: "from-blue-500 to-blue-600"
    },
    {
      step: "2", 
      title: "Tell Wanda What You Want",
      description: "Say what you're looking for: \"I want Italian food\" or \"Find me a coffee shop nearby\"",
      icon: "🗣️",
      color: "from-purple-500 to-purple-600"
    },
    {
      step: "3",
      title: "Get Personalized Results",
      description: "Wanda searches Google Maps and gives you 3 great options based on your preferences.",
      icon: "🎯",
      color: "from-teal-500 to-teal-600"
    },
    {
      step: "4",
      title: "Receive Directions",
      description: "Choose a place and Wanda texts you the Google Maps link with directions.",
      icon: "📱",
      color: "from-green-500 to-green-600"
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            How Wanda Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            It's as simple as making a phone call. No complicated apps, 
            no lengthy signups - just pure, effortless discovery.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 md:space-y-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Step Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-xl flex items-center justify-center shadow-lg`}>
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto md:mx-0">
                  {step.description}
                </p>
              </div>

              {/* Step Visual */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br ${step.color} opacity-10 animate-pulse`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl md:text-9xl animate-bounce">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Example conversation */}
        <div className="mt-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">
              Example Conversation
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  W
                </div>
                <div className="bg-blue-50 rounded-lg p-4 flex-1">
                  <p className="text-slate-800">"Hello! This is Wanda. How can I help you today?"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 flex-row-reverse">
                <div className="bg-slate-300 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  You
                </div>
                <div className="bg-slate-100 rounded-lg p-4 flex-1 text-right">
                  <p className="text-slate-800">"I'm looking for a good sushi restaurant near downtown"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  W
                </div>
                <div className="bg-blue-50 rounded-lg p-4 flex-1">
                  <p className="text-slate-800">"I found 3 great sushi places near downtown! There's Sakura Sushi with fresh rolls and a cozy atmosphere, Tokyo Bay known for their chef's special, and Sushi Zen with outdoor seating. Would you like directions to any of these?"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 flex-row-reverse">
                <div className="bg-slate-300 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  You
                </div>
                <div className="bg-slate-100 rounded-lg p-4 flex-1 text-right">
                  <p className="text-slate-800">"Yes, send me directions to Sakura Sushi please"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  W
                </div>
                <div className="bg-blue-50 rounded-lg p-4 flex-1">
                  <p className="text-slate-800">"Perfect! I've sent the directions to Sakura Sushi to your phone via text message. Enjoy your meal!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}