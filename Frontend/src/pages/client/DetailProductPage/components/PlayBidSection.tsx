import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import { TrendingUp, AlertCircle, Zap, ChevronDown, X, AlertTriangle } from "lucide-react";
import JustValidate from "just-validate";
import { useNavigate } from "react-router-dom";

export default function PlayBidSection({ product_id, current_price, step_price, buy_now_price }: { product_id?: number; current_price?: number; step_price?: number; buy_now_price?: number }) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bidValue, setBidValue] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingBidData, setPendingBidData] = useState<{ product_id?: number; max_price: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);
  
  useEffect(() => {
    const validate = new JustValidate("#bidForm");
    validate.addField(
      "#max_price", [
        { rule: "required", errorMessage: "Please enter your bid price!" },
        {
          validator: (value: string) => {
            const numericValue = value.split(".").join("").split(",").join(".");
            return parseFloat(numericValue) >= (current_price ?? 0) + (step_price ?? 0);
          },
          errorMessage: `Bid price must be at least ${((current_price ?? 0) + (step_price ?? 0)).toLocaleString()} VND!`
        },
        {
          validator: (value: string) => {
            const numericValue = value.split(".").join("").split(",").join(".");
            if (!step_price) return true;
            return (parseFloat(numericValue) - (current_price ?? 0)) % step_price === 0;
          },
          errorMessage: `Bid price must be a multiple of the step price (${step_price?.toLocaleString()} VND)!`
        },
      ]  
    )
    .onSuccess((event: any) => {
      event.preventDefault();
      const form = event.target;
      const maxPriceSubmit = form.max_price.value.split(".").join("").split(",").join(".");
      
      setPendingBidData({
        product_id: product_id,
        max_price: parseFloat(maxPriceSubmit)
      });
      setShowConfirmModal(true);
    });

    return () => {
      validate.destroy();
    };
  }, [product_id, current_price, step_price]);

  const handleConfirmBid = async () => {
    if (!pendingBidData) return;
    
    setShowConfirmModal(false);
    setIsSubmit(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bid/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
        body: JSON.stringify(pendingBidData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error connecting to server to place bid!");
      }

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Bid placed successfully!");
        setBidValue("");
      } else {
        toast.error(`Failed to place bid`);
      }
    } catch (e: any) {
      console.log(e);
      if (e.message !== "Not logged in") {
        toast.error(e.message || "Error connecting to server to place bid!");
      }
    } finally {
      setIsSubmit(false);
      setPendingBidData(null);
    }
  };

  const getSuggestedPrices = () => {
    const minBid = (current_price ?? 0);
    const multipliers = [1, 2, 3, 4, 5, 10, 12, 15, 17, 20, 25, 30, 35, 38, 40];
    return multipliers.map(mult => ({
      price: minBid + (step_price ?? 0) * mult,
      multiplier: mult
    }));
  };

  const handleSuggestionClick = (price: number) => {
    setBidValue(price.toLocaleString("en-US"));
    setShowSuggestions(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-accent/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-foreground">
            Place a Bid
          </h4>
          <p className="text-sm text-muted-foreground">Participate in the product auction</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Min Bid Info */}
        <div className="bg-yellow-500/10 p-5 rounded-lg border border-yellow-500/20 h-fit">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-500">Minimum Bid</span>
          </div>
          <p className="text-2xl font-bold text-yellow-500 mb-2">
            {((current_price ?? 0) + (step_price ?? 0)).toLocaleString()} VND
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• Current price: {current_price?.toLocaleString()} VND</p>
            <p>• Step price: {step_price?.toLocaleString()} VND</p>
          </div>
        </div>

        {/* Bid Form */}
        <form className="space-y-4" id="bidForm">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Enter your bid amount
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1" ref={dropdownRef}>
                <NumericFormat
                  name="max_price"
                  id="max_price"
                  value={bidValue}
                  onValueChange={(values) => setBidValue(values.formattedValue)}
                  thousandSeparator=","
                  decimalSeparator="."
                  placeholder="e.g. 1,500,000"
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 text-lg pr-24 text-foreground"
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  VND
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showSuggestions ? "rotate-180" : ""}`} />
                </button>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto scrollbar-hide">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                        Suggested Bid Prices
                      </div>
                      {getSuggestedPrices().map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(item.price)}
                          className="w-full text-left px-3 py-2.5 hover:bg-muted/50 rounded-md transition-colors flex items-center justify-between group"
                        >
                          <span className="font-semibold text-foreground group-hover:text-accent">
                            {item.price.toLocaleString("en-US")} VND
                          </span>
                          <div className="flex items-center gap-2">
                            {item.multiplier === 1 && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-medium">
                                Minimum
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground font-medium">
                              x{item.multiplier} step price
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`bg-accent hover:bg-accent/90 cursor-pointer text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap
                  ${isSubmit ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Zap className="w-5 h-5" />
                Place Bid Now
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Note:</span> The bid price must be greater than or equal to the minimum bid
              </p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-xs text-red-500">
                <span className="font-semibold">Attention:</span> The bid price must be a multiple of the step price
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingBidData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Confirm Bid</h3>
              </div>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingBidData(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 mb-6">
              <p className="text-muted-foreground">
                Are you sure you want to place a bid on this product?
              </p>
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Your Bid Amount</p>
                <p className="text-2xl font-bold text-accent">
                  {pendingBidData.max_price.toLocaleString()} VND
                </p>
              </div>              
              {/* Warning if bid exceeds buy_now_price */}
              {buy_now_price && pendingBidData.max_price > buy_now_price && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-500 mb-2">
                        Bid amount exceeds buy now price!
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Your bid amount (<strong>{pendingBidData.max_price.toLocaleString()} VND</strong>) is higher than the buy now price (<strong>{buy_now_price.toLocaleString()} VND</strong>).
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You will win this auction and purchase the product at the buy now price.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-yellow-600">
                  <span className="font-semibold">Note:</span> After placing your bid, you will be committed to participating in this auction.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingBidData(null);
                }}
                className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBid}
                disabled={isSubmit}
                className={`flex-1 px-4 py-2.5 cursor-pointer bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg ${
                  isSubmit ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmit ? "Processing..." : "Confirm Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}