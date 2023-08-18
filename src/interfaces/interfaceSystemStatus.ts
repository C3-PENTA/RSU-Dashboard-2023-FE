export interface LineChartData {
  id: string;
  usage: {
    timestamp: string;
    average: number;
  }[];
}
