import {
  Account,
  AccountIndexRow,
} from '@/api/services/account/accountService';

export interface AccountTableRowProps {
  account: Partial<AccountIndexRow>;
}

export interface AccountTableProps {
  accounts?: Account[];
}

export interface AccountListProps {
  title?: string;
  accounts?: Account[];
}
