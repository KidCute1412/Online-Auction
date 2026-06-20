import ProductCard from "@/components/common/ProductCard";
import PaginationComponent from "@/components/common/Pagination";
import SelectComponent from "@/components/common/Select";
import { usePreventBodyLock } from "@/hooks/usePreventBodyLock";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { slugify } from "@/utils/make_slug";
import Loading from "@/components/common/Loading";
import { Search } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { categoryService } from "@/services/category.service.ts";
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

type Cat = {
  cat_id: number;
  cat_name: string;
};

function ListProductsPage() {
  usePreventBodyLock();
  const [searchParams, setSeachParams] = useSearchParams();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();

  const [price, setFilterPrice] = useState(searchParams.get("price") || "");
  const [time, setFilterTime] = useState(searchParams.get("time") || "");
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [quantity, setQuantity] = useState(0);

  const [products, setProducts] = useState<Products[]>();
  const [isLoading, setLoading] = useState(true);
  const [cat2, setCat2] = useState<Cat | null>(null);

  useEffect(() => {
    const cat2_id = searchParams.get("cat2_id");
    // Fetch categories information
    categoryService.getClientCat2(Number(cat2_id))
      .then((data) => {
        setCat2({
          cat_id: data.data.cat2_id,
          cat_name: data.data.cat2_name,
        });

        // Set navigation breadcrumb layout values
        setBreadcrumbs([
          { label: "Home", path: "/" },
          { label: "Categories", path: "/categories" },
          {
            label: data.data.cat1_name,
            path: `/categories/${slugify(data.data.cat1_name)}-${data.data.cat1_id}`,
          },
          { label: data.data.cat2_name, path: null },
        ]);
      })
      .catch((error) => {
        toast.error(error.message || "Server connection error");
      });
  }, [searchParams, setBreadcrumbs]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const page = searchParams.get("page");
        setCurrentPage(page ? Number(page) : 1);
        const cat2_id = searchParams.get("cat2_id");
        const priceFilter = searchParams.get("price");
        const timeFilter = searchParams.get("time");
        const searchFilter = searchParams.get("search");

        setFilterPrice(priceFilter || "");
        setFilterTime(timeFilter || "");
        setSearchText(searchFilter || "");
        
        const data = await productService.getPageList({
          cat2_id,
          page,
          price: priceFilter,
          time: timeFilter,
          search: searchFilter || "",
        });

        if (!data || data.status === "error") {
          toast.error("Error retrieving data");
          setLoading(false);
          return;
        }
        setLoading(false);
        setProducts(data.data);
        setNumberOfPages(data.numberOfPages);
        setQuantity(data.quantity);
      } catch (e) {
        toast.error("Server connection error");
      }
    };
    getData();
  }, [searchParams]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(currentPage));
    setSeachParams(newParams, { replace: currentPage === 1 });
  }, [currentPage]);

  const filterPrice = [
    {
      value: "asc",
      content: "Price: Low to High",
    },
    {
      value: "desc",
      content: "Price: High to Low",
    },
    {
      value: "none",
      content: "Price",
    },
  ];

  const filterTime = [
    {
      value: "asc",
      content: "Time remaining: Ascending",
    },
    {
      value: "desc",
      content: "Time remaining: Descending",
    },
    {
      value: "none",
      content: "Time remaining",
    },
  ];

  const handleSubmitFilter = () => {
    let filTime, filPrice;
    if (time === "" || time === "none") filTime = "none";
    else filTime = time;
    if (price === "" || price === "none") filPrice = "none";
    else filPrice = price;

    const newUrl = new URLSearchParams(searchParams.toString());
    if (filTime) newUrl.set("time", filTime);
    if (filPrice) newUrl.set("price", filPrice);
    if (searchText) newUrl.set("search", searchText);
    else newUrl.delete("search");
    navigate(`/products?${newUrl.toString()}`);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header and Filter block */}
      <div className="bg-card border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-2">
              {cat2?.cat_name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Explore auction products in this category
            </p>
          </div>

          {/* Filtering operations stack */}
          <div className="flex flex-col gap-4">
            {/* Searching key entries */}
            <div className="w-full max-w-md relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitFilter();
                }}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border rounded-full outline-none focus:border-accent focus:bg-background transition-all duration-200 text-sm text-foreground"
                />
              </form>
            </div>

            {/* Sorting controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="w-full sm:w-48">
                  <SelectComponent
                    items={filterPrice}
                    placeholder="Sort by price"
                    value={price}
                    setState={setFilterPrice}
                  />
                </div>
                <div className="w-full sm:w-56">
                  <SelectComponent
                    items={filterTime}
                    placeholder="Sort by time"
                    value={time}
                    setState={setFilterTime}
                  />
                </div>
                <button
                  type="button"
                  className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-[120px] cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
                  onClick={handleSubmitFilter}
                >
                  Apply
                </button>
              </div>

              <div className="text-xs font-semibold text-muted-foreground">
                {quantity > 0 && <span>{quantity} products</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid rendering products lists */}
      <div className="container mx-auto px-4 py-8">
        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {products.map((item, index) => (
                <div key={index} className="flex justify-center">
                  <ProductCard
                    className="w-full max-w-[450px]"
                    product_image={
                      item.product_images ? item.product_images[0] : ""
                    }
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

            {/* Pagination container */}
            <div className="flex justify-center mt-10">
              <PaginationComponent
                numberOfPages={numberOfPages}
                currentPage={currentPage}
                controlPage={setCurrentPage}
              />
            </div>
          </>
        ) : (
          /* Empty listings fallbacks */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-muted-foreground text-5xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                No products available
              </h3>
              <p className="text-sm text-muted-foreground">
                Currently there are no products in this category. Please check back later or explore other categories.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListProductsPage;
