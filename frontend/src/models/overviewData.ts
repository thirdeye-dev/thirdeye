export interface OverviewContract {
  name: string;
  id: number;
  color: string;
  entries: {
    day: string;
    executions: number;
  }[];
}

export type OverviewData = OverviewContract[];
