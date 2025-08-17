// サービスクラスのエクスポート
export { UserService } from './user/userService';
export { ProductService } from './product/productService';

// サービス関連の型定義のエクスポート
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  LoginResponse,
} from './user/userService';

export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsListResponse,
} from './product/productService';

// 将来のサービス追加例：
// export { OrderService } from './orderService';
// export type { Order, CreateOrderRequest } from './orderService';
