import { Check, ArrowRight } from "lucide-react";

const pricingPlans = [
  {
    name: "Hourly Payment",
    price: "$29",
    period: "h",
    features: ["Amet lorem", "Dolor ipsum", "Sit amet", "Lorem dolor"],
    featured: false,
  },
  {
    name: "Full Time",
    price: "$2999",
    period: "m",
    features: ["Amet lorem", "Dolor ipsum", "Sit amet", "Lorem dolor", "Premium support", "Priority delivery"],
    featured: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-foreground">Price Plans</h2>
          <span className="text-muted-foreground">3</span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl text-center transition-all duration-500 hover:scale-105 ${
                plan.featured
                  ? "bg-primary text-primary-foreground shadow-lime-lg"
                  : "bg-muted border border-border"
              }`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${plan.featured ? "" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <div className="mb-8">
                <span className={`text-5xl font-bold ${plan.featured ? "" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-lg ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  /{plan.period}
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center justify-center gap-3">
                    <Check className={`w-5 h-5 ${plan.featured ? "" : "text-primary"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 
                            transition-all duration-300 hover:gap-4 ${
                  plan.featured
                    ? "bg-primary-foreground text-primary hover:shadow-lg"
                    : "btn-outline-lime"
                }`}
              >
                Order now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
