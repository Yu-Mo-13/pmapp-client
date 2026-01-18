import { Account } from '@/api/services/account/accountService';

export interface AccountTableRowProps {
  account: Partial<Account>;
}

export interface AccountTableProps {
  accounts?: Account[];
}

export interface AccountListProps {
  title?: string;
  accounts?: Account[];
}
