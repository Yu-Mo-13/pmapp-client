// サービスクラスのエクスポート
export { UserService } from './user/userService';
export { ProductService } from './product/productService';
export { ApplicationService } from './application/applicationService';
export { MenuService, extractMenuItems } from './menu/menuService';
export { PasswordService } from './password/passwordService';
export {
  UnregistedPasswordService,
  extractUnregistedPasswordIndexRows,
  extractUnregistedPasswordShow,
} from './unregistedPassword/unregistedPasswordService';

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
  ApplicationValidationError,
  ApplicationCreateApiResponse,
} from './application/applicationService';

export type { MenuIndexResponse } from './menu/menuService';
export type {
  PasswordCreateRequest,
  PasswordCreateValidationError,
  PasswordCreateApiResponse,
} from './password/passwordService';
export type {
  UnregistedPasswordIndexRow,
  UnregistedPasswordShowResponse,
  UnregistedPasswordDeleteAllResponse,
} from './unregistedPassword/unregistedPasswordService';

// 将来のサービス追加例：
// export { OrderService } from './orderService';
// export type { Order, CreateOrderRequest } from './orderService';
