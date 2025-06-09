import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import Impact from "@/pages/Impact";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Membership from "@/pages/Membership";
import VillageExperience from "@/pages/VillageExperience";
import CaseStudy from "@/pages/CaseStudy";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";

// Smooth scroll behavior utility
function setSmoothScroll() {
  // Use a better smooth scrolling when clicking anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href') || '';
      if (!targetId || targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Calculate scroll position with offset to account for fixed headers
      const offset = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL hash without scrolling (which would create a jump)
      history.pushState({}, '', targetId);
    });
  });
  
  // Implement scroll-triggered animations for sections
  const observerOptions = {
    root: null, // Use viewport as root
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of element is visible
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        
        // Initialize counters or animations specific to this section
        if (entry.target.getAttribute('data-animate') === 'true') {
          entry.target.setAttribute('data-animate', 'false');
          const event = new CustomEvent('section-visible', { 
            detail: { id: entry.target.id } 
          });
          document.dispatchEvent(event);
        }
      }
    });
  }, observerOptions);
  
  // Observe all sections
  document.querySelectorAll('section[id]').forEach(section => {
    section.classList.add('section-hidden');
    section.setAttribute('data-animate', 'true');
    sectionObserver.observe(section);
  });
}

function Router() {
  useEffect(() => {
    // Set up smooth scrolling and section animations when routes change
    setSmoothScroll();
    
    return () => {
      // Clean up event listeners on route change
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', () => {});
      });
    };
  }, []);
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/impact" component={Impact} />
      <Route path="/village" component={VillageExperience} />
      <Route path="/case-study" component={CaseStudy} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/success" component={Success} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/membership" component={Membership} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app-container min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <Router />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
