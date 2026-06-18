import React from "react";
import { Code, Server, Award, Github, Mail, Zap, Radio, CreditCard, ShoppingBag, CheckCircle2 } from "lucide-react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

const HeaderSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`relative bg-gradient-to-br from-background via-muted/10 to-background py-16 md:py-20 overflow-hidden transition-all duration-1000 ${
        isIntersecting ? "animate__animated animate__fadeInDown" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 rounded-full border border-accent/30 mb-6">
          <Award className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            About Us
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4 leading-tight">
          Passionate Tech Team
        </h1>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          An online auction platform developed by a talented team, delivering a unique, transparent, and trustworthy trading experience.
        </p>
      </div>
    </div>
  );
};

const ProjectOverview = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const features = [
    {
      icon: Zap,
      title: "Auto Bidding",
      description: "The system automatically places bids on your behalf when outbid",
      color: "from-amber-400 to-orange-400",
    },
    {
      icon: Radio,
      title: "Real-Time Bids",
      description: "Instant bid updates driven by Socket.io technology",
      color: "from-blue-400 to-indigo-400",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "A safe, transparent, and highly protected checkout workflow",
      color: "from-emerald-400 to-teal-400",
    },
    {
      icon: Github,
      title: "Open Source Project",
      description: "Source code open on GitHub for community contributions",
      color: "from-slate-500 to-slate-600",
    },
    {
      icon: ShoppingBag,
      title: "Diverse Selection",
      description: "Integrated APIs from Tiki and other reputable catalog sources",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: CheckCircle2,
      title: "Verification Workflow",
      description: "Email verification and professional user profile management",
      color: "from-rose-400 to-red-400",
    },
  ];

  return (
    <div
      ref={ref}
      className={`max-w-5xl mx-auto px-4 py-8 transition-opacity duration-1000 ${
        isIntersecting ? "animate__animated animate__fadeInUp" : "opacity-0"
      }`}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-3">
          Online Auction (MIRACLE)
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A modern online auction platform with cutting-edge technology, delivering a secure, convenient, and thrilling trading experience for all.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-border transform -translate-x-1/2"></div>

        <div className="relative space-y-12">
          {features.map((feature, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"} gap-4`}
              >
                {/* Feature Card */}
                <div
                  className={`w-5/12 group relative bg-card rounded-2xl p-5 border border-border/80 hover:border-accent/40 hover:shadow-gold-glow/5 transition-all duration-300 hover:-translate-y-1 ${
                    isIntersecting ? "animate__animated animate__fadeIn" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl blur-md opacity-20`}></div>
                      <div className={`relative w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-md`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connector Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${feature.color} shadow-md border-2 border-background ${
                      isIntersecting ? "animate__animated animate__zoomIn" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  ></div>
                </div>

                {/* Branch Line */}
                <div className={`w-5/12 h-[1px] ${isLeft ? "mr-auto" : "ml-auto"}`}>
                  <div
                    className={`h-full bg-gradient-to-${isLeft ? "r" : "l"} from-border to-transparent ${
                      isIntersecting ? "animate__animated animate__fadeIn" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TechnologiesSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`max-w-5xl mx-auto px-4 pb-8 transition-opacity duration-1000 ${
        isIntersecting ? "animate__animated animate__fadeInLeft" : "opacity-0"
      }`}
    >
      <div className="grid md:grid-cols-2 gap-5">
        {/* Frontend Technologies info panel */}
        <div className="group relative bg-card rounded-2xl border border-border p-6 text-center hover:border-accent/30 hover:shadow-gold-glow/5 transition-all duration-300 hover:-translate-y-1">
          <div className="relative">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-10"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-base font-bold text-foreground mb-1">Frontend</h3>
            <p className="text-xs text-muted-foreground mb-4">A modern, responsive user interface</p>
            <div className="inline-flex items-center px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-blue-500 font-semibold text-xs">React + TypeScript</span>
            </div>
          </div>
        </div>

        {/* Backend Technologies info panel */}
        <div className="group relative bg-card rounded-2xl border border-border p-6 text-center hover:border-accent/30 hover:shadow-gold-glow/5 transition-all duration-300 hover:-translate-y-1">
          <div className="relative">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-md opacity-10"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Server className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-base font-bold text-foreground mb-1">Backend</h3>
            <p className="text-xs text-muted-foreground mb-4">Powerful APIs with top-tier security standards</p>
            <div className="inline-flex items-center px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="text-emerald-500 font-semibold text-xs">Node.js + Express</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`max-w-5xl mx-auto px-4 pb-8 transition-opacity duration-1000 ${
        isIntersecting ? "animate__animated animate__fadeInUp" : "opacity-0"
      }`}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-3">
          Development Team
        </h2>
        <p className="text-sm text-muted-foreground">The brains behind this platform</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Developer Member 1 */}
        <div className="group relative bg-card rounded-2xl border border-border p-6 text-center hover:border-accent/30 hover:shadow-gold-glow/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="relative">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-10"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-border/20">
                <span className="text-3xl font-extrabold text-white">LT</span>
              </div>
              <div className="absolute bottom-1 right-[38%] w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full border-2 border-background shadow-md flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Lê Tuấn Lộc</h3>
            <div className="inline-flex items-center px-3.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
              <span className="text-blue-500 font-semibold text-xs">Full-Stack Developer</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm mx-auto">
              Web developer with a passion for designing wonderful user experiences.
            </p>
            <div className="flex justify-center space-x-2.5">
              <button className="p-2 bg-muted/30 hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                <Github className="w-4 h-4" />
              </button>
              <button className="p-2 bg-muted/30 hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Developer Member 2 */}
        <div className="group relative bg-card rounded-2xl border border-border p-6 text-center hover:border-accent/30 hover:shadow-gold-glow/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="relative">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-slate-500 rounded-full blur-xl opacity-10"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-border/20">
                <span className="text-3xl font-extrabold text-white">NT</span>
              </div>
              <div className="absolute bottom-1 right-[38%] w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-background shadow-md flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Nguyễn Thanh Tiến</h3>
            <div className="inline-flex items-center px-3.5 py-1 bg-muted border border-border rounded-full mb-4">
              <span className="text-muted-foreground font-semibold text-xs">Full-Stack Developer</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm mx-auto">
              Building robust backend solutions and optimizing application performances.
            </p>
            <div className="flex justify-center space-x-2.5">
              <button className="p-2 bg-muted/30 hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                <Github className="w-4 h-4" />
              </button>
              <button className="p-2 bg-muted/30 hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MissionSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`max-w-5xl mx-auto px-4 pb-12 transition-opacity duration-1000 ${
        isIntersecting ? "animate__animated animate__fadeInUp" : "opacity-0"
      }`}
    >
      <div className="mt-8 relative bg-card rounded-2xl p-8 md:p-10 text-center border border-border shadow-sm overflow-hidden transition-colors duration-300">
        <div className="relative z-10">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-slate-500 rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground mb-4">
            Our Mission
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Creating a trustworthy online auction arena where everyone can trade in a fair, transparent, and safe manner. We continuously innovate to deliver the best experience for our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <HeaderSection />
      <ProjectOverview />
      <TechnologiesSection />
      <TeamSection />
      <MissionSection />
    </div>
  );
}
