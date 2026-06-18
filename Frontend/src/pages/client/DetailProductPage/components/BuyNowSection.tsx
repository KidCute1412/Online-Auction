import { useState } from "react";
import { ShoppingCart, Zap, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/ProtectedRouter";

interface BuyNowSectionProps {
  product_id?: number;
  buy_now_price?: number;
  product_name?: string;
  setProduct?: Function;
}

export default function BuyNowSection({ product_id, buy_now_price, product_name }: BuyNowSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleBuyNowClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmBuyNow = async () => {
    if (!buy_now_price || !product_id) {
      toast.error("Invalid product information!");
      return;
    }

    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bid/buy_now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: product_id,
          buy_price: buy_now_price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred while purchasing the product!");
      }

      if (data.status === "success") {
        toast.success("Purchase successful!");
      } else {
        toast.error(data.message || "Purchase failed!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error connecting to server!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!buy_now_price) {
    return null;
  }

  return (
    <div className="p-6 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-rose-500 rounded-lg">
          <ShoppingCart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground">Buy Now</h4>
          <p className="text-xs text-muted-foreground">
            Own the product immediately at a fixed price
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        {/* Price Info */}
        <div className="bg-rose-500/10 p-4 rounded-lg border border-rose-500/20 h-fit">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-rose-500">Buy Now Price</span>
          </div>
          <p className="text-xl font-bold text-rose-500 mb-2">
            {buy_now_price.toLocaleString()} VND
          </p>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>• No bidding required</p>
            <p>• Instant ownership</p>
            <p>• Ends auction immediately</p>
          </div>
        </div>

        {/* Buy Now Form */}
        <div className="flex flex-col justify-center gap-3">
          <button
            onClick={handleBuyNowClick}
            disabled={isSubmitting}
            className={`bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </>
            )}
          </button>

          {/* Helper Text */}
          <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
            <p className="text-xs text-rose-500 leading-tight">
              <span className="font-semibold">Note:</span> The auction will end immediately
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Confirm Buy Now</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 mb-6">
              <p className="text-muted-foreground">
                Are you sure you want to purchase this product for:
              </p>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Buy Now Price</p>
                <p className="text-2xl font-bold text-rose-500">
                  {buy_now_price?.toLocaleString()} VND
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-yellow-600">
                  <span className="font-semibold">Note:</span> The auction session will end immediately and you will own this product.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 cursor-pointer border border-border text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBuyNow}
                className="flex-1 px-4 py-2.5 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                Confirm Buy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
