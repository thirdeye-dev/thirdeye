export interface OverviewContract {
  name: string;
  id: number;
  entries: {
    day: string;
    date: string;
    executions: number;
  }[];
}

export type OverviewData = OverviewContract[];
