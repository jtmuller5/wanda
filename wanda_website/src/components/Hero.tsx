import WebCallWidget from './WebCallWidget';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-16">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center my-52">
        {/* Logo/Brand */}
        <div className="mb-4 ">
          <p className="text-base md:text-base text-slate-600 mt-2 font-light tracking-wide">
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
        </div>

        {/* Call-to-action */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <span className="text-2xl">📞</span>
            <span className="text-xl font-semibold">
              Ready to try? Call (843) 648-9138
            </span>
          </div>
        </div>
      </div>

      {/* Web Call Widget */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 text-slate-600">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="px-4 text-sm font-medium">OR TRY IT ON THE WEB</span>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>
        </div>
        
        <WebCallWidget 
          apiKey={import.meta.env.VITE_VAPI_PUBLIC_KEY || ''}
          serverUrl={import.meta.env.VITE_API_URL || 'http://localhost:3000'}
        />
      </div>
    </div>
  );
}
