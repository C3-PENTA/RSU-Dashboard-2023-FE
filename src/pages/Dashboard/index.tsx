import { useEffect, useState } from 'react';
import { Map } from './components';
import { IRsuData } from '@/interfaces/interfaceDashboard';
import { getRSUInfomation } from '@/services/DashboardAPI';
import { useLoading } from '@/LoadingContext';
import { Box, LoadingOverlay } from '@mantine/core';
import { getAutoRefresh } from '@/services/HeaderAPI';
import { AUTO_REFRESH_TIME } from '@/constants';

const Dashboard = () => {
  const [rsuData, setRsuData] = useState<IRsuData[]>([]);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getAutoRefresh().subscribe({
        next: ({ data }) => {
          data && getData();
        },
        error(err) {
          console.log(err);
        },
      });
    }, AUTO_REFRESH_TIME * 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    document.addEventListener('refreshClick', getData);
    return () => {
      document.removeEventListener('refreshClick', getData);
    };
  }, []);
  const getData = () => {
    setLoading(true);
    getRSUInfomation().subscribe({
      next: ({ data }) => {
        setRsuData(data.nodes);
        setLoading(false);
      },
    });
  };
  return (
    <>
      {rsuData.length > 0 && <Map data={rsuData} />}
      {loading && <LoadingOverlay visible={loading} overlayBlur={2} sx={{ position: 'fixed' }} />}
    </>
  );
};
export default Dashboard;
