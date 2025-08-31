// サービスクラスのエクスポート
export { UserService } from './user/userService';
export { ProductService } from './product/productService';
export { ApplicationService } from './application/applicationService';

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

export type {
  Application,
  ApplicationCreateRequest,
  ApplicationIndexResponse,
  ApplicationCreateResponse,
  ApplicationCreateValidationError,
  ApplicationCreateApiResponse,
} from './application/applicationService';

// 将来のサービス追加例：
// export { OrderService } from './orderService';
// export type { Order, CreateOrderRequest } from './orderService';
