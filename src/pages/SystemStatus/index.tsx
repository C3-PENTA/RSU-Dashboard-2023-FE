import { Box, Grid, LoadingOverlay } from '@mantine/core';
import { Detail, Disk, NIC, LineChart } from './components';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '@/App';
import { getAvailEvent } from '@/services/UsageAPI';
import { useLoading } from '@/LoadingContext';
import { AUTO_REFRESH_TIME, LINE_CHART_TITLE } from '@/constants';
import { getAutoRefresh } from '@/services/HeaderAPI';
import { ISummarySystemStatus } from '@/interfaces/interfaceDashboard';
import { notifications } from '@mantine/notifications';
import { CircleX } from 'tabler-icons-react';
export interface DisksUsageData {
  name: string;
  disk_usage: number;
}

export interface AvailEventData {
  eventId: string;
  nodeId: string;
  cpuUsage: number;
  cpuTemp: number;
  ramUsage: number;
  diskUsage: number;
  networkSpeed: string;
  networkUsage: string;
  networkStatus: string;
  detail: string;
  status: number;
  createdAt: string;
}

const SystemStatus = () => {
  const { setLoginState, currentUser } = useContext(LoginContext);
  const { loading, setLoading } = useLoading();
  const [availEvent, setAvailEvent] = useState<ISummarySystemStatus[]>([]);
  const [loadedAPI, setLoadedAPI] = useState(false);

  useEffect(() => {
    getEvent();
    const interval = setInterval(() => {
      getAutoRefresh().subscribe({
        next: ({ data }) => {
          data && getEvent();
          !data &&
            notifications.show({
              icon: <CircleX size="1rem" color="red" />,
              autoClose: 3500,
              color: 'red',
              title: 'Maintaining',
              message: 'Auto refresh is off',
            });
        },
        error(err) {
          console.log(err);
        },
      });
    }, AUTO_REFRESH_TIME * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('refreshClick', getEvent);
    return () => {
      document.removeEventListener('refreshClick', getEvent);
    };
  }, []);

  const getEvent = () => {
    setLoading(true);
    setLoginState(currentUser.exp > Date.now() / 1000);
    if (currentUser.exp > Date.now() / 1000) {
      getAvailEvent(1).subscribe({
        next: ({ data }) => {
          setAvailEvent(data);
          setLoadedAPI(true);
          setLoading(false);
        },
        error() {
          setLoading(false);
        },
      });
    }
  };

  return (
    <Box
      id="usage"
      p={'16px'}
      sx={(theme) => ({ height: 'auto', borderRadius: 8, backgroundColor: theme.colors.gray[8] })}
    >
      <Grid gutter="xs" justify="center" sx={{ gridAutoRows: '1' }}>
        <Grid.Col span={4}>
          <LineChart title={LINE_CHART_TITLE.CPU} type="cpu" />
        </Grid.Col>
        <Grid.Col span={4}>
          <LineChart title={LINE_CHART_TITLE.RAM} type="ram" />
        </Grid.Col>
        <Grid.Col span={4}>
          <Disk title="DISK 활용량" data={availEvent} loadedAPI={loadedAPI} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Detail data={availEvent} loadedAPI={loadedAPI} />
        </Grid.Col>
        <Grid.Col span={8}>
          <NIC data={availEvent} loadedAPI={loadedAPI} />
        </Grid.Col>
      </Grid>
      {loading && <LoadingOverlay visible={loading} overlayBlur={2} sx={{ position: 'fixed' }} />}
    </Box>
  );
};

export default SystemStatus;
