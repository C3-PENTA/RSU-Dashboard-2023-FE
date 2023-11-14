import { useEffect, useState } from 'react';
import { Map, SummarySystemStatus } from './components';
import {
  IRsuData,
  ISummaryEventStatus,
  ISummarySystemStatus,
} from '@/interfaces/interfaceDashboard';
import {
  getEventStatusSummary,
  getRSUInformation,
  getSystemStatusSummary,
} from '@/services/DashboardAPI';
import { useLoading } from '@/LoadingContext';
import { Group, LoadingOverlay, createStyles } from '@mantine/core';
import { getAutoRefresh } from '@/services/HeaderAPI';
import { AUTO_REFRESH_TIME } from '@/constants';
import { forkJoin } from 'rxjs';
import SummaryEventStatus from './components/SummaryEventStatus';
import { notifications } from '@mantine/notifications';
import { CircleX } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  mainLayout: {
    position: 'relative',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '16px',
    flex: '1 0 0',
  },

  map: {
    height: '448px',
    borderRadius: theme.radius['2xl'],
  },

  chartLayout: {
    height: '50%',
    display: 'flex',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: '0 0 auto',
    flexWrap: 'wrap',
    gap: '16px 16px',
    padding: '16px 0px',
    position: 'relative',
    width: '100%',
  },
}));

const Dashboard = () => {
  const { classes, cx } = useStyles();
  const [rsuData, setRsuData] = useState<IRsuData[]>([]);
  const [eventStatusData, setEventStatusData] = useState<ISummaryEventStatus[]>([]);
  const [systemStatusData, setSystemStatusData] = useState<ISummarySystemStatus[]>([]);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getAutoRefresh().subscribe({
        next: ({ data }) => {
          data && getData();
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

    const rsuInformationObservable = getRSUInformation();
    const eventStatusSummaryObservable = getEventStatusSummary('hour_ago');
    const systemStatusSummaryObservable = getSystemStatusSummary();

    // Combining multiple observables and waiting for all of them to complete
    forkJoin([
      rsuInformationObservable,
      eventStatusSummaryObservable,
      systemStatusSummaryObservable,
    ]).subscribe({
      next: ([rsuInformationResponse, eventStatusSummaryResponse, systemStatusSummaryResponse]) => {
        setRsuData(rsuInformationResponse.data.nodes);
        setEventStatusData(eventStatusSummaryResponse.data.summary);
        setSystemStatusData(systemStatusSummaryResponse.data);
        setLoading(false); // Set loading to false after both requests complete
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      },
    });
  };

  return (
    <div className={cx(classes.mainLayout)}>
      {rsuData.length > 0 && <Map data={rsuData} />}
      {
        <Group className={cx(classes.chartLayout)}>
          <SummarySystemStatus data={systemStatusData} />
          <SummaryEventStatus data={eventStatusData} />
        </Group>
      }
      {loading && <LoadingOverlay visible={loading} overlayBlur={2} sx={{ position: 'fixed' }} />}
    </div>
  );
};
export default Dashboard;
