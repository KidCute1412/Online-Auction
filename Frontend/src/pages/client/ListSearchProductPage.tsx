import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Search } from "lucide-react";
import Loading from "@/components/common/Loading";
import ProductCard from "@/components/common/ProductCard";
import PaginationComponent from "@/components/common/Pagination";
import { productService } from "@/services/product.service.ts";

type Products = {
  product_id: number;
  product_images: string[];
  product_name: string;
  current_price: number;
  buy_now_price: number;
  start_time: any;
  end_time: any;
  price_owner_username: string;
  price_owner_id: number;
  bid_turns: string;
};

export default function ListSearchProductPage() {
  const [searchParams, setSeachParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [products, setProducts] = useState<Products[]>();
  const [isLoading, setLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [quantity, setQuantity] = useState(0);

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
    setSeachParams({ query: searchQuery, page: page.toString() });
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "");
    setCurrentPage(Number(searchParams.get("page")) || 1);
    setLoading(true);
    
    productService.search({ query: searchParams.get("query"), page: currentPage })
      .then((data) => {
        setProducts(data.data.products);
        setNumberOfPages(data.data.total_pages);
        setQuantity(data.data.quantity);
      })
      .catch((error) => {
        toast.error(error.message || "Server connection error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams, currentPage]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-8">
      {/* Title results banner */}
      <div className="relative max-w-5xl mx-auto mb-8 flex items-center gap-4 py-4">
        <div className="relative w-16 h-16 flex items-center justify-center bg-card rounded-xl border border-border shadow-sm shrink-0">
          <Search className="w-8 h-8 text-accent animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            Search Results
          </h1>
          <div className="text-base sm:text-lg text-muted-foreground mt-0.5">
            for <span className="text-accent font-semibold">"{searchQuery.trim()}"</span>
          </div>
        </div>
      </div>

      {/* Products list card container */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6 max-w-5xl mx-auto shadow-sm transition-colors duration-300">
        {products && products.length > 0 ? (
          <>
            {/* Header info metrics */}
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border">
              <div className="w-1 h-5 bg-accent rounded-full"></div>
              <div className="text-sm font-semibold text-foreground">
                Found <span className="text-accent">{quantity}</span> products
              </div>
            </div>

            {/* Grid lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((item, index) => (
                <div className="flex justify-center" key={index}>
                  <ProductCard
                    className="w-full max-w-[420px] transition-transform duration-200 hover:-translate-y-1"
                    product_image={item.product_images ? item.product_images[0] : ""}
                    product_id={item.product_id}
                    product_name={item.product_name}
                    current_price={item.current_price}
                    buy_now_price={item.buy_now_price}
                    start_time={item.start_time}
                    end_time={item.end_time}
                    price_owner_username={item.price_owner_username}
                    price_owner_id={item.price_owner_id}
                    bid_turns={item.bid_turns}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty Search listings fallbacks */
          <div className="text-center py-16">
            <div className="relative inline-block mb-4">
              <Search className="w-16 h-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No products found</h3>
            <p className="text-sm text-muted-foreground">Please try searching with another keyword</p>
          </div>
        )}
      </div>

      {products && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <PaginationComponent
            numberOfPages={numberOfPages}
            currentPage={currentPage}
            controlPage={handleSetCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
