import { memo, useEffect, useRef } from 'react';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Group, Divider, Text } from '@mantine/core';
import { EVENT_CLICK_NAME, LINE_CHART_TITLE, LINE_CHART_TYPE } from '@/constants';
import { StateInfo } from '../..';
import { NoData } from '@/components';
import { LineChartData } from '@/interfaces/interfaceSystemStatus';
import moment from 'moment';

interface LineChartSystemProps {
  listStateRSU: StateInfo[];
  title: string;
  type: string;
  data: LineChartData[];
}

type Dataset = {
  label: string;
  data: number[];
  labels?: string[];
  fill: boolean;
  pointStyle: false | 'circle';
  pointBackgroundColor: string;
  borderColor: string;
  borderDash: number[];
  tension: number;
  showLine?: boolean;
  pointRadius?: number;
};

Chart.register(annotationPlugin);
Chart.register(zoomPlugin);

const LineChartSystem = (props: LineChartSystemProps) => {
  const { listStateRSU, title, type, data } = props;
  const isEmpty = data.length <= 0;

  const generateColorList = (rsuList: StateInfo[]) => {
    const colors: Record<string, string> = {};
    const baseLightness = 50;
    const redHueThreshold = 30;
    const count = rsuList.length;

    for (let i = 0; i < count; i++) {
      let hue = (i * (360 / count)) % 360;
      if (hue >= 360 - redHueThreshold || hue <= redHueThreshold) {
        hue = (hue + 180) % 360;
      }

      const saturation = 70;
      const lightness = baseLightness + i * (50 / count);
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors[rsuList[i].id] = color;
    }

    return colors;
  };

  useEffect(() => {
    document.addEventListener(EVENT_CLICK_NAME.ZOOM_IN_BUTTON + title + type, handleZoomIn);
    document.addEventListener(EVENT_CLICK_NAME.ZOOM_OUT_BUTTON + title + type, handleZoomOut);
    return () => {
      document.removeEventListener(EVENT_CLICK_NAME.ZOOM_IN_BUTTON + title + type, handleZoomIn);
      document.removeEventListener(EVENT_CLICK_NAME.ZOOM_OUT_BUTTON + title + type, handleZoomOut);
    };
  }, []);

  const colorList = generateColorList(listStateRSU);

  const generateLabels = (data: LineChartData[] | undefined, type: string): string[] => {
    const labels: string[] = [];
    const uniqueDates = new Set();

    if (data) {
      data.forEach((item) => {
        item.usage.forEach((usage) => {
          const timestamp = moment.utc(usage.timestamp).local();
          let label = '';

          if (type === LINE_CHART_TYPE.MONTH) {
            label = timestamp.format('MMM D');
          } else if (type === LINE_CHART_TYPE.DATE) {
            label = timestamp.format('h A');
          } else {
            label = timestamp.format('h:mm A');
          }

          if (!uniqueDates.has(label)) {
            labels.push(label);
            uniqueDates.add(label);
          }
        });
      });
    }

    return labels;
  };
  const labels: string[] = generateLabels(data, type);
  console.log('labels', labels);
  const convertToDataset = (data: LineChartData[]): Dataset[] => {
    const referenceLine: Dataset = {
      label: '정상치 기준선',
      data: Array(100).fill(title === LINE_CHART_TITLE.CPU ? 70 : 80),
      fill: false,
      pointStyle: false,
      pointBackgroundColor: 'red',
      borderColor: 'red',
      borderDash: [6, 6],
      tension: 0.1,
      showLine: true,
    };

    const datasets: Dataset[] = data.map((item, index) => {
      const isShow: boolean | undefined = listStateRSU.find(
        (itemState) => itemState.id === item.id,
      )?.state;
      return {
        label: item.id,
        data: item.usage.map((usage) => usage.average),
        labels,
        fill: false,
        pointStyle: 'circle',
        pointBackgroundColor: colorList[item.id],
        borderColor: colorList[item.id],
        borderDash: [],
        tension: 0.1,
        showLine: isShow,
        pointRadius: isShow ? 3 : 0,
      };
    });
    datasets.unshift(referenceLine);
    return datasets;
  };

  const dataset = convertToDataset(data);
  const renderDividers = (
    <Group position="center" mt={'lg'}>
      {listStateRSU.map((item, index) => {
        if (item.id !== '정상치 기준선' && item.state == true) {
          return (
            <Divider
              key={index}
              sx={{ width: '15%' }}
              color={colorList[item.id]}
              labelPosition="right"
              label={item.id}
              size={3}
            />
          );
        }
      })}
      <Divider
        key={listStateRSU.length}
        sx={{ width: '28%' }}
        variant="dashed"
        color="red"
        labelPosition="right"
        label={'정상치 기준선'}
        size={3}
      ></Divider>
    </Group>
  );

  const chartRef = useRef<HTMLCanvasElement>(null);
  let chartInstance: Chart<keyof ChartTypeRegistry, number[], string> | undefined;
  const handleZoomIn = () => {
    if (chartInstance && chartInstance?.config?.options?.scales?.x) {
      const { min, max } = chartInstance.config.options.scales.x;
      if (typeof min === 'number' && typeof max === 'number') {
        if (max - min >= 5) {
          chartInstance.zoom(1.4);
        }
      }
    }
  };

  const handleZoomOut = () => {
    if (chartInstance && chartInstance?.config?.options?.scales?.x) {
      chartInstance.zoom(3 / 10);
    }
  };

  useEffect(() => {
    function ctrlZoom(
      event: WheelEvent,
      chart: Chart<keyof ChartTypeRegistry, number[], string> | undefined,
    ) {
      event.preventDefault();
      if (event.ctrlKey && chart?.config?.options?.scales?.x) {
        event.preventDefault();
        const { min, max } = chart.config.options.scales.x;
        const deltaY = event.deltaY;
        if (typeof min === 'number' && typeof max === 'number') {
          const bound = Math.ceil(labels.length / 2);
          const step = Math.ceil(bound / 4);
          if (deltaY < 0) {
            if (max - bound > step) {
              chart.config.options.scales.x.min = min + step;
              chart.config.options.scales.x.max = max - step;
            } else {
              chart.config.options.scales.x.min = bound - 2;
              chart.config.options.scales.x.max = bound + 2;
            }
          } else {
            if (min - step >= 0) {
              chart.config.options.scales.x.min = min - step;
              chart.config.options.scales.x.max = max + step;
            } else {
              chart.config.options.scales.x.min = 0;
              chart.config.options.scales.x.max = labels.length;
            }
          }
          chart.update();
        }
      }
    }
    if (chartRef && chartRef.current) {
      chartInstance = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: labels,
          datasets: dataset,
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              filter: (tooltipItem) => {
                return tooltipItem.datasetIndex !== 0;
              },
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'x',
              },
              zoom: {
                pinch: {
                  enabled: true,
                },
                mode: 'x',
              },
            },
          },
          scales: {
            x: {
              position: 'bottom',
              ticks: {
                color: 'white',
              },
              min: 0,
              max: labels.length - 1,
            },
            y: {
              ticks: {
                color: 'white',
              },
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });
      chartInstance.canvas.addEventListener('wheel', (e) => {
        ctrlZoom(e, chartInstance);
      });
      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }
  }, [dataset]);
  return (
    <div
      style={{
        width: '100%',
        height: '50%',
        textAlign: 'center',
      }}
    >
      {isEmpty ? <NoData /> : <Text size={'xs'}>Ctrl + 마우스 휠로 확대/축소 가능합니다</Text>}
      <canvas id={`${title}_${type}`} ref={chartRef}></canvas>
      {data.length > 0 && renderDividers}
    </div>
  );
};

export default memo(LineChartSystem);
