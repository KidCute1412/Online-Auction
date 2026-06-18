import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function HorizontalBar({ className, children }: { className?: string; children?: any }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const move = 500; // Pixels to move
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - move : scrollLeft + move;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className={cn("w-[90%] rounded-2xl h-[200px] relative mx-auto my-[50px] bg-muted/40 border border-border", className)}>
      <div
        ref={scrollRef}
        className="rounded-2xl h-full relative flex flex-row gap-1.5 overflow-x-auto items-center justify-start scrollbar-hide overflow-y-hidden"
      >
        {children}
      </div>

      {/* Navigation left button */}
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 -translate-y-1/2 left-5 bg-card border border-border text-foreground rounded-full p-2.5 shadow-md hover:shadow-lg hover:scale-105 hover:bg-muted transition-all duration-200 cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Navigation right button */}
      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 -translate-y-1/2 right-5 bg-card border border-border text-foreground rounded-full p-2.5 shadow-md hover:shadow-lg hover:scale-105 hover:bg-muted transition-all duration-200 cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>

      {/* Fade indicators */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-background to-transparent rounded-l-2xl" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent rounded-r-2xl" />
    </div>
  );
}

function CatagoriesMiniItem({ image, name, link }: { image?: string; name?: string; link?: string }) {
  if (!name) name = "Category";
  return (
    <Link to={link || "#"} className="group">
      <div className="h-[150px] w-fit px-8 flex flex-col shrink-0 items-center ml-2 rounded-2xl border border-border hover:border-accent/40 hover:shadow-gold-glow hover:scale-102 transition-all duration-300 bg-card">
        {/* Category Image */}
        <div className="flex h-[75%] w-full justify-center items-center">
          <img
            className="object-cover h-[75%] aspect-square rounded-xl border border-border group-hover:border-accent/30 transition-colors duration-300"
            src={image}
            alt={name}
          />
        </div>
        {/* Category Label */}
        <div className="flex w-full flex-1 text-sm font-heading font-medium text-muted-foreground group-hover:text-accent transition-colors duration-300 justify-center items-center text-center">
          {name}
        </div>
      </div>
    </Link>
  );
}

export { CatagoriesMiniItem };
export default HorizontalBar;