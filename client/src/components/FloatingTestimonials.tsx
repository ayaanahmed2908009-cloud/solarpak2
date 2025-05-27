import { useState, useEffect } from "react";
import { Star, Heart, MapPin } from "lucide-react";

interface FloatingTestimonial {
  id: string;
  name: string;
  location: string;
  message: string;
  donationAmount: number;
  timeAgo: string;
  avatar: string;
}

export default function FloatingTestimonials() {
  const [testimonials, setTestimonials] = useState<FloatingTestimonial[]>([]);
  const [visibleTestimonials, setVisibleTestimonials] = useState<string[]>([]);

  const realTestimonials: FloatingTestimonial[] = [
    {
      id: "1",
      name: "Sarah Ahmed",
      location: "London, UK",
      message: "Seeing Hassan's family get electricity brought tears to my eyes. This is real change!",
      donationAmount: 150,
      timeAgo: "2 minutes ago",
      avatar: "👩‍💼"
    },
    {
      id: "2", 
      name: "Muhammad Ali",
      location: "Toronto, Canada",
      message: "As a Pakistani living abroad, this connects me to my homeland. Allah bless this work.",
      donationAmount: 500,
      timeAgo: "5 minutes ago",
      avatar: "👨‍💻"
    },
    {
      id: "3",
      name: "Fatima Khan",
      location: "Dubai, UAE",
      message: "My donation helped power a school! 50 children now have lights to study by.",
      donationAmount: 250,
      timeAgo: "8 minutes ago",
      avatar: "👩‍🏫"
    },
    {
      id: "4",
      name: "Omar Hassan",
      location: "New York, USA",
      message: "Ramadan Mubarak! Doubled my donation this holy month for our Pakistani brothers.",
      donationAmount: 300,
      timeAgo: "12 minutes ago",
      avatar: "🧔‍♂️"
    },
    {
      id: "5",
      name: "Zara Malik",
      location: "Sydney, Australia",
      message: "Incredible transparency! I can see exactly which village my $100 helped.",
      donationAmount: 100,
      timeAgo: "15 minutes ago",
      avatar: "👩‍🔬"
    }
  ];

  useEffect(() => {
    setTestimonials(realTestimonials);
    
    // Show testimonials one by one with delays
    const showTestimonial = (index: number) => {
      setTimeout(() => {
        setVisibleTestimonials(prev => [...prev, realTestimonials[index].id]);
      }, index * 2000);
    };

    realTestimonials.forEach((_, index) => {
      showTestimonial(index);
    });

    // Cycle through testimonials continuously
    const interval = setInterval(() => {
      setVisibleTestimonials(prev => {
        const next = [...prev];
        if (next.length > 0) {
          next.shift(); // Remove first testimonial
          // Add a new random testimonial after a delay
          setTimeout(() => {
            const randomTestimonial = realTestimonials[Math.floor(Math.random() * realTestimonials.length)];
            setVisibleTestimonials(current => {
              if (!current.includes(randomTestimonial.id)) {
                return [...current, randomTestimonial.id];
              }
              return current;
            });
          }, 1000);
        }
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getRandomPosition = (index: number) => {
    const positions = [
      { top: '15%', left: '10%', rotate: '-5deg' },
      { top: '25%', right: '15%', rotate: '3deg' },
      { top: '45%', left: '8%', rotate: '2deg' },
      { top: '60%', right: '12%', rotate: '-3deg' },
      { top: '75%', left: '20%', rotate: '4deg' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {testimonials.map((testimonial, index) => {
        const isVisible = visibleTestimonials.includes(testimonial.id);
        const position = getRandomPosition(index);
        
        if (!isVisible) return null;

        return (
          <div
            key={testimonial.id}
            className="absolute animate-fadeIn pointer-events-auto"
            style={{
              ...position,
              transform: `rotate(${position.rotate})`,
              animation: `fadeIn 0.8s ease-out, float 6s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`
            }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-gray-200 max-w-xs group hover:scale-105 transition-all duration-300">
              {/* Header with avatar and info */}
              <div className="flex items-center mb-3">
                <div className="text-2xl mr-3">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">{testimonial.name}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
                <div className="text-xs text-gray-400">{testimonial.timeAgo}</div>
              </div>

              {/* Testimonial message */}
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                "{testimonial.message}"
              </p>

              {/* Donation amount and rating */}
              <div className="flex items-center justify-between">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 font-semibold text-sm">
                    💝 ${testimonial.donationAmount}
                  </span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Floating heart on hover */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart className="w-5 h-5 text-red-500 fill-current animate-pulse" />
              </div>
            </div>
          </div>
        );
      })}

      {/* Live donation notification */}
      <div className="absolute bottom-8 right-8 animate-slideIn">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-4 shadow-2xl border border-white/20">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <div>
              <div className="font-semibold text-sm">🎉 Live Update!</div>
              <div className="text-xs opacity-90">Ahmad's family just got power in Lahore!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}