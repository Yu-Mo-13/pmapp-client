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
