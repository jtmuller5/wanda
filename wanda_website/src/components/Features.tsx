export default function Features() {
  const features = [
    {
      icon: "🗣️",
      title: "Voice-First Experience",
      description: "Simply call and speak naturally. No typing, no screen tapping - just tell Wanda what you're looking for.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🧠",
      title: "Smart Personalization", 
      description: "Wanda learns your preferences over time. Love Italian food? She'll remember and suggest the best pasta spots.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "📍",
      title: "Local Discovery",
      description: "Find restaurants, shops, activities, and hidden gems in your area with Google Maps integration.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: "📱",
      title: "Hands-Free Directions",
      description: "Get directions sent directly to your phone via text. Perfect for when you're driving or busy.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🌍",
      title: "Multilingual Support",
      description: "Speak in over 100 languages. Wanda understands and responds in your preferred language.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "⚡",
      title: "Instant Results",
      description: "No app downloads, no account setup. Just call and get recommendations immediately.",
      color: "from-red-500 to-red-600"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Why Choose Wanda?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience the future of local discovery with AI that understands your voice, 
            remembers your preferences, and helps you explore the world around you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:transform hover:-translate-y-2"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="text-5xl mb-6 group-hover:animate-bounce">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover effect border */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 bg-gradient-to-r ${feature.color} p-[2px]`}>
                <div className="h-full w-full rounded-2xl bg-white/90"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <span className="text-2xl">📞</span>
            <span className="text-xl font-semibold">Ready to try? Call (843) 648-9138</span>
          </div>
        </div>
      </div>
    </section>
  )
}