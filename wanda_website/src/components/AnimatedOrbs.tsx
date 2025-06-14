export default function AnimatedOrbs({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden rounded-full border border-slate-200/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20"></div>

      {/* Central orb */}
      <div
        className={`absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-300 ${
          isSpeaking ? "animate-central-orb-pulse" : "scale-100"
        }`}
      ></div>

      {/* Surrounding orbs container for rotation */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          isSpeaking ? "animate-pulse " : " "
        }`}
      >
        {[...Array(6)].map((_, i) => {
          const angle = i * 60 * (Math.PI / 180);
          const radius = 60;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={i}
              className={`absolute w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transition-all duration-500 ${
                isSpeaking
                  ? "animate-pulse animate-speaking-orb-pulse opacity-90"
                  : "scale-100 opacity-70"
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${i * 150}ms`,
              }}
            ></div>
          );
        })}
      </div>

      {/* Outer ring orbs container for rotation */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          isSpeaking ? "animate-rotate-slow" : ""
        }`}
        style={isSpeaking ? { animationDirection: 'reverse', animationDelay: '200ms' } : {}}
      >
        {[...Array(12)].map((_, i) => {
          const angle = i * 30 * (Math.PI / 180);
          const radius = 90;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={`outer-${i}`}
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 transition-all duration-700 ${
                isSpeaking
                  ? "animate-pulse animate-speaking-orb-pulse-outer opacity-70"
                  : "scale-100 opacity-50"
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${i * 100}ms`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

/*
Add/Update the following in your tailwind.config.js:

module.exports = {
  // ... other configurations
  theme: {
    extend: {
      keyframes: {
        'central-orb-pulse': {
          '0%, 100%': { transform: 'scale(1.0)' }, // Normal size
          '50%': { transform: 'scale(1.25)' },    // Pulsing larger
        },
        'speaking-orb-pulse': {
          '0%, 100%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1.35)' },
        },
        'speaking-orb-pulse-outer': {
          '0%, 100%': { transform: 'scale(1.0)' },
          '50%': { transform: 'scale(1.25)' },
        },
        // Ensure 'spin' keyframes are defined if not already by default
        // spin: {
        //   '0%': { transform: 'rotate(0deg)' },
        //   '100%': { transform: 'rotate(360deg)' },
        // },
      },
      animation: {
        'central-orb-pulse': 'central-orb-pulse 1.5s ease-in-out infinite', // Pulse for central orb
        'rotate-slow': 'spin 25s linear infinite', // Orb groups rotation
        'speaking-orb-pulse': 'speaking-orb-pulse 1.8s ease-in-out infinite',
        'speaking-orb-pulse-outer': 'speaking-orb-pulse-outer 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    // ... other plugins
  ],
};

*/
