interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

export interface ChartConfig {
    id: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'doughnut';
    width: number;
    height: number;
    data: ChartData;
}