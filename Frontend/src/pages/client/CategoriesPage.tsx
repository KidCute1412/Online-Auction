import CategoryCard from "@/components/common/CategoryCard";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { slugify } from "@/utils/make_slug";
import Loading from "@/components/common/Loading";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

const getLevelCategoriesList = async (level: number, catId?: number, catSlug?: string) => {
  let linkFetch = "";
  if (level === 1) {
    linkFetch = `${import.meta.env.VITE_API_URL}/api/categories/level1`;
  } else if (level === 2) {
    linkFetch = `${import.meta.env.VITE_API_URL}/api/categories/level2?cat_id=${catId}&cat_slug=${catSlug}`;
  }
  try {
    const response = await fetch(linkFetch);
    const data = await response.json();

    if (!response.ok) {
      console.log("Error: ", data.message);
      toast.error("An error occurred");
      return null;
    }
    return data;
  } catch (e) {
    console.log("Error connecting backend: ", e);
    toast.error("Connection error");
    return null;
  }
};

interface CategoryData {
  id: number;
  name: string;
  cat_image: string;
}

function AllCategoriesPage({ level }: { level: number }) {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();
  const [subCategories, setSubCategories] = useState<CategoryData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [cat1_name, setCat1_name] = useState("");

  const { slugid } = useParams();
  console.log(slugid);
  let catSlug: string | undefined;
  let catId: string | undefined;
  if (slugid) {
    const parts = slugid.split("-");
    catId = parts.pop();
    catSlug = parts.join("-");
  }
  const numericCatId = Number(catId);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const finalData = await getLevelCategoriesList(level, numericCatId, catSlug);

      if (finalData) {
        setSubCategories(finalData.data);
        if (level === 2 && finalData.cat1_name) {
          const cat1Name = finalData.cat1_name;
          setCat1_name(cat1Name);

          // Update breadcrumb navigation for sub-level view
          setBreadcrumbs([
            { label: "Home", path: "/" },
            { label: "Categories", path: "/categories" },
            { label: cat1Name, path: null },
          ]);
        } else if (level === 1) {
          // Update breadcrumb navigation for root-level view
          setBreadcrumbs([
            { label: "Home", path: "/" },
            { label: "Categories", path: null },
          ]);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [level, slugid, numericCatId, catSlug, setBreadcrumbs]);

  const handleClick = (id: number, name: string) => {
    if (level === 1) {
      const slug = slugify(name);
      navigate(`/categories/${slug}-${id}`);
    }
    if (level === 2) {
      navigate(`/products?cat2_id=${id}&page=${1}`);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Container wrapper for main contents */}
      <div className="container mx-auto px-4 py-8">
        {/* Header section introducing the current viewing categories */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-3">
            {level === 1 ? "All Categories" : cat1_name}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            {level === 1
              ? "Explore all of our product categories"
              : `Subcategories of ${cat1_name}`}
          </p>
          <div className="w-16 h-1 bg-accent/60 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Categories rendering layout grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategories.map((item, index) => {
              return (
                <div key={index} className="transition-transform duration-200 hover:-translate-y-1">
                  <CategoryCard
                    image={item.cat_image}
                    name={item.name}
                    onClick={() => handleClick(item.id, item.name)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty list fallbacks */}
        {subCategories.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-muted-foreground text-sm">
              No categories to display
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllCategoriesPage;
