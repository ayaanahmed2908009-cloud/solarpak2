export default function HeroBanner() {
  return (
    <section className="relative bg-secondary overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary opacity-70"></div>
      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10 text-white">
        <div className="max-w-3xl">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Bringing Light to Pakistan Through Solar Power
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Help us combat electricity shortages and improve lives by funding solar panel installations for families across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#donate" 
              className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-8 py-3 rounded-md text-center transition text-lg shadow-lg"
            >
              Make a Donation
            </a>
            <a 
              href="#problem" 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-heading font-semibold px-8 py-3 rounded-md text-center transition text-lg border border-white border-opacity-40"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 hidden lg:block lg:w-1/3 h-full">
        <img 
          src="https://images.unsplash.com/photo-1627859284229-27d646b18a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Solar panels on a rooftop in Pakistan" 
          className="object-cover h-full w-full"
        />
      </div>
    </section>
  );
}
