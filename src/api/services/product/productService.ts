import apiClient from '../../client';
import { ApiResponse, RequestData } from '../../types';

// プロダクト関連の型定義
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  imageUrl?: string;
}

export interface ProductsListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

/**
 * プロダクト関連のAPIサービス
 */
export class ProductService {
  /**
   * プロダクト一覧を取得
   */
  static async getProducts(page = 1, limit = 10): Promise<ApiResponse<ProductsListResponse>> {
    return apiClient.get<ProductsListResponse>(`/products?page=${page}&limit=${limit}`);
  }

  /**
   * 特定のプロダクトを取得
   */
  static async getProduct(id: number): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  /**
   * プロダクトを作成
   */
  static async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/products', productData as unknown as RequestData);
  }

  /**
   * プロダクトを更新
   */
  static async updateProduct(id: number, productData: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/products/${id}`, productData as unknown as RequestData);
  }

  /**
   * プロダクトを削除
   */
  static async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${id}`);
  }

  /**
   * カテゴリ別プロダクト一覧を取得
   */
  static async getProductsByCategory(categoryId: number): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/products/category/${categoryId}`);
  }
}
