import HorizontalBar from "@/components/common/HorizontalBar";
import ProductCard from "@/components/common/ProductCard";
import { useEffect, useState } from "react";
import { Clock, TrendingUp, DollarSign } from "lucide-react";

function Section2() {
  return (
    <div className="relative py-12 px-4 text-foreground bg-background transition-colors duration-300">
      <div className="space-y-12">
        <Section21 />
        <Section22 />
        <Section23 />
      </div>
    </div>
  );
}

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

function Section21() {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch top ending soon products
        const promise = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/ending_soon?limit=5`
        );
        const response = await promise.json();
        if (!promise.ok) {
          throw new Error(response.message || "Failed to fetch top ending soon products");
        }
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Header section with Clock icon */}
      <div className="mb-6">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="relative">
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2.5 rounded-2xl shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
              Ending Soon
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Place your bids before time runs out
            </p>
          </div>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
      </div>

      {/* Products list HorizontalBar carousel */}
      <div className="relative">
        <HorizontalBar className="h-[400px] rounded-3xl bg-orange-500/5 dark:bg-orange-500/[0.02] border border-orange-500/10">
          {products &&
            products.length > 0 &&
            products.map((item, index) => (
              <div key={index} className="flex justify-center">
                <ProductCard
                  className="scale-80 hover:scale-85 shadow-md"
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
        </HorizontalBar>
      </div>
    </div>
  );
}

function Section22() {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch top products with highest bid counts
        const promise = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/most_bids?limit=5`
        );
        const response = await promise.json();
        if (!promise.ok) {
          throw new Error(response.message || "Failed to fetch top most bids products");
        }
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Header section with TrendingUp icon */}
      <div className="mb-6">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="relative">
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 rounded-2xl shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
              Most Bids
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Most popular items with the highest bid counts
            </p>
          </div>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
      </div>

      {/* Products list HorizontalBar carousel */}
      <div className="relative">
        <HorizontalBar className="h-[400px] rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/[0.02] border border-emerald-500/10">
          {products &&
            products.length > 0 &&
            products.map((item, index) => (
              <div key={index} className="flex justify-center">
                <ProductCard
                  className="scale-80 hover:scale-85 shadow-md"
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
        </HorizontalBar>
      </div>
    </div>
  );
}

function Section23() {
  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch top highest priced products
        const promise = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/highest_price?limit=5`
        );
        const response = await promise.json();
        if (!promise.ok) {
          throw new Error(response.message || "Failed to fetch top highest priced products");
        }
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Header section with DollarSign icon */}
      <div className="mb-6">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="relative">
            <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-2.5 rounded-2xl shadow-md">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
              Highest Price
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              The most valuable items on the market
            </p>
          </div>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
      </div>

      {/* Products list HorizontalBar carousel */}
      <div className="relative">
        <HorizontalBar className="h-[400px] rounded-3xl bg-violet-500/5 dark:bg-violet-500/[0.02] border border-violet-500/10">
          {products &&
            products.length > 0 &&
            products.map((item, index) => (
              <div key={index} className="flex justify-center">
                <ProductCard
                  className="scale-80 hover:scale-85 shadow-md"
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
        </HorizontalBar>
      </div>
    </div>
  );
}

export default Section2;