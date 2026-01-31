import { useQuery } from "@tanstack/react-query";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@shared/schema";
import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        
        // Reset animation state after transition
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials, isAnimating]);

  // Navigate to a specific testimonial
  const goToTestimonial = (index: number) => {
    if (isAnimating || !testimonials) return;
    setIsAnimating(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Navigate to previous testimonial
  const prevTestimonial = () => {
    if (!testimonials || testimonials.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Navigate to next testimonial
  const nextTestimonial = () => {
    if (!testimonials || testimonials.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <section id="stories" className="section-container bg-gradient-to-r from-primary via-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1 bg-white/10 text-white rounded-full text-sm font-medium mb-4">Testimonials</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Stories of Impact</h2>
            <p className="text-white text-opacity-80 text-lg">Hear from the families whose lives have been transformed</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse shimmer bg-white/10 p-8 rounded-xl h-64"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || !testimonials.length) {
    return null;
  }

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="stories" className="section-container relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/80 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <Quote className="absolute top-20 left-20 w-32 h-32 text-white/10 rotate-12" strokeWidth={1} />
        <Quote className="absolute bottom-20 right-20 w-24 h-24 text-white/10 -rotate-12" strokeWidth={1} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1 bg-white/10 text-white rounded-full text-sm font-medium mb-4">Testimonials</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Stories of Impact</h2>
          <p className="text-white/80 text-lg">Hear from the families whose lives have been transformed</p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation buttons */}
          {testimonials.length > 1 && (
            <>
              <button 
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                disabled={isAnimating}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                disabled={isAnimating}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          <div className="testimonial-slider relative overflow-hidden rounded-2xl shadow-lg">
            <div className="relative bg-white/10 p-8 md:p-12 backdrop-blur-sm border border-white/10 rounded-2xl">
              {/* Large quote mark decoration */}
              <div className="absolute top-6 left-6 text-white/10">
                <Quote className="w-16 h-16" strokeWidth={1} />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center relative z-10">
                <div className="mb-8 md:mb-0 md:mr-10 flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 mx-auto shadow-xl">
                    <div className="w-full h-full bg-blue-300/30"></div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="text-yellow-300 mb-4 flex">
                    {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl mb-6 italic text-white leading-relaxed transition-opacity duration-300" style={{opacity: isAnimating ? 0.5 : 1}}>
                    "{activeTestimonial.message}"
                  </blockquote>
                  
                  <div className="border-t border-white/10 pt-4">
                    <p className="font-heading font-bold text-xl">{activeTestimonial.name}</p>
                    <p className="text-white/70">{activeTestimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial navigation dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}