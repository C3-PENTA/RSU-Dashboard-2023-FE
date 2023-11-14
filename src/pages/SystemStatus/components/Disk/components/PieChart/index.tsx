import React, { useEffect, useRef } from 'react';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PIE_CHART_COLOR } from '@/constants';
import { Box, Group, Text, Title } from '@mantine/core';
import { ISummarySystemStatus } from '@/interfaces/interfaceDashboard';

interface PieChartDataProp {
  data: ISummarySystemStatus | undefined;
}

interface DiskUsageElement {
  color?: string;
  label?: string;
  value?: number;
}

const PieChart = (props: PieChartDataProp) => {
  const { data } = props;
  const usage = data?.diskUsage != null ? data?.diskUsage : null;

  let diskUsageGroups: DiskUsageElement[] = [];
  if (usage != null) {
    diskUsageGroups = [
      {
        color: usage < 100 ? PIE_CHART_COLOR.USED : PIE_CHART_COLOR.FULL,
        label: '사용 중',
        value: usage,
      },
      { color: PIE_CHART_COLOR.AVAILABLE, label: '사용 가능', value: 100 - usage },
      { color: PIE_CHART_COLOR.NOT_ASSIGN, label: '할당되지', value: 0 },
      { color: PIE_CHART_COLOR.OTHER, label: '기타', value: 0 },
      { color: PIE_CHART_COLOR.FULL, label: '가득 참' },
    ];
  }

  const chartRef = useRef(null);
  let convertedData: {
    labels: string[];
    datasets: { data: number[]; backgroundColor: string[] }[];
  };

  useEffect(() => {
    if (usage != null) {
      convertedData = {
        labels: ['사용 중', '사용 가능', '할당되지', '기타', '가득 참'],
        datasets: [
          {
            data: [usage, 100 - usage],
            backgroundColor: [
              usage < 80 ? PIE_CHART_COLOR.USED : PIE_CHART_COLOR.FULL,
              PIE_CHART_COLOR.AVAILABLE,
              PIE_CHART_COLOR.NOT_ASSIGN,
              PIE_CHART_COLOR.OTHER,
              PIE_CHART_COLOR.FULL,
            ],
          },
        ],
      };

      let chartInstance: Chart<keyof ChartTypeRegistry, number[], string> | undefined;

      if (chartRef && chartRef.current) {
        if (chartInstance) {
          chartInstance.destroy();
        }
        chartInstance = new Chart(chartRef.current, {
          type: 'pie',
          data: convertedData,
          plugins: [ChartDataLabels],
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
                position: 'center',
              },
              title: {
                display: false,
                text: 'Disk',
              },
              datalabels: {
                color: 'black',
                formatter: (value) => {
                  return `${value}%`;
                },
              },
            },
          },
        });
      }

      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }
  }, [data]);

  return (
    <Group sx={{ flex: 2, justifyContent: 'space-evenly' }}>
      {usage && (
        <Group
          sx={{
            justifyContent: 'center',
            minWidth: '50%',
            height: '50%',
          }}
        >
          <canvas ref={chartRef}></canvas>
        </Group>
      )}
      <Box>
        <Group position="left" mb={'sm'}>
          {usage != null && <Title order={5}>총 용량 : 100.00GB</Title>}
          {usage == null && <Title order={5}>총 용량 : - GB</Title>}
        </Group>
        {usage != null &&
          diskUsageGroups.map((group) => (
            <Group position="left" key={group.label}>
              <svg height="20" width="20">
                <circle cx="5" cy="5" r="5" fill={group.color} />
              </svg>
              <Text>
                {group.label} {group.value !== undefined ? `:${group.value} GB` : ''}
              </Text>
            </Group>
          ))}
      </Box>
    </Group>
  );
};

export default PieChart;
