import { Truck, Package, BadgeCheck, Lock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Truck className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "FAST DELIVERY",
      description: "Quick & safe delivery",
    },
    {
      icon: <Package className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "EASY RETURNS",
      description: "Within 15 days",
    },
    {
      icon: <BadgeCheck className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "QUALITY ASSURED",
      description: "Best fashion, best quality",
    },
    {
      icon: <Lock className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />,
      title: "SECURE PAYMENT",
      description: "100% secure checkout",
    },
  ];

  return (
    <section className="w-full bg-[#ebebeb] dark:bg-[#151515] py-12 sm:py-16 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 justify-start lg:justify-center">
              <div className="text-neutral-800 dark:text-neutral-200">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[11px] sm:text-[12px] font-bold uppercase tracking-widest text-[#1a1a1a] dark:text-white mb-1 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-neutral-600 dark:text-neutral-400 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
