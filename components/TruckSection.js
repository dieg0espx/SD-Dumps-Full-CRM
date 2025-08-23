import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function TruckSection() {
  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef(null);
  
  // Simple counting function
  const startCounting = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsAnimating(true);
    
    console.log('Starting simple counting...');
    
    // Count years (0 to 25)
    let yearCount = 0;
    const yearInterval = setInterval(() => {
      yearCount += 1;
      setYears(yearCount);
      if (yearCount >= 25) {
        clearInterval(yearInterval);
      }
    }, 60); // 60ms per increment = ~1.5 seconds total
    
    // Count projects (0 to 500)
    let projectCount = 0;
    const projectInterval = setInterval(() => {
      projectCount += 20;
      setProjects(projectCount);
      if (projectCount >= 500) {
        setProjects(500);
        clearInterval(projectInterval);
      }
    }, 80); // 80ms per increment = ~2 seconds total
    
    // Count satisfaction (0 to 98)
    let satisfactionCount = 0;
    const satisfactionInterval = setInterval(() => {
      satisfactionCount += 4;
      setSatisfaction(satisfactionCount);
      if (satisfactionCount >= 98) {
        setSatisfaction(98);
        clearInterval(satisfactionInterval);
        setIsAnimating(false);
        console.log('Counting completed!');
      }
    }, 70); // 70ms per increment = ~1.8 seconds total
  };
  
  // Reset function
  const resetCounting = () => {
    setYears(0);
    setProjects(0);
    setSatisfaction(0);
    setIsAnimating(false);
    setHasStarted(false);
    console.log('Counters reset');
  };
  
  // Intersection observer to trigger when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(`Section visible: ${entry.isIntersecting}, hasStarted: ${hasStarted}`);
        if (entry.isIntersecting && !hasStarted) {
          console.log('Section came into view - starting counting!');
          startCounting();
        }
      },
      { 
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Start a bit before it's fully visible
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      console.log('Intersection observer set up');
    }
    
    return () => {
      observer.disconnect();
      console.log('Intersection observer cleaned up');
    };
  }, [hasStarted, startCounting]); // Include hasStarted and startCounting in dependencies

  console.log(`Current values - years: ${years}, projects: ${projects}, satisfaction: ${satisfaction}, animating: ${isAnimating}`);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands of Customers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            With over two decades of experience, we&apos;ve built a reputation for excellence in waste management and container services.
          </p>
        </div>
        
        <div className="rounded-lg overflow-hidden mb-8 sm:mb-12">
          <Image
            src="/placeholder.svg"
            alt="Truck with containers"
            width={800}
            height={500}
            className="w-full object-cover h-[300px] sm:h-[400px] lg:h-[500px]"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand mb-1 sm:mb-2">
              {years}+
            </div>
            <div className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-tight">
              Years of Experience
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand mb-1 sm:mb-2">
              {projects}+
            </div>
            <div className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-tight">
              Completed Projects
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand mb-1 sm:mb-2">
              {satisfaction}%
            </div>
            <div className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-tight">
              Client Satisfaction
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand mb-1 sm:mb-2">
              24/7
            </div>
            <div className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-tight">
              Customer Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
