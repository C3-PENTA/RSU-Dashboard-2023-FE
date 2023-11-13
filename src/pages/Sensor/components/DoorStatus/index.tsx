import { useEffect, useState } from 'react';
import { IEvent, MetaData } from '@/interfaces/interfaceListEvent';
import { getEventStatus, getSensorEvent } from '@/services/ListEventAPI';
import { AxiosResponse } from 'axios';
import AvailabilityTable from './DoorStatusTable';
import { EVENT_PAGE_QUOTE } from '@/constants';
import { notifications } from '@mantine/notifications';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import Pagination from '../Pagination';
import { NoData } from '@/components';
import { LoadingOverlay } from '@mantine/core';
import CustomeLoader from '@/assets/icons/CustomeLoader';
import { useLoading } from '@/LoadingContext';

interface AvailabilityEventProps {
  reloadFlag: boolean;
}

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

const DoorStatus = (props: AvailabilityEventProps) => {
  const { reloadFlag } = props;
  const { loading, setLoading } = useLoading();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nodeId, setNodeID] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [order, setOrder] = useState<string>('desc');
  const [eventData, setEventData] = useState<IDoorStatusData[]>(InitDoorStatusData);

  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [searchFlag, setSearchFlag] = useState<boolean>(false);
  const [removeFlag, setRemoveFlag] = useState<boolean>(false);
  const [listEvent, setListEvent] = useState<string[]>(['']);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [buttonType, setButtonType] = useState<string | null>(null);
  const [modalLoad, setModalLoad] = useState<boolean>(false);

  const getEventAPI = () => {
    setLoading(true);
    setApiLoaded(false);

    const param: IEvent = {
      type: 1,
      page: currentPage,
      limit: currentPageSize,
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
      nodeID: nodeId ? nodeId : '',
      status: status ? status : '',
      order: order,
    };

    getSensorEvent(param).subscribe({
      next: (response: AxiosResponse) => {
        setEventData(response?.data?.events);
        setTotalPages(response?.data?.meta?.totalPages);
      },
      error: (err) => {
        return err;
      },
    });

    setApiLoaded(true);
    setLoading(false);
  };

  useEffect(() => {
    getEventAPI();
  }, [currentPage, currentPageSize, searchFlag, order, reloadFlag, modalLoad]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AvailabilityTable
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
