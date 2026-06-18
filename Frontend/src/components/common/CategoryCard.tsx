import Cristiano from "@/assets/images/cristiano.jpg";
import { cn } from "@/lib/utils";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

interface CategoryCardProps {
  name?: string;
  image?: string;
  onClick?: () => void;
  className?: string;
}

function CategoryCard({ name = "Cristiano", image, onClick, className }: CategoryCardProps) {
  const displayImage = image || Cristiano;
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={cn(
        "group relative w-[380px] h-[450px] cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-out",
        "bg-card/40 backdrop-blur-xl border border-border",
        "hover:border-accent/40 hover:scale-[1.02] hover:shadow-gold-glow",
        hasIntersected ? "animate__animated animate__fadeInUp" : "opacity-0",
        className
      )}
      onClick={onClick}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl"></div>
      </div>

      {/* Image container */}
      <div className="relative h-[72%] overflow-hidden rounded-t-3xl border-b border-border">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
          loading="lazy"
        />

        {/* Hover arrow overlay */}
        <div className="absolute inset-0 bg-background/25 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur-md border border-accent/40 flex items-center justify-center hover:bg-background/60 transition-colors">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="relative h-[28%] flex flex-col justify-center items-center p-6 text-center bg-card/10">
        {/* Accent line */}
        <div className="w-8 h-0.5 bg-accent rounded-full mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category name */}
        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
          {name}
        </h3>

        {/* Subtitle */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          Explore Now
        </p>
      </div>

      {/* Shine overlay animation */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-accent/15 to-transparent -skew-x-12 animate-shine"></div>
      </div>
    </div>
  );
}

export default CategoryCard;
