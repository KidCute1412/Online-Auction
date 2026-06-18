import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function AddToLove({ product_id, className }: { product_id: number; className?: string }) {
  const [loveCount, setLoveCount] = useState(0);
  const [isLoved, setIsLoved] = useState(false);
  const isLovedRef = useRef(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleClick = () => {
    if (isSubmit) return; // Prevent double submission
    setIsSubmit(true);
    const newLoveStatus = !isLoved;

    isLovedRef.current = newLoveStatus;
    fetch(`${import.meta.env.VITE_API_URL}/api/products/update_love_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        product_id: product_id,
        love_status: newLoveStatus,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login is required to add favorites");
        }
        return res.json();
      })
      .then(() => {
        setIsLoved(newLoveStatus);
        setLoveCount((prev) => (newLoveStatus ? prev + 1 : prev - 1));
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsSubmit(false);
      });
  };

  useEffect(() => {
    const fetchLoveStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/love_status?product_id=${product_id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch love status");
        }

        const data = await response.json();
        setIsLoved(data.data.is_loved);
        setLoveCount(data.data.total_loves);
        isLovedRef.current = data.data.is_loved;
      } catch (error) {
        console.error("Error fetching love status: ", error);
      }
    };

    fetchLoveStatus();
  }, [product_id]);

  return (
    <button
      type="button"
      className={cn(
        "absolute top-4 right-4 h-10 px-3 rounded-xl flex items-center gap-1.5 transition-all duration-300 border backdrop-blur-md cursor-pointer",
        isLoved
          ? "bg-rose-500/10 border-rose-500/30 text-rose-500 scale-105 shadow-sm"
          : "bg-background/60 border-border text-foreground hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500",
        className
      )}
      onClick={handleClick}
    >
      <Heart
        size={18}
        className={cn(
          "transition-transform duration-300",
          isLoved ? "fill-rose-500 scale-110" : "group-hover:scale-110"
        )}
      />
      <span className="text-sm font-semibold tracking-wider font-heading">{loveCount}</span>
    </button>
  );
}