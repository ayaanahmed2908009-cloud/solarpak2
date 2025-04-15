import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  if (isLoading) {
    return (
      <section id="stories" className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Stories of Impact</h2>
            <p className="text-white text-opacity-80 text-lg">Hear from the families whose lives have been transformed</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse bg-white bg-opacity-10 p-8 rounded-xl h-64"></div>
          </div>
        </div>
      </section>
    );
  }

  const firstTestimonial = testimonials && testimonials.length > 0 ? testimonials[0] : null;

  return (
    <section id="stories" className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Stories of Impact</h2>
          <p className="text-white text-opacity-80 text-lg">Hear from the families whose lives have been transformed</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="testimonial-slider relative">
            {firstTestimonial && (
              <div className="testimonial-slide bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-primary mx-auto">
                      <img 
                        src={firstTestimonial.imageUrl} 
                        alt={`Testimonial from ${firstTestimonial.name}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-primary mb-3 flex">
                      {Array.from({ length: firstTestimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg mb-6 italic">
                      "{firstTestimonial.message}"
                    </blockquote>
                    
                    <div>
                      <p className="font-heading font-bold text-xl">{firstTestimonial.name}</p>
                      <p className="text-white text-opacity-70">{firstTestimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Testimonial navigation - simplified for MVP */}
            <div className="flex justify-center mt-8 space-x-2">
              <button 
                className="w-3 h-3 rounded-full bg-white bg-opacity-70 focus:outline-none" 
                aria-label="Go to slide 1"
              ></button>
              <button 
                className="w-3 h-3 rounded-full bg-white bg-opacity-30 focus:outline-none" 
                aria-label="Go to slide 2"
              ></button>
              <button 
                className="w-3 h-3 rounded-full bg-white bg-opacity-30 focus:outline-none" 
                aria-label="Go to slide 3"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
