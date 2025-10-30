import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import DonationSuccess from "@/pages/DonationSuccess";

import Impact from "@/pages/Impact";

import Membership from "@/pages/Membership";
import VillageExperience from "@/pages/VillageExperience";
import CaseStudy from "@/pages/CaseStudy";
import Team from "@/pages/Team";
import Gallery from "@/pages/Gallery";

// Worker portal pages
import WorkerLogin from "@/pages/worker/WorkerLogin";
import WorkerRegister from "@/pages/worker/WorkerRegister";
import WorkerDashboard from "@/pages/worker/Dashboard";
import AdminPanel from "@/pages/worker/AdminPanel";
import TaskManager from "@/pages/worker/TaskManager";
import EventManager from "@/pages/worker/EventManager";
import WorkReview from "@/pages/worker/WorkReview";
import CreateEvent from "@/pages/worker/CreateEvent";
import PerformanceManager from "@/pages/worker/PerformanceManager";
import PerformanceReport from "@/pages/worker/PerformanceReport";
import TestPerformance from "@/pages/worker/TestPerformance";
import { useEffect } from "react";


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
  const isMobile = window.innerWidth < 768;
  const observerOptions = {
    root: null, // Use viewport as root
    rootMargin: '0px',
    threshold: isMobile ? 0.05 : 0.15 // Lower threshold on mobile for better visibility
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
      <Route path="/donation-success" component={DonationSuccess} />


      <Route path="/membership" component={Membership} />
      <Route path="/team" component={Team} />
      <Route path="/gallery" component={Gallery} />
      
      {/* Worker portal routes */}
      <Route path="/worker" component={WorkerDashboard} />
      <Route path="/worker/login" component={WorkerLogin} />
      <Route path="/worker/register" component={WorkerRegister} />
      <Route path="/worker/dashboard" component={WorkerDashboard} />
      <Route path="/worker/admin" component={AdminPanel} />
      <Route path="/worker/tasks" component={TaskManager} />
      <Route path="/worker/events" component={EventManager} />
      <Route path="/worker/create-event" component={CreateEvent} />
      <Route path="/worker/work-review" component={WorkReview} />
      <Route path="/worker/performance" component={PerformanceManager} />
      <Route path="/worker/performance-report" component={PerformanceReport} />
      <Route path="/worker/test" component={TestPerformance} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
