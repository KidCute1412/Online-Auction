/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import JustValidate from "just-validate";
import { useEffect, useMemo, useRef, useState } from "react";
import { slugify } from "@/utils/make_slug";
import { useBuildTree, useCategoryWithID } from "@/hooks/useCategory";
import { toast } from "sonner";

type FlatOption = {
  id: number;
  label: string;
};

export default function CategoryEdit() {
  const { id } = useParams();
  const editorRef = useRef(null);
  const { item } = useCategoryWithID(Number(id));
  const { tree } = useBuildTree();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const flattenTree = (nodes: any, level = 0): FlatOption[] => {
    const result: FlatOption[] = [];

    nodes.forEach((node: any) => {
      const prefix = level > 0 ? "-".repeat(level) + " " : "";
      result.push({ id: node.id, label: `${prefix}${node.name}` });

      if (node.children && node.children.length > 0) {
        result.push(...flattenTree(node.children, level + 1));
      }
    });

    return result;
  };

  const options: FlatOption[] = useMemo(() => {
    if (!tree) return [];
    return flattenTree(tree);
  }, [tree]);

  useEffect(() => {
    if (!item) return;
    const validate = new JustValidate("#CategoryEditForm");
    validate
      .addField(
        "#name",
        [{ rule: "required", errorMessage: "Please enter a category name!" }],
        { errorContainer: "#nameError" }
      )
      .onSuccess((event: any) => {
        setIsLoading(true);
        const name = event.target.name.value;
        const status = event.target.status.value;
        const parentValue = event.target.parent.value as string;
        const parent_id = parentValue === "" ? null : Number(parentValue);
        let description;
        if (editorRef.current) {
          description = (editorRef.current as any).getContent();
        }

        const slug = slugify(name);
        const dataFinal = {
          name: name,
          status: status,
          description: description,
          parent_id: parent_id,
          slug: slug,
        };

        // Submit patch request to update category details
        fetch(
          `${import.meta.env.VITE_API_URL}/${
            import.meta.env.VITE_PATH_ADMIN
          }/api/category/edit/${id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataFinal),
            credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setIsLoading(false);
            if (data.code === "error") {
              toast.error(data.message);
            }
            if (data.code === "success") {
              toast.success(data.message);
            }
          })
          .catch(() => {
            setIsLoading(false);
            toast.error("An error occurred!");
          });
      });
  }, [item, id]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 text-foreground">
      {item && (
        <form id="CategoryEditForm" className="w-full max-w-5xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Edit Category</h2>

          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-colors duration-300">
            <div className="space-y-4">
              {/* Category name and parent inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label
                    htmlFor="name"
                    className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Category Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    defaultValue={item.name}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                    placeholder="Enter category name"
                  />
                  <div id="nameError" className="text-xs text-destructive mt-0.5 min-h-[16px] font-medium"></div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="parent"
                    className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Parent Category
                  </label>
                  <select
                    id="parent"
                    name="parent"
                    className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground shadow-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 disabled:bg-muted transition-all duration-200"
                    defaultValue={item.parent_id ?? ""}
                  >
                    <option value="" className="bg-card text-foreground">-- Select parent category --</option>
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-card text-foreground">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status input selection field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label
                    htmlFor="status"
                    className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                    defaultValue={item.status}
                  >
                    <option value="active" className="bg-card text-foreground">Active</option>
                    <option value="inactive" className="bg-card text-foreground">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Description Input editor */}
              <div className="w-full">
                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <div className="w-full">
                  <TinyMCEEditor
                    editorRef={editorRef}
                    value={item.description ? item.description : ""}
                  />
                </div>
              </div>

              {/* Form trigger action links */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full sm:w-auto rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update Category"}
                </button>

                <button
                  type="button"
                  className="cursor-pointer w-full sm:w-auto text-sm font-semibold text-accent hover:underline transition-colors py-2"
                  onClick={() => {
                    navigate(`/${import.meta.env.VITE_PATH_ADMIN}/category/list`);
                  }}
                >
                  Back to list
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
