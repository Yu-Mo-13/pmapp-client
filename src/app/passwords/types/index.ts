export type { PasswordIndexRow } from '@/api/services/password/passwordService';

export interface PasswordApplicationOption {
  id: number;
  name: string;
}

export interface PasswordActionMessage {
  type: 'success' | 'error';
  text: string;
}
