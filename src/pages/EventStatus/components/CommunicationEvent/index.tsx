import { IEvent, MetaData } from '@/interfaces/interfaceListEvent';
import CommunicationPanel from './Panel';
import { useEffect, useState } from 'react';
import CommunicationButton from './Button';
import {
  deleteEvent,
  getEvent,
  getEventStatus,
  getMetaData,
  uploadEvent,
} from '@/services/ListEventAPI';
import { AxiosResponse } from 'axios';
import { useLoading } from '@/LoadingContext';
import CommunicationTable from './CommunicationTable';
import Modal from '../Modal';
import { AUTO_REFRESH_TIME, EVENT_PAGE_QUOTE } from '@/constants';
import { notifications } from '@mantine/notifications';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import Pagination from '../Pagination';
import { NoData } from '@/components';
import { LoadingOverlay } from '@mantine/core';
import CustomeLoader from '@/assets/icons/CustomeLoader';
import { forkJoin } from 'rxjs';
import { getAutoRefresh } from '@/services/HeaderAPI';

interface CommunicationEventProps {
  // metaData: MetaData;
  reloadFlag: number;
}

export interface ICommunicationEventData {
  communicationClass: string;
  cooperationClass: string;
  createdAt: string;
  destNode: string;
  detail: string;
  id: string;
  messageType: string;
  communicationMethod: string;
  nodeId: string;
  nodeType: string;
  sessionID: string;
  srcNode: string;
}

const initCommunicationEventData = [
  {
    communicationClass: '',
    cooperationClass: '',
    createdAt: '',
    destNode: '',
    detail: '',
    id: '',
    messageType: '',
    communicationMethod: '',
    nodeId: '',
    nodeType: '',
    sessionID: '',
    srcNode: '',
  },
];

const initMetaData: MetaData = {
  nodeList: {
    nodeID: 'id',
  },
  eventStatus: {
    status: 1,
  },
  cooperationClass: {
    class: '-',
  },
  communicationClass: {
    class: '-',
  },
  networkStatus: {
    status: 0,
  },
  communicationMethod: {
    method: '-',
  },
  sessionID: {
    session: '-',
  },
  messageType: {
    type: '-',
  },
  nodeType: {
    type: '-',
  },
};

const CommunicationEvent = (props: CommunicationEventProps) => {
  const { reloadFlag } = props;
  const { loading, setLoading } = useLoading();
  const [metaData, setMetaData] = useState<MetaData>(initMetaData);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nodeId, setNodeID] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [cooperationClass, setCooperationClass] = useState<string>('');
  const [sessionID, setSessionID] = useState<string>('');
  const [communicationClass, setCommunicationClass] = useState<string>('');
  const [communicationMethod, setCommunicationMethod] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('');
  const [order, setOrder] = useState<string>('desc');
  const [eventData, setEventData] = useState<ICommunicationEventData[]>(initCommunicationEventData);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [searchFlag, setSearchFlag] = useState<boolean>(false);
  const [removeFlag, setRemoveFlag] = useState<boolean>(false);
  const [listEvent, setListEvent] = useState<string[]>([]);

  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [buttonType, setButtonType] = useState<string | null>(null);
  const [modalLoad, setModalLoad] = useState<boolean>(false);

  const getEventData = () => {
    const eventParams: IEvent = {
      type: 2,
      page: currentPage,
      limit: currentPageSize,
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
      nodeID: nodeId ? nodeId : '',
      status: status,
      cooperationClass: cooperationClass,
      communicationClass: communicationClass,
      communicationMethod: communicationMethod,
      sessionID: sessionID,
      messageType: messageType,
      order: order,
    };

    setLoading(true);
    setApiLoaded(false);

    const metaDataObservable = getMetaData();
    const commEventObservable = getEventStatus(eventParams);

    forkJoin([metaDataObservable, commEventObservable]).subscribe({
      next: ([metaDataResponse, commEventResponse]) => {
        setMetaData(metaDataResponse.data);
        setEventData(commEventResponse?.data?.events);
        setTotalPages(commEventResponse?.data?.meta?.totalPages);
        setApiLoaded(true);
        setLoading(false); // Set loading to false after both requests complete
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        setApiLoaded(true);
        setLoading(false); // Set loading to false in case of an error
      },
    });
  };

  // reload when search, change page, upload
  useEffect(() => {
    reloadFlag === 2 && getEventData();
  }, [currentPage, currentPageSize, searchFlag, order, reloadFlag, modalLoad]);

  // auto refresh
  useEffect(() => {
    if (reloadFlag === 2) {
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
    }
  }, [reloadFlag]);

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
                    deleteEvent(2, 'true');
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
      <CommunicationPanel
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setNodeId={setNodeID}
        setStatus={setStatus}
        metaData={metaData}
        setCooperationClass={setCooperationClass}
        setSessionID={setSessionID}
        setCommunicationClass={setCommunicationClass}
        setCommunicationMethod={setCommunicationMethod}
        setMessageType={setMessageType}
        removeFlag={removeFlag}
      />
      <CommunicationButton
        setCurrentPageSize={setCurrentPageSize}
        removeFlag={removeFlag}
        setRemoveFlag={setRemoveFlag}
        searchFlag={searchFlag}
        setSearchFlag={setSearchFlag}
        setCurrentPage={setCurrentPage}
        listEvent={listEvent}
        setButtonType={setButtonType}
        setIsOpen={setIsOpen}
      />
      <CommunicationTable
        currentPage={currentPage}
        setListEvent={setListEvent}
        eventData={eventData}
        setOrder={setOrder}
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

export default CommunicationEvent;
