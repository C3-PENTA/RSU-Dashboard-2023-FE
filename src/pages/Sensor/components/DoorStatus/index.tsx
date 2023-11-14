import { useEffect, useState } from 'react';
import { IEvent, MetaData } from '@/interfaces/interfaceListEvent';
import { getEventStatus, getSensorEvent } from '@/services/ListEventAPI';
import { AxiosResponse } from 'axios';
import { AUTO_REFRESH_TIME, EVENT_PAGE_QUOTE } from '@/constants';
import { notifications } from '@mantine/notifications';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import Pagination from '../Pagination';
import { NoData } from '@/components';
import { LoadingOverlay } from '@mantine/core';
import CustomeLoader from '@/assets/icons/CustomeLoader';
import { useLoading } from '@/LoadingContext';
import DoorStatusTable from './DoorStatusTable';
import { getAutoRefresh } from '@/services/HeaderAPI';

export interface IDoorStatusData {
  id: string;
  status: string;
  timestamp: string;
}

const InitDoorStatusData = [
  {
    id: '',
    status: '',
    timestamp: '',
  },
];

const DoorStatus = () => {
  const { loading, setLoading } = useLoading();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [order, setOrder] = useState<string>('desc');
  const [eventData, setEventData] = useState<IDoorStatusData[]>(InitDoorStatusData);

  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [listEvent, setListEvent] = useState<string[]>(['']);

  const getEventData = () => {
    setLoading(true);
    setApiLoaded(false);

    const param: any = {
      page: currentPage,
      limit: currentPageSize,
      order: order,
    };

    getSensorEvent(param).subscribe({
      next: (response: AxiosResponse) => {
        setEventData(response?.data?.events);
        setTotalPages(response?.data?.meta?.totalPages);
        setApiLoaded(true);
        setLoading(false);
      },
      error: (err) => {
        setApiLoaded(true);
        setLoading(false);
        return err;
      },
    });
  };

  useEffect(() => {
    getEventData();
  }, [currentPage, currentPageSize, order]);

  // auto refresh
  useEffect(() => {
    const interval = setInterval(() => {
      getAutoRefresh().subscribe({
        next: ({ data }) => {
          data && getEventData();
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

    document.addEventListener('refreshClick', getEventData);

    return () => {
      clearInterval(interval);
      document.removeEventListener('refreshClick', getEventData);
    };
  }, []);

  return (
    <>
      <DoorStatusTable
        currentPage={currentPage}
        eventData={eventData}
        setOrder={setOrder}
        setListEvent={setListEvent}
      />
      {eventData.length > 0 ? (
        <Pagination
          totalPage={totalPages}
          currentPage={currentPage}
          setCurrentPage={(value) => setCurrentPage(value)}
        />
      ) : (
        apiLoaded && <NoData />
      )}
      <LoadingOverlay visible={loading} overlayBlur={2} sx={{ position: 'fixed' }} />
    </>
  );
};

export default DoorStatus;
