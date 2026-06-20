import { apiRequest } from "./api.client.ts";
import type { CategoryNode, CategoryEditItem } from "@/hooks/useCategory.ts";

const ADMIN_PATH = import.meta.env.VITE_PATH_ADMIN;

export const categoryService = {
  buildTree: async (): Promise<CategoryNode[]> => {
    const data = await apiRequest(`/${ADMIN_PATH}/api/category/build-tree`);
    return data.tree;
  },

  list: async (params?: Record<string, any>, body?: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/category/list`, {
      method: "POST",
      params,
      body,
    });
  },

  getTotal: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/category/number-of-categories`, {
      method: "GET",
      params,
    });
  },

  getById: async (id: number): Promise<CategoryEditItem> => {
    const data = await apiRequest(`/${ADMIN_PATH}/api/category/edit/${id}`);
    const it = data.item;
    return {
      id: it.id,
      name: it.name,
      status: it.status,
      parent_id: it.parent_id ?? null,
      description: it.description ?? "",
    };
  },

  create: async (body: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/category/create`, {
      method: "POST",
      body,
    });
  },

  update: async (id: number, body: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/category/edit/${id}`, {
      method: "PATCH",
      body,
    });
  },

  delete: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/category/delete/${id}`, {
      method: "PATCH",
    });
  },

  restore: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/category/restore/${id}`, {
      method: "PATCH",
    });
  },

  destroy: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/category/destroy/${id}`, {
      method: "DELETE",
    });
  },

  getAllClient: async (): Promise<any> => {
    return apiRequest(`/api/categories/all`);
  },

  getClientCat2: async (cat2_id: number): Promise<any> => {
    return apiRequest(`/api/categories/cat2`, { params: { cat2_id } });
  },

  getLevel1: async (): Promise<any> => {
    return apiRequest(`/api/categories/level1`);
  },

  getLevel2NoSlug: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/categories/level2/noslug`, { params });
  },

  getLevel2: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/categories/level2`, { params });
  },
};
