export default function AnimatedOrbs({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden rounded-full border border-slate-200/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20"></div>

      {/* Central orb */}
      <div
        className={`absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 transition-all duration-300 ${
          isSpeaking ? "animate-pulse scale-110" : "scale-100"
        }`}
      ></div>

      {/* Surrounding orbs */}
      {[...Array(6)].map((_, i) => {
        const angle = i * 60 * (Math.PI / 180);
        const radius = 60; // Reduced from 80 to keep within bounds
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            className={`absolute w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transition-all duration-500 ${
              isSpeaking
                ? "animate-pulse scale-125 opacity-80"
                : "scale-75 opacity-40"
            }`}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              animationDelay: `${i * 100}ms`,
            }}
          ></div>
        );
      })}

      {/* Outer ring orbs */}
      {[...Array(12)].map((_, i) => {
        const angle = i * 30 * (Math.PI / 180);
        const radius = 90; // Reduced from 120 to keep within bounds
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={`outer-${i}`}
            className={`absolute w-3 h-3 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 transition-all duration-700 ${
              isSpeaking
                ? "animate-pulse scale-150 opacity-60"
                : "scale-50 opacity-20"
            }`}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              animationDelay: `${i * 50}ms`,
            }}
          ></div>
        );
      })}
    </div>
  );
}
