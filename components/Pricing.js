import { cn } from "../lib/utils";
import { Check, Star } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "17 Yard Dumpster",
      price: "$595",
      description: "Perfect for home cleanouts and small renovation projects",
      features: [
        "Includes 2 tons of disposal",
        "16' long x 8' wide x 4' high",
        "Flexible rental periods",
        "Drop-off and pick-up included",
        "Additional tonnage: $125 per ton"
      ],
      popular: false
    },
    {
      name: "21 Yard Dumpster", 
      price: "$695",
      description: "Great for medium renovation projects and roof repairs",
      features: [
        "Includes 2 tons of disposal",
        "20' long x 8' wide x 4.5' high",
        "Flexible rental periods", 
        "Drop-off and pick-up included",
        "Additional tonnage: $125 per ton",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Concrete & Dirt",
      price: "Call Us",
      description: "Specialized containers for concrete and dirt disposal",
      features: [
        "Custom pricing based on project",
        "Specialized containers",
        "Professional consultation",
        "Permit assistance included",
        "Dedicated project manager"
      ],
      popular: false
    }
  ];

  const handlePlanSelection = (planName, isContact = false) => {
    if (isContact || planName === "Concrete & Dirt") {
      // For concrete/dirt or contact plans, direct to contact
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // For other packages, open email with plan details
      const subject = encodeURIComponent(`${planName} - Rental Request`);
      const body = encodeURIComponent(`Hi, I'm interested in the ${planName}. Please contact me to proceed with the rental.`);
      window.location.href = `mailto:sandiegodumpingsolutions@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose the right dumpster size for your project. All prices include 2 tons of disposal with additional charges for extra tonnage.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={cn(
                "relative rounded-lg border bg-card shadow-sm transition-all duration-200",
                "hover:shadow-md",
                plan.popular && "border-brand shadow-lg scale-105 z-10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="inline-flex items-center gap-1 bg-brand text-brand-foreground px-3 py-1 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="space-y-6 p-6 sm:p-8">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {plan.price}
                      {plan.price !== "Call Us" && <span className="text-sm font-normal text-muted-foreground">/rental</span>}
                    </h3>
                    <p className="font-semibold text-base sm:text-lg text-foreground">{plan.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handlePlanSelection(plan.name, index === 2)}
                  className={cn(
                    "w-full px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "touch-target",
                    plan.popular 
                      ? "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm"
                      : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {index === 2 ? "Call Us" : "Choose Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Charges Section */}
        <div className="mt-12 bg-gray-50 rounded-lg border p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Additional Charges</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="font-medium text-foreground">Extra Tonnage</div>
              <div className="text-2xl font-bold text-brand">$125</div>
              <div className="text-muted-foreground">per ton</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Appliances</div>
              <div className="text-2xl font-bold text-brand">$30</div>
              <div className="text-muted-foreground">each</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Extra Days</div>
              <div className="text-2xl font-bold text-brand">$30</div>
              <div className="text-muted-foreground">per day</div>
            </div>
          </div>
        </div>

        {/* Mobile-specific note */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Need a custom solution? Contact us for personalized pricing based on your specific requirements.
          </p>
        </div>
      </div>
    </section>
  );
}
