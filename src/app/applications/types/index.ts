import { Application } from "@/api/services/application/applicationService";

export interface ApplicationTableRowProps {
  application: Partial<Application>;
}

export interface ApplicationTableProps {
  applications?: Application[];
}

export interface ApplicationListProps {
  title?: string;
  applications?: Application[];
}
