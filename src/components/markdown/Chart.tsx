import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartType,
} from 'chart.js';
import {
    Bar,
    Line,
    Scatter,
    Doughnut,
    Pie,
} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export type SupportedChartType = 'line' | 'bar' | 'scatter' | 'doughnut' | 'pie';

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

export interface ChartProps {
    type?: SupportedChartType;
    data: ChartData;
    title?: string;
    options?: ChartOptions<any>;
    width?: string | number;
    height?: string | number;
}

const DEFAULT_COLOR = 'rgba(0, 123, 255, 1)';
const DEFAULT_BACKGROUND = 'rgba(0, 123, 255, 0.5)';

export default function Chart({
    type = 'line',
    data,
    title,
    options,
    width = '100%',
    height = '300px',
}: ChartProps) {
    const datasets = data.datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: DEFAULT_COLOR,
        backgroundColor: DEFAULT_BACKGROUND,
        fill: type === 'line' ? false : true,
    }));

    const chartData = {
        labels: data.labels,
        datasets,
    };

    function getChartOptions<T extends ChartType>(): ChartOptions<T> {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const,
                    labels: { color: "white" },
                },
                title: title
                    ? { display: true, text: title, color: "white", font: { size: 15 } }
                    : undefined,
                ...options?.plugins,
            },
            scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } },
            },
            ...options,
        } as ChartOptions<T>;
    }

    const containerStyle: React.CSSProperties = {
        width,
        height,
        position: 'relative',
    };

    switch (type) {
        case 'bar':
            return (
                <div style={containerStyle} className="mb-5">
                    <Bar data={chartData} options={getChartOptions<'bar'>()} width={width} height={height} />
                </div>
            );
        case 'line':
            return (
                <div style={containerStyle} className="mb-5">
                    <Line data={chartData} options={getChartOptions<'line'>()} width={width} height={height} />
                </div>
            );
        case 'scatter':
            return (
                <div style={containerStyle} className="mb-5">
                    <Scatter data={chartData} options={getChartOptions<'scatter'>()} width={width} height={height} />
                </div>
            );
        case 'doughnut':
            return (
                <div style={containerStyle} className="mb-5">
                    <Doughnut data={chartData} options={getChartOptions<'doughnut'>()} width={width} height={height} />
                </div>
            );
        case 'pie':
            return (
                <div style={containerStyle} className="mb-5">
                    <Pie data={chartData} options={getChartOptions<'pie'>()} width={width} height={height} />
                </div>
            );
        default:
            return null;
    }
}
