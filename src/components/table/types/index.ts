export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface TableRowWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export interface TableRowProps {
  application: Partial<Application>;
}

export interface ApplicationTableProps {
  applications?: Application[];
}

export interface Application {
  id?: string;
  name: string;
  symbol: string;
  notification: string;
  account: string;
}

export interface ApplicationListProps {
  title?: string;
  applications?: Application[];
}
