import { useEffect, useRef } from 'react';

interface MarqueeBannerProps {
  message?: string;
  linkTo?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function MarqueeBanner({ 
  message = "World's Largest Youth-Led Solar Nonprofit — Donate Today",
  linkTo = "https://ko-fi.com/solarpak",
  backgroundColor = "bg-gradient-to-r from-green-500 to-emerald-600",
  textColor = "text-white"
}: MarqueeBannerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let position = 0;
    const speed = 1;

    const animate = () => {
      position -= speed;
      const firstChild = scrollContainer.firstElementChild as HTMLElement;
      if (firstChild && Math.abs(position) >= firstChild.offsetWidth) {
        position = 0;
      }
      scrollContainer.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const items = Array(10).fill(message);

  return (
    <a 
      href={linkTo}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full ${backgroundColor} py-2 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
      data-testid="marquee-banner"
    >
      <div className="relative overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex whitespace-nowrap"
        >
          {items.map((text, index) => (
            <span 
              key={index}
              className={`${textColor} font-bold text-xs md:text-sm uppercase tracking-wider px-8 flex-shrink-0`}
            >
              {text} ✦
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
