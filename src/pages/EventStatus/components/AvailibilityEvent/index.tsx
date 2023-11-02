import { useEffect, useState } from 'react';
import AvailabilityPanel from './Panel';
import { IEvent, MetaData } from '@/interfaces/interfaceListEvent';
import { deleteEvent, getEvent, uploadEvent } from '@/services/ListEventAPI';
import { AxiosResponse } from 'axios';
import AvailabilityTable from './AvailabilityTable';
import AvailabilityButton from './Button';
import Modal from '../Modal';
import { EVENT_PAGE_QUOTE } from '@/constants';
import { notifications } from '@mantine/notifications';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import Pagination from '../Pagination';
import { NoData } from '@/components';
import { LoadingOverlay } from '@mantine/core';
import CustomeLoader from '@/assets/icons/CustomeLoader';
import { useLoading } from '@/LoadingContext';

interface AvailabilityEventProps {
  metaData: MetaData;
  reloadFlag: boolean;
}

export interface IAvailabilityEventData {
  id: string;
  nodeId: string;
  nodeType: string;
  detail: string;
  createdAt: string;
  cpuUsage: number;
  cpuTemp: number;
  ramUsage: number;
  diskUsage: number;
  networkSpeed: string;
  networkUsage: string;
  networkStatus: string;
}

const InitEventData = [
  {
    id: '',
    nodeId: '',
    nodeType: '',
    detail: '',
    createdAt: '',
    cpuUsage: 0,
    cpuTemp: 0,
    ramUsage: 0,
    diskUsage: 0,
    networkSpeed: '',
    networkUsage: '',
    networkStatus: '',
  },
];

const AvailabilityEvent = (props: AvailabilityEventProps) => {
  const { metaData, reloadFlag } = props;
  const { loading, setLoading } = useLoading();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nodeId, setNodeID] = useState<string>('');
  const [status, setStatus] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [order, setOrder] = useState<string>('desc');
  const [eventData, setEventData] = useState<IAvailabilityEventData[]>(InitEventData);

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
      status: status,
      drivingNegotiation: '',
      messageType: '',
      order: order,
    };
    getEvent(param).subscribe({
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

  const handleModal = (isOpen: boolean, typeButton: string | null) => {
    if (isOpen) {
      switch (typeButton) {
        case 'upload':
          return (
            <Modal
              onClose={toggle}
              typeBt={typeButton}
              isOpen={isOpen}
              header={EVENT_PAGE_QUOTE.WARNING}
              caption={EVENT_PAGE_QUOTE.NOTICED_UPLOAD}
              listButton={[
                {
                  title: EVENT_PAGE_QUOTE.BUTTON_UPLOAD,
                  onPress: (e: any) => {
                    uploadEvent(e).subscribe({
                      next: (response: any) => {
                        response.data.status === 'success'
                          ? notifications.show({
                              icon: <CircleCheck size="1rem" color="green" />,
                              autoClose: 2000,
                              color: 'green',
                              title: 'File Import Successful',
                              message: response.data.message,
                            })
                          : notifications.show({
                              icon: <CircleX size="1rem" color="red" />,
                              autoClose: 3000,
                              color: 'red',
                              title: 'Import File Unsuccessful',
                              message: response.data.message,
                            });
                        // getEventAPI();
                        setModalLoad(!modalLoad);
                      },
                      error: (err) => {
                        err.status === 'error' &&
                          notifications.show({
                            icon: <CircleX size="1rem" color="red" />,
                            autoClose: 3000,
                            color: 'red',
                            title: 'Import File Unsuccessful',
                            message: err.message,
                          });
                      },
                    });
                    toggle();
                  },
                  buttonType: 'upload',
                },
                { title: EVENT_PAGE_QUOTE.BUTTON_CANCEL, onPress: toggle, buttonType: 'cancel' },
              ]}
            ></Modal>
          );
        // case 'startstop':
        //   return (
        //     <Modal
        //       onClose={toggle}
        //       typeBt={typeButton}
        //       isOpen={isOpen}
        //       header={EVENT_PAGE_QUOTE.WARNING}
        //       caption={status ? EVENT_PAGE_QUOTE.NOTICED_START : EVENT_PAGE_QUOTE.NOTICED_STOP}
        //       listButton={[
        //         {
        //           title: EVENT_PAGE_QUOTE.BUTTON_CONTINUE,
        //           onPress: () => {
        //             changeGeneratorStatus();
        //             setStatus(!status);
        //             toggle();
        //           },
        //           buttonType: 'continue',
        //         },
        //         {
        //           title: EVENT_PAGE_QUOTE.BUTTON_CANCEL,
        //           onPress: () => {
        //             toggle();
        //           },
        //           buttonType: 'cancel',
        //         },
        //       ]}
        //     ></Modal>
        //   );
        case 'clear':
          return (
            <Modal
              onClose={toggle}
              typeBt={typeButton}
              isOpen={isOpen}
              header={EVENT_PAGE_QUOTE.WARNING}
              caption={EVENT_PAGE_QUOTE.NOTICED_CLEAR_DATA}
              listButton={[
                {
                  title: EVENT_PAGE_QUOTE.BUTTON_CONTINUE,
                  onPress: () => {
                    deleteEvent(1, 'true');
                    toggle();
                    setModalLoad(!modalLoad);
                    // getEventAPI();
                  },
                  buttonType: 'continue',
                },
                {
                  title: EVENT_PAGE_QUOTE.BUTTON_CANCEL,
                  onPress: () => {
                    toggle();
                  },
                  buttonType: 'cancel',
                },
              ]}
            ></Modal>
          );

        default:
          return null;
      }
    }
  };
  return (
    <>
      {handleModal(isOpen, buttonType)}
      <AvailabilityPanel
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        setNodeId={setNodeID}
        setStatus={setStatus}
        metaData={metaData}
        removeFlag={removeFlag}
      />
      <AvailabilityButton
        removeFlag={removeFlag}
        setRemoveFlag={setRemoveFlag}
        searchFlag={searchFlag}
        setSearchFlag={setSearchFlag}
        setCurrentPageSize={setCurrentPageSize}
        setCurrentPage={setCurrentPage}
        listEvent={listEvent}
        setButtontype={setButtonType}
        setIsOpen={setIsOpen}
      />
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
      <LoadingOverlay
        visible={loading}
        loader={<CustomeLoader title="Data Importing..." />}
        overlayBlur={2}
        sx={{ position: 'fixed' }}
      />
    </>
  );
};

export default AvailabilityEvent;
