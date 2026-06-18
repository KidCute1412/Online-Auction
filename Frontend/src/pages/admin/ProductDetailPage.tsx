/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatToVN } from "@/utils/format_time";
import Loading from "@/components/common/Loading";
import { ChevronDown, ChevronUp } from "lucide-react";

type ProductDetail = {
  product_id: number;
  product_name: string;
  is_removed: boolean;
  seller_id: string;
  seller_name?: string;
  step_price: number;
  start_price: number;
  current_price: number;
  start_time: string;
  end_time: string;
  product_images: string;
  description: string;
  created_at: string;
};

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch product details by product ID
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/detail/${id}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setProduct(data.product);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <Loading className="ml-[240px] bg-transparent"></Loading>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-foreground">
        <div className="text-center text-destructive">Product not found</div>
      </div>
    );
  }

  let productImages: string[] = [];
  if (product.product_images) {
    if (Array.isArray(product.product_images)) {
      productImages = product.product_images;
    } else if (typeof product.product_images === "string") {
      try {
        const parsed = JSON.parse(product.product_images);
        productImages = Array.isArray(parsed)
          ? parsed
          : [product.product_images];
      } catch {
        productImages = product.product_images
          .split(",")
          .filter((img) => img.trim());
      }
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 text-foreground bg-background">
      <h2 className="text-xl sm:text-2xl font-heading font-bold mb-4 text-foreground">Product Details</h2>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-colors duration-300">
        <div className="space-y-4">
          {/* Row 1: Product Name & Seller info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="product_name"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Product Name
              </label>
              <input
                id="product_name"
                type="text"
                value={product.product_name}
                disabled
                className="w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground outline-none cursor-default"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="seller"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Seller
              </label>
              <input
                id="seller"
                type="text"
                value={product.seller_name || product.seller_id || "Unknown"}
                disabled
                className="w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground outline-none cursor-default"
              />
            </div>
          </div>

          {/* Row 2: Starting Price & Step Price info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="start_price"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Starting Price
              </label>
              <input
                id="start_price"
                type="text"
                value={product.start_price.toLocaleString() + " VND"}
                disabled
                className="w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground outline-none cursor-default"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="step_price"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Step Price
              </label>
              <input
                id="step_price"
                type="text"
                value={product.step_price.toLocaleString() + " VND"}
                disabled
                className="w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground outline-none cursor-default"
              />
            </div>
          </div>

          {/* Row 3: Timestamps */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="start_time"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Start Time
              </label>
              <input
                id="start_time"
                type="text"
                value={formatToVN(product.start_time)}
                disabled
                className="w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground outline-none cursor-default"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="end_time"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                End Time
              </label>
              <input
                id="end_time"
                type="text"
                value={formatToVN(product.end_time)}
                disabled
                className="w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground outline-none cursor-default"
              />
            </div>
          </div>

          {/* Product Gallery Images display */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Product Images
            </label>
            <div className="border border-border rounded-xl bg-muted/20 p-4 transition-colors">
              {productImages.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {productImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.trim()}
                      alt={`${product.product_name} - ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-xs border border-border"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-6">
                  <span className="text-sm text-muted-foreground">
                    No images available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Product Description panel */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Product Description
            </label>
            <div className="border border-border rounded-xl bg-muted/20 p-4 transition-colors">
              <div
                className={`relative transition-all duration-300 ${
                  isDescriptionExpanded ? "" : "overflow-hidden"
                }`}
                style={{
                  maxHeight: isDescriptionExpanded ? "none" : "180px",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                {!isDescriptionExpanded && product.description && product.description.length > 300 && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
                )}
              </div>
              {product.description && product.description.length > 300 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  {isDescriptionExpanded ? (
                    <>
                      Show less <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col items-center justify-center pt-2">
            <span
              className="text-sm font-semibold cursor-pointer underline text-accent hover:opacity-90 transition-opacity"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back to list
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
