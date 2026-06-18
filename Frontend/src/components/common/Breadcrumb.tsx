import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

function Breadcrumbs() {
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb();
  const location = useLocation();

  // Reset breadcrumbs on route change
  useEffect(() => {
    setBreadcrumbs([]);
  }, [location.pathname, setBreadcrumbs]);

  // Render nothing if breadcrumbs list is empty
  if (breadcrumbs.length === 0) return null;

  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm animate__animated animate__fadeIn py-3">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <BreadcrumbItem key={index} className="flex items-center gap-1">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="text-muted-foreground hover:text-accent font-semibold transition-colors duration-200 max-w-[200px] sm:max-w-[500px] truncate"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium max-w-[200px] sm:max-w-[500px] truncate">
                      {item.label}
                    </span>
                  )}
                  {!isLast && <BreadcrumbSeparator className="text-muted-foreground/50" />}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

export default Breadcrumbs;