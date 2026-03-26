import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Trophy, Briefcase, Users, ChevronDown, Mail } from "lucide-react";

const prizes = [
  {
    place: "1st Place",
    award: "$150",
    description: "Top solution that best addresses SolarPak's energy access mission",
    accent: "amber",
  },
  {
    place: "2nd Place",
    award: "$100",
    description: "Runner-up with strong innovation and real-world applicability",
    accent: "gray",
  },
  {
    place: "3rd Place",
    award: "$50",
    description: "Outstanding effort and creative problem-solving",
    accent: "amber",
  },
];

const faqs = [
  {
    question: "Do I need technical skills to participate?",
    answer:
      "No — this is a no-code hackathon. You don't need to write a single line of code. We're looking for creative thinkers, problem solvers, and anyone passionate about clean energy and social impact.",
  },
  {
    question: "Who can join?",
    answer:
      "Anyone! Students, professionals, and community members from anywhere in the world are welcome to participate. Whether you're 16 or 60, if you care about solar energy and want to help communities in Pakistan, this is for you.",
  },
  {
    question: "Can I participate as a team?",
    answer:
      "Yes. You can participate solo or form a team of up to 4 people. We encourage collaboration — diverse teams often produce the most creative solutions.",
  },
  {
    question: "What does 'no-code' mean in practice?",
    answer:
      "Your deliverable will be a presentation, proposal, or prototype built with tools like Google Slides, Canva, Notion, or similar platforms — no programming required. We're evaluating your ideas, not your coding ability.",
  },
  {
    question: "What's the internship opportunity?",
    answer:
      "Top participants will be considered for an internship with SolarPak. You'll work alongside our team on real projects — from field operations to impact research — and gain hands-on experience in a mission-driven nonprofit.",
  },
  {
    question: "How are submissions judged?",
    answer:
      "Submissions are evaluated on creativity, feasibility, impact potential, and how well the solution aligns with SolarPak's mission. A panel of SolarPak team members and advisors will review all entries.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-48 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Hackathon() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeroVisible(true);
      },
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20">
        {/* Hero */}
        <div
          ref={heroRef}
          className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 py-24 md:py-32 overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-amber-500/8 to-orange-500/8 rounded-full blur-3xl" />
          </div>

          <div
            className="container mx-auto px-6 relative z-10 transition-all duration-1000"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 px-4 py-2 rounded-full mb-6">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400/90 font-medium text-xs uppercase tracking-[0.15em]">
                  Flagship Event
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
                SolarPak Energy<br />
                <span className="text-amber-400">Hackathon</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed mb-8">
                A no-code innovation challenge open to everyone. Bring your ideas, solve real energy problems, and compete for over $300 in prizes — plus internship opportunities.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeS8Ggp6mGCLbMc_fWZ7XbMYehpx9Suq-T_2kEpo5ZXwBt5ag/viewform?usp=sharing&ouid=103166990689961663759"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500/40 text-amber-200/60 font-semibold px-8 py-3.5 rounded-md text-sm cursor-not-allowed select-none"
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              >
                Registrations Opening Soon
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          {/* At a glance */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">At a glance</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5 text-amber-500" />,
                  label: "Format",
                  value: "No-code",
                  sub: "Open to everyone",
                },
                {
                  icon: <Trophy className="w-5 h-5 text-amber-500" />,
                  label: "Prize Pool",
                  value: "$300+",
                  sub: "Cash prizes",
                },
                {
                  icon: <Briefcase className="w-5 h-5 text-amber-500" />,
                  label: "Bonus",
                  value: "Internships",
                  sub: "For top performers",
                },
                {
                  icon: <Users className="w-5 h-5 text-amber-500" />,
                  label: "Team size",
                  value: "1–4",
                  sub: "Solo or group",
                },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-6">
                  <div className="mb-3">{item.icon}</div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">{item.label}</p>
                  <p className="text-xl font-bold text-gray-900 mb-0.5">{item.value}</p>
                  <p className="text-sm text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* About */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-5">What is it?</h2>
                <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                  The SolarPak Energy Hackathon is our flagship community event — a challenge where participants design creative, practical solutions to real energy access problems in Pakistan.
                </p>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Because it's no-code, you don't need a technical background. Whether you're a designer, writer, strategist, student, or just someone with a great idea, you're welcome here.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-5">Why participate?</h2>
                <ul className="space-y-3">
                  {[
                    "Tackle a real-world energy crisis affecting millions",
                    "Win cash prizes and recognition",
                    "Earn an internship with SolarPak",
                    "Build your portfolio with meaningful impact work",
                    "Connect with a global community of changemakers",
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-[15px] text-gray-500 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* Prizes */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">Prizes</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {prizes.map((prize) => (
                <div
                  key={prize.place}
                  className="border border-gray-100 rounded-xl p-6 hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{prize.place}</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{prize.award}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{prize.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Internship opportunities</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Beyond cash prizes, top participants will be considered for a real internship with SolarPak. Work on live projects alongside our team and make a tangible difference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* How it works */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">How it works</h2>
            <div className="space-y-0">
              {[
                {
                  step: "01",
                  title: "Register your interest",
                  description: "Fill out the registration form to get on the list. We'll send you all the details once the hackathon opens.",
                },
                {
                  step: "02",
                  title: "Receive the brief",
                  description: "Registered participants will receive the challenge brief with the problem statement, judging criteria, and submission guidelines.",
                },
                {
                  step: "03",
                  title: "Build your solution",
                  description: "Work solo or with your team using any no-code tools you like — Canva, Notion, Google Slides, Figma, or anything else.",
                },
                {
                  step: "04",
                  title: "Submit & win",
                  description: "Submit your entry before the deadline. Our panel will review all submissions and announce winners publicly.",
                },
              ].map((item, i) => (
                <div key={item.step} className="flex gap-8 py-8 border-b border-gray-50 last:border-b-0">
                  <div className="flex-shrink-0 w-10">
                    <span className="text-xs font-bold text-gray-200 uppercase tracking-widest">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* FAQ */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-10">FAQ</h2>
            <div className="border-t border-gray-100">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto"><div className="h-px bg-gray-100" /></div>

          {/* CTA */}
          <div className="max-w-5xl mx-auto py-16 md:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Ready to join?</h2>
                <p className="text-gray-500 text-[15px] leading-relaxed max-w-md">
                  Register your interest now and we'll reach out with everything you need to participate.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 font-semibold px-7 py-3 rounded-md text-sm cursor-not-allowed select-none">
                  Registrations Opening Soon
                </span>
                <a
                  href="mailto:solarpakorg@gmail.com?subject=SolarPak Hackathon Question"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors px-7 py-3 border border-gray-200 rounded-md hover:border-amber-200"
                >
                  <Mail className="w-4 h-4" />
                  Ask a question
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
