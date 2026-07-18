export function MarqueeBanner() {
  const marqueeTexts = [
    "NOVA CART",
    "AI POWERED",
    "NEW ARRIVALS",
    "AI GENERATED",
    "FREE SHIPPING",
    "SUMMER SALE"
  ];
  
  // Duplicate it to ensure it's long enough to cover the screen
  const repetitions = [...marqueeTexts, ...marqueeTexts];

  return (
    <div className="w-full overflow-hidden bg-[#111111] dark:bg-black py-3 sm:py-4 flex relative select-none">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {/* First Set */}
        <div className="flex items-center">
          {repetitions.map((text, i) => (
            <div key={`set1-${i}`} className="flex items-center">
              <span className="text-white text-sm sm:text-base font-bold tracking-[0.2em] uppercase mx-4 sm:mx-6">
                {text}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="mx-2 sm:mx-4 shrink-0">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          ))}
        </div>
        
        {/* Second Set (Duplicate for seamless loop) */}
        <div className="flex items-center">
          {repetitions.map((text, i) => (
            <div key={`set2-${i}`} className="flex items-center">
              <span className="text-white text-sm sm:text-base font-bold tracking-[0.2em] uppercase mx-4 sm:mx-6">
                {text}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="mx-2 sm:mx-4 shrink-0">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
