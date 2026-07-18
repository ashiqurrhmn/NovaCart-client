import Image from "next/image";
import Link from "next/link";

export function FeaturedCards() {
  return (
    <section className="w-full bg-[#f5f0eb] dark:bg-[#111111] py-4 pb-16 mt-16 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="lg:col-span-1 h-[450px] relative rounded-2xl bg-[#f4f4f4] overflow-hidden group">
            <Image 
              src="/assets/featured-1.png" 
              alt="Featured Woman in Hat" 
              fill 
              className="object-cover object-top grayscale transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <Link href="/shop?category=women's%20clothing">
                <button className="bg-white text-black font-semibold text-sm px-6 py-2.5 rounded hover:bg-neutral-100 hover:-translate-y-0.5 transition-all shadow-sm">
                  Explore Now
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="lg:col-span-1 h-[450px] relative rounded-2xl bg-[#f4f4f4] overflow-hidden group">
            <Image 
              src="/assets/featured-2.png" 
              alt="Featured Woman in Black" 
              fill 
              className="object-cover object-top grayscale transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <Link href="/shop?category=women's%20clothing">
                <button className="bg-white text-black font-semibold text-sm px-6 py-2.5 rounded hover:bg-neutral-100 hover:-translate-y-0.5 transition-all shadow-sm">
                  Explore Now
                </button>
              </Link>
            </div>
          </div>

          {/* Column 3 & 4 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Wide Card 1 */}
            <div className="flex-1 min-h-[217px] relative rounded-2xl bg-[#f4f4f4] overflow-hidden flex items-center p-6 md:p-8 group">
              {/* Image */}
              <div className="absolute right-0 top-0 bottom-0 w-[55%] md:w-[50%] transition-transform duration-700 group-hover:scale-105 origin-right">
                <Image 
                  src="/assets/featured-5.png" 
                  alt="Women Collection" 
                  fill 
                  className="object-cover object-right mix-blend-multiply grayscale" 
                />
              </div>
              
              {/* Text Content */}
              <div className="relative z-10 max-w-[200px] md:max-w-[240px]">
                <p className="text-[10px] sm:text-xs tracking-wide text-neutral-500 mb-2 font-medium">
                  Woman Collection
                </p>
                <h3 className="text-xl md:text-2xl font-normal text-black leading-tight mb-5 tracking-tight">
                  Stylish Winter T-Shirt for Woman
                </h3>
                <Link href="/shop?category=women's%20clothing">
                  <button className="bg-transparent border border-neutral-300 text-black font-medium text-[11px] sm:text-xs px-4 py-1.5 rounded hover:bg-black hover:text-white hover:border-black transition-colors">
                    Check Now
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Wide Card 2 */}
            <div className="flex-1 min-h-[217px] relative rounded-2xl bg-[#f4f4f4] overflow-hidden flex items-center p-6 md:p-8 group">
              {/* Image */}
              <div className="absolute right-0 top-0 bottom-0 w-[55%] md:w-[50%] transition-transform duration-700 group-hover:scale-105 origin-right">
                <Image 
                  src="/assets/featured-4.png" 
                  alt="Men Collection" 
                  fill 
                  className="object-cover object-right mix-blend-multiply grayscale" 
                />
              </div>

              {/* Text Content */}
              <div className="relative z-10 max-w-[200px] md:max-w-[240px]">
                <p className="text-[10px] sm:text-xs tracking-wide text-neutral-500 mb-2 font-medium">
                  Men Collection
                </p>
                <h3 className="text-xl md:text-2xl font-normal text-black leading-tight mb-5 tracking-tight">
                  Stylish Winter Shirt for Man
                </h3>
                <Link href="/shop?category=men's%20clothing">
                  <button className="bg-transparent border border-neutral-300 text-black font-medium text-[11px] sm:text-xs px-4 py-1.5 rounded hover:bg-black hover:text-white hover:border-black transition-colors">
                    Check Now
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
