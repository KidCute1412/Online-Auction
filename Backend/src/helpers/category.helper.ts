export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  slug: string;
  cat_image?: string;
}

export interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  cat_image: string;
  children: CategoryNode[];
}

export const buildTree = (
  categories: Category[],
  parentID: number | null = null
): CategoryNode[] => {
  const tree: CategoryNode[] = [];

  categories.forEach((item) => {
    if (item.parent_id === parentID) {
      const children = buildTree(categories, item.id);

      tree.push({
        id: item.id,
        cat_image: item.cat_image || "",
        name: item.name,
        slug: item.slug,
        children,
      }); 
    }
  });

  return tree;
};

