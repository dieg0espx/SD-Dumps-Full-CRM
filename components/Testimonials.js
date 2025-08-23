import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "John Smith",
    role: "Homeowner",
    image: "/placeholder.svg",
    text: "SD Dumps made my home cleanout so easy! The dumpster arrived on time and the team was super helpful.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Contractor",
    image: "/placeholder.svg",
    text: "Reliable, fast, and affordable. I use SD Dumps for all my renovation projects.",
    rating: 5,
  },
  {
    name: "Mike Davis",
    role: "Business Owner",
    image: "/placeholder.svg",
    text: "Great service and transparent pricing. Highly recommend for any business waste needs!",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Landlord",
    image: "/placeholder.svg",
    text: "The best dumpster rental experience I&apos;ve had. Will use again for my properties.",
    rating: 5,
  },
  {
    name: "Carlos Rivera",
    role: "Remodeler",
    image: "/placeholder.svg",
    text: "Quick delivery and pick-up. The tonnage packages are perfect for my jobs.",
    rating: 5,
  },
  {
    name: "Lisa Patel",
    role: "Event Planner",
    image: "/placeholder.svg",
    text: "We used SD Dumps for a large event and everything went smoothly. Super professional!",
    rating: 5,
  },
];

const settings = {
  infinite: true,
  speed: 700,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  arrows: false,
  dots: false,
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            What our clients are saying
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Real feedback from our happy customers.
          </p>
        </div>
        <Slider {...settings} className="max-w-7xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="px-2 sm:px-3">
              <div className="bg-muted/30 rounded-lg p-6 sm:p-8 shadow-sm border border-border flex flex-col items-center min-h-[280px] sm:min-h-[320px]">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="rounded-full mb-4 border-2 border-border"
                />
                <h4 className="font-semibold text-foreground text-base sm:text-lg mb-1">{t.name}</h4>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4">{t.role}</p>
                <div className="flex text-yellow-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground text-center leading-relaxed text-sm sm:text-base flex-1 flex items-center">
                  &quot;{t.text}&quot;
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
