import { Zap, Grid3x3, Sparkles, Lock, Trophy, BookOpen, Heart } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { Link } from "react-router-dom";
import heroImage from "@/assets/images/hero-section-background.png";

const WelcomeText = () => {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`relative bg-glass border border-border/50 py-16 px-6 rounded-3xl mx-4 my-8 overflow-hidden transition-all duration-700 ${
        hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Premium background radial glow details */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 rounded-full border border-accent/30 mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
              Premier Auction Platform
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-4 leading-tight">
            Discover the World of Online Auctions
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome to the premier online auction platform, where precious items await new owners.
            From antique rarities to modern gadgets, we deliver an exciting, fair, and secure bidding experience.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Fast & Easy */}
          <div className="group relative bg-muted/20 backdrop-blur-xs p-6 rounded-2xl border border-border/60 hover:border-accent/50 hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg mb-4 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                Fast & Easy
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Sign up and start placing bids within minutes. A user-friendly interface with straightforward guides.
              </p>
            </div>
          </div>

          {/* Card 2: Safe & Secure */}
          <div className="group relative bg-muted/20 backdrop-blur-xs p-6 rounded-2xl border border-border/60 hover:border-accent/50 hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg mb-4 group-hover:scale-105 transition-transform duration-200">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                Safe & Secure
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                High encryption standards with protected checkout. Protecting interests for both sellers and buyers.
              </p>
            </div>
          </div>

          {/* Card 3: Diverse Selection */}
          <div className="group relative bg-muted/20 backdrop-blur-xs p-6 rounded-2xl border border-border/60 hover:border-accent/50 hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg mb-4 group-hover:scale-105 transition-transform duration-200">
                <Grid3x3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                Diverse Selection
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                From fine art and antiques to electronics and fashion. Always finding items tailored to your tastes.
              </p>
            </div>
          </div>
        </div>

        {/* Quote Block */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-muted/20 rounded-2xl border border-border/40">
            <div className="w-1 h-8 bg-accent rounded-full"></div>
            <p className="text-xs sm:text-sm text-muted-foreground italic font-medium">
              "Auctions are not just simple transactions, but an exciting treasure-hunting adventure!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`relative pl-6 sm:pl-8 pb-16 pt-24 bg-gradient-to-br from-background via-muted/10 to-background border border-border/50 shadow-gold-glow rounded-3xl ${
        hasIntersected ? "animate__animated animate__fadeInUp animate__slow" : "opacity-0"
      }`}
    >
      {/* Elegant radial glows for professional look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container relative z-10 mx-auto">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-5/12">
            <div className="hero-content">
              {/* Gold trophy container banner */}
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent rounded-2xl blur-md opacity-40"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-2.5 rounded-2xl shadow-lg">
                    <Trophy className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-accent">
                  Elite Bidding Arena
                </div>
              </div>

              <h1
                className={`mb-4 text-3xl font-heading font-extrabold !leading-[1.15] sm:text-4xl lg:text-[40px] xl:text-5xl transition-all duration-1000 delay-300 ${
                  hasIntersected ? "animate__animated animate__fadeInLeft" : ""
                }`}
              >
                <span className="block bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent font-black tracking-tight">
                  Online Auction
                </span>
                <span className="block text-lg sm:text-xl mt-1 text-accent font-bold">
                  Where Authentic Values Begin
                </span>
              </h1>

              <div
                className={`mb-6 max-w-[480px] transition-all duration-1000 delay-500 ${
                  hasIntersected ? "animate__animated animate__fadeInLeft" : ""
                }`}
              >
                <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed mb-2">
                  Looking for something special? Our experts have curated the best products for you.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
                  Join us today and discover the thrilling world of auctions with thousands of quality items!
                </p>
              </div>

              <div
                className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-1000 delay-700 ${
                  hasIntersected ? "animate__animated animate__fadeInUp" : ""
                }`}
              >
                <Link
                  to="/about"
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-gold-glow border border-accent/20"
                >
                  <div className="absolute inset-0 bg-primary transition-all duration-500 group-hover:bg-primary/95"></div>
                  <BookOpen className="relative mr-1.5 group-hover:rotate-12 transition-transform" size={15} />
                  <span className="relative">About Us</span>
                </Link>

                <Link
                  to="/my-products"
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-500/20 border border-rose-500/20"
                >
                  <div className="absolute inset-0 bg-rose-600 transition-all duration-500 group-hover:bg-rose-500"></div>
                  <Heart className="relative mr-1.5 group-hover:scale-125 transition-transform" size={15} />
                  <span className="relative">Your Favorites</span>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden px-4 lg:block lg:w-1/12"></div>
          
          {/* Hero Image Section */}
          <div className="w-full px-4 lg:w-6/12">
            <div className="lg:ml-auto lg:text-right">
              <div className="relative z-10 inline-block pt-10 lg:pt-0">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-gradient-to-r from-accent to-primary rounded-3xl blur-2xl opacity-10"></div>
                  <img
                    src={heroImage}
                    alt="hero"
                    className={`relative max-w-full lg:ml-auto lg:h-[420px] object-cover rounded-3xl shadow-gold-glow border border-accent/30 transition-all duration-1000 delay-900 hover:scale-[1.01] ${
                      hasIntersected ? "animate__animated animate__fadeInRight" : "opacity-0 translate-x-5"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Section1() {
  return (
    <div>
      <Hero />
      <WelcomeText />
    </div>
  );
}

export default Section1;