import { IEvent, MetaData } from '@/interfaces/interfaceListEvent';
import CommunicationPanel from './Panel';
import { useEffect, useState } from 'react';
import CommunicationButton from './Button';
import { deleteEvent, getEvent, uploadEvent } from '@/services/ListEventAPI';
import { AxiosResponse } from 'axios';
import { useLoading } from '@/LoadingContext';
import CommunicationTable from './CommunicationTable';
import Modal from '../Modal';
import { EVENT_PAGE_QUOTE } from '@/constants';
import { notifications } from '@mantine/notifications';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import Pagination from '../Pagination';
import { NoData } from '@/components';
import { LoadingOverlay } from '@mantine/core';
import CustomeLoader from '@/assets/icons/CustomeLoader';

interface CommunicationEventProps {
  metaData: MetaData;
  reloadFlag: boolean;
}

export interface ICommunicationEventData {
  communicationClass: string;
  cooperationClass: string;
  createdAt: string;
  destNode: string;
  detail: string;
  id: string;
  messageType: string;
  method: string;
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
    method: '',
    nodeId: '',
    nodeType: '',
    sessionID: '',
    srcNode: '',
  },
];

const CommunicationEvent = (props: CommunicationEventProps) => {
  const { metaData, reloadFlag } = props;
  const { loading, setLoading } = useLoading();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nodeId, setNodeID] = useState<string>('');
  const [status, setStatus] = useState<number>(1);
  const [drivingNegotiationsClass, setDrivingNegotiationsClass] = useState<string>('');
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

  const getEventAPI = () => {
    setLoading(true);
    setApiLoaded(false);

    const param: IEvent = {
      type: 2,
      page: currentPage,
      limit: currentPageSize,
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
      nodeID: nodeId ? nodeId : '',
      status: status,
      drivingNegotiation: drivingNegotiationsClass,
      messageType: messageType,
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
        setDrivingNeotiationsClass={setDrivingNegotiationsClass}
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
        setButtontype={setButtonType}
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
