export interface OverviewContract {
  name: string;
  id: number;
  color: string;
  entries: {
    day: string;
    date: string;
    executions: number;
  }[];
}

export type OverviewData = OverviewContract[];
