// MainLayout.tsx (React Router)
import { Outlet } from "react-router-dom";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/ProtectedRouter";

export default function MainLayout() {
  const { auth } = useAuth();
  const route = useNavigate();

  if (!auth) {
    route("/");
    return null;
  }

  if (auth.role !== "admin") {
    route("/");
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      {/* Fixed top header with border */}
      <header className="fixed inset-x-0 top-0 z-20 border-b border-border bg-card transition-colors duration-300">
        <Header />
      </header>

      {/* Grid container for navigation and main views */}
      <div
        className="grid"
        style={{
          gridTemplateRows: "1fr",
          gridTemplateColumns: "240px 1fr",
        }}
      >
        {/* Sticky sidebar for administration routing */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] overflow-y-auto border-r border-border bg-card transition-colors duration-300 md:block">
          <Sidebar />
        </aside>

        {/* Main viewing area with offset padding */}
        <main className="pt-16 bg-muted/10">
          <div className="min-h-[calc(100vh-64px)] overflow-y-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
