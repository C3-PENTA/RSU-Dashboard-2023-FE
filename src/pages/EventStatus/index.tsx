import { LoginContext } from '@/App';
import { NoData } from '@/components';
import { AUTO_REFRESH_TIME, EVENT_CLICK_NAME, EVENT_PAGE_QUOTE, NOTIFICATIONS } from '@/constants';
import { subscribe, unsubscribe } from '@/helper/event';
import { EventInfo, ListEventIds, MetaData } from '@/interfaces/interfaceListEvent';
import { useLoading } from '@/LoadingContext';
import { getAutoRefresh } from '@/services/HeaderAPI';
import {
  changeStatusGenerator,
  deleteEvent,
  downloadEvents,
  getEventStatus,
  getMetaData,
  getNewEvents,
  getStatusStartStop,
  uploadEvent,
} from '@/services/ListEventAPI';
import {
  Box,
  Button,
  createStyles,
  FileButton,
  Group,
  LoadingOverlay,
  NativeSelect,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { saveAs } from 'file-saver';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  CircleCheck,
  CircleX,
  Download,
  EraserOff,
  PlayerPlay,
  PlayerStop,
  Search,
  Upload,
  X,
} from 'tabler-icons-react';

import { AvailabilityTable, CommunicaitonTable, Filter, Modal, Pagination } from './components';
import CustomeLoader from '@/assets/icons/CustomeLoader';

const initEvent: EventInfo = {
  events: [],
  meta: {
    currentPage: '1',
    totalPages: 1,
    totalItems: 1,
    perPage: '1',
  },
};

const useStyles = createStyles((theme) => ({
  button: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: '16px',
    paddingBottom: '16px',
  },

  tab: {
    minWidth: '8rem',
    color: 'white',
    borderBottom: '0.125rem solid rgba(203, 213, 224, 1)',
    '&:hover': {
      backgroundColor: theme.colors.gray[5],
    },
    '&[aria-selected="true"]': {
      color: theme.colors.blue[4],
    },
  },

  rightButton: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },

  redButton: {
    backgroundColor: theme.colors.red[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.red[6],
    },
  },

  blueButton: {
    backgroundColor: theme.colors.blue[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.blue[6],
    },
  },

  greenButton: {
    backgroundColor: theme.colors.green[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.green[6],
    },
  },

  grayButton: {
    backgroundColor: theme.colors.gray[5],
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontStyle: 'normal',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: '20px',
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.gray[6],
    },
  },
}));

const initMetaData: MetaData = {
  nodeList: {
    nodeID: 'id',
  },
  eventStatus: {
    EVENT1: 1,
  },
  drivingNegotiationsClass: {
    NEGOTIATION1: 10,
  },
  networkStatus: {
    STATUS1: 100,
  },
  communicationMethod: {
    METHOD1: 1000,
  },
  messageType: {
    TYPE1: 10000,
  },
  nodeType: {
    TYPE_A: 100000,
  },
};

const EventStatus = () => {
  const [event, setEvent] = useState<EventInfo>(initEvent);
  const [metaData, setMetaData] = useState<MetaData>(initMetaData);
  const [loadedAPI, setLoadedAPI] = useState(false);
  const [type, setType] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const ref = useRef<HTMLSelectElement>(null);
  const [currentPageSizeAvailability, setCurrentPageSizeAvailability] = useState<number>(50);
  const [currentPageSizeComunication, setCurrentPageSizeComunication] = useState<number>(50);
  const [stDate, setStDate] = useState('');
  const [edDate, setEdDate] = useState('');
  const [nodeID, setNodeID] = useState('');
  const [isError, setIsError] = useState('');
  const [drivingNegotiation, setDrivingNegotiation] = useState('');
  const [messageType, setMessageType] = useState('');
  const [removeFilter, setRemoveFilter] = useState(true);
  const [listEvent, setListEvent] = useState<string[]>([]);
  const [order, setOrder] = useState('desc');
  const [listNode, setListNode] = useState(['']);
  const [isLoaded, setIsLoaded] = useState(false);
  const { loading, setLoading } = useLoading();
  const [isImporting, setIsImporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<boolean | null>(null);
  const [typeButton, setTypeButton] = useState<string | null>(null);
  const { setLoginState, currentUser } = useContext(LoginContext);
  const { classes, cx } = useStyles();
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const isImport = (e: any) => {
    setIsImporting(true);
    upLoad(e);
  };
  const upLoad = async (e: any) => {
    uploadEvent(e).subscribe({
      next: (response: any) => {
        getEvent();
        setIsImporting(false);
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
      },
      error: (err) => {
        setLoading(false);
        setLoadedAPI(true);
        setIsImporting(false);
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
  };

  const changeTypeButton = (typeButton: string) => {
    setTypeButton(typeButton);
  };

  useEffect(() => {
    getMetaDataEvent();
    getEvent();
    setIsLoaded(false);
  }, [type, currentPage, order, currentPageSizeAvailability, currentPageSizeComunication]);

  useEffect(() => {
    if (isLoaded) {
      setListNode(
        event.events
          .map((item: any) => item.nodeId)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort(),
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAutoRefresh().subscribe({
        next: ({ data }) => {
          data && getEvent();
          data
            ? getNewEvents(1).subscribe({
                next: ({ data }) => {
                  data.forEach((event, index) => {
                    setTimeout(() => {
                      notifications.show({
                        icon: <CircleX size="1rem" color="red" />,
                        autoClose: 3000,
                        color: 'red',
                        title: 'Error: ' + event.nodeId,
                        message: event.detail,
                      });
                    }, 200 * index);
                  });
                },
                error(err) {
                  console.log(err);
                },
              })
            : notifications.show({
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
  });

  useEffect(() => {
    subscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, getEvent);
    return () => {
      unsubscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, getEvent);
    };
  }, [currentPageSizeAvailability, currentPageSizeComunication]);

  const getStartStop = async () => {
    getStatusStartStop().subscribe({
      next: (response: any) => {
        if (response.data.status === 'OFF') {
          setStatus(true);
        } else {
          setStatus(false);
        }
      },
      error: () => {
        setLoading(false);
        setLoadedAPI(true);
      },
    });
  };
  const changeGeneratorStatus = async () => {
    changeStatusGenerator().subscribe({
      error: () => {
        setLoading(false);
        setLoadedAPI(true);
      },
    });
  };
  const deleteAllEvent = async () => {
    deleteEvent(type, 'true').subscribe({
      next: (response: any) => {
        getEvent();
      },
      error: () => {
        setLoading(false);
        setLoadedAPI(true);
      },
    });
  };

  useEffect(() => {
    getStartStop();
  }, [status]);

  const getEvent = async () => {
    setLoading(true);
    getEventStatus(
      type,
      currentPage,
      type === 1 ? currentPageSizeAvailability : currentPageSizeComunication,
      stDate,
      edDate,
      nodeID,
      isError,
      drivingNegotiation,
      messageType,
      order,
    ).subscribe({
      next: ({ data }) => {
        setEvent(data);
        setIsLoaded(true);
        setLoading(false);
        setLoadedAPI(true);
      },
      error: () => {
        setLoading(false);
        setLoadedAPI(true);
      },
    });
  };

  const handleDownload = async (log: boolean) => {
    const listInfo: ListEventIds = {
      type: type,
      eventIds: listEvent,
      log: log,
    };

    downloadEvents(listInfo).subscribe({
      next: (response: any) => {
        const blob = new Blob([response.data], { type: 'application/csv' });
        const filename = 'data.csv';
        saveAs(blob, filename);
      },
    });
  };

  const handleTypeChange = (value: string) => {
    if (value === 'Availability') {
      setType(1);
    } else {
      setType(2);
    }
    setCurrentPage(1);
    setStDate('');
    setEdDate('');
    setNodeID('');
    setIsError('');
    setDrivingNegotiation('');
    setMessageType('');
    setListEvent([]);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getEvent();
  };

  const handleStartStop = () => {
    changeTypeButton('startstop');
    toggle();
  };
  const handleUpload = () => {
    changeTypeButton('upload');
    toggle();
  };

  const handleRemoveFilter = () => {
    setRemoveFilter(!removeFilter);
  };

  const handleClearData = () => {
    changeTypeButton('clear');
    toggle();
  };
  const handleChangePageSizeAvailability = (value: string) => {
    setCurrentPageSizeAvailability(Number(value));
  };
  const handleChangePageSizeComunication = (value: string) => {
    setCurrentPageSizeComunication(Number(value));
  };

  const getMetaDataEvent = () => {
    getMetaData().subscribe({
      next: (data: any) => {
        setMetaData(data.data);
        setLoading(false);
      },
      error: () => {
        setLoading(false);
      },
    });
  };

  const handleButton = (isOpen: boolean, typeButton: string | null) => {
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
                    isImport(e);
                    toggle();
                  },
                  buttonType: 'upload',
                },
                { title: EVENT_PAGE_QUOTE.BUTTON_CANCEL, onPress: toggle, buttonType: 'cancel' },
              ]}
            ></Modal>
          );
        case 'startstop':
          return (
            <Modal
              onClose={toggle}
              typeBt={typeButton}
              isOpen={isOpen}
              header={EVENT_PAGE_QUOTE.WARNING}
              caption={status ? EVENT_PAGE_QUOTE.NOTICED_START : EVENT_PAGE_QUOTE.NOTICED_STOP}
              listButton={[
                {
                  title: EVENT_PAGE_QUOTE.BUTTON_CONTINUE,
                  onPress: () => {
                    changeGeneratorStatus();
                    setStatus(!status);
                    toggle();
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
                    deleteAllEvent();
                    toggle();
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
    <Box p={'16px'} sx={{ height: 'auto', borderRadius: 8 }}>
      <Tabs defaultValue="Availability" pt={'16px'}>
        <Tabs.List position="apart" sx={{ borderBottom: 'none' }}>
          <Group position="left" spacing={0}>
            <Tabs.Tab
              value="Availability"
              onClick={() => handleTypeChange('Availability')}
              className={cx(classes.tab)}
            >
              <Text>가용성</Text>
            </Tabs.Tab>
            <Tabs.Tab
              value="Communication"
              onClick={() => handleTypeChange('Communication')}
              className={cx(classes.tab)}
            >
              <Text>통신</Text>
            </Tabs.Tab>
          </Group>
        </Tabs.List>
        <Tabs.Panel value="Availability">
          <Filter
            listNode={listNode}
            type={1}
            removeFilter={removeFilter}
            setStDate={(newValue) => setStDate(newValue)}
            setEdDate={(newValue) => setEdDate(newValue)}
            setNodeID={(newValue) => setNodeID(newValue)}
            setDriving={(newValue) => setDrivingNegotiation(newValue)}
            setMessage={(newValue) => setMessageType(newValue)}
            setIsError={(newValue) => setIsError(newValue)}
            metaData={metaData}
          />
          <Group className={cx(classes.button)}>
            <Group>
              <Button
                leftIcon={<X size={14} strokeWidth={3} color={'white'} />}
                onClick={handleRemoveFilter}
                className={cx(classes.redButton)}
              >
                초기화
              </Button>
              <Button
                leftIcon={<Search size={14} strokeWidth={3} color={'white'} />}
                onClick={handleSearch}
                className={cx(classes.blueButton)}
              >
                검색
              </Button>
              <Group>
                <Title fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'} pt={'2px'}>
                  {EVENT_PAGE_QUOTE.PAGE_SIZE_KOR}
                </Title>
                <NativeSelect
                  data={['10', '20', '50']}
                  defaultValue={'50'}
                  ref={ref}
                  color="white"
                  onChange={(event) => handleChangePageSizeAvailability(event.currentTarget.value)}
                />
              </Group>
            </Group>
            <Group>
              <Button
                className={cx(classes.greenButton)}
                leftIcon={<Download size={14} strokeWidth={3} color={'white'} />}
                onClick={() => {
                  if (listEvent.length > 0) {
                    handleDownload(true);
                  } else {
                    notifications.show({
                      icon: <CircleX size="1rem" color="red" />,
                      autoClose: 2000,
                      color: 'red',
                      title: NOTIFICATIONS.NOTICED_KOR,
                      message: NOTIFICATIONS.NOTICED__MESS_KOR,
                    });
                  }
                }}
              >
                로그 내보내기
              </Button>
              {currentUser.username === 'root' ? (
                <>
                  <Button
                    className={cx(classes.greenButton)}
                    leftIcon={<Download size={14} strokeWidth={3} color={'white'} />}
                    onClick={() => {
                      if (listEvent.length > 0) {
                        handleDownload(false);
                      } else {
                        notifications.show({
                          icon: <CircleX size="1rem" color="red" />,
                          autoClose: 2000,
                          color: 'red',
                          title: NOTIFICATIONS.NOTICED_KOR,
                          message: NOTIFICATIONS.NOTICED__MESS_KOR,
                        });
                      }
                    }}
                  >
                    내보내기
                  </Button>
                  {status ? (
                    <FileButton onChange={isImport} accept=".csv">
                      {(props) => (
                        <Button
                          leftIcon={<Upload size={14} strokeWidth={3} color={'white'} />}
                          className={cx(classes.greenButton)}
                          {...props}
                        >
                          {EVENT_PAGE_QUOTE.BUTTON_UPLOAD}
                        </Button>
                      )}
                    </FileButton>
                  ) : (
                    <Button
                      leftIcon={<Upload size={14} strokeWidth={3} color={'white'} />}
                      className={cx(classes.greenButton)}
                      onClick={handleUpload}
                    >
                      {EVENT_PAGE_QUOTE.BUTTON_UPLOAD}
                    </Button>
                  )}
                  <Button
                    leftIcon={
                      status ? (
                        <PlayerPlay size={14} strokeWidth={3} color={'white'} />
                      ) : (
                        <PlayerStop size={14} strokeWidth={3} color={'white'} />
                      )
                    }
                    className={status ? cx(classes.greenButton) : cx(classes.redButton)}
                    onClick={handleStartStop}
                  >
                    {status ? EVENT_PAGE_QUOTE.BUTTON_START : EVENT_PAGE_QUOTE.BUTTON_STOP}
                  </Button>
                  <Button
                    leftIcon={<EraserOff size={14} strokeWidth={3} color={'white'} />}
                    className={cx(classes.grayButton)}
                    onClick={handleClearData}
                  >
                    {EVENT_PAGE_QUOTE.BUTTON_CLEAR_DATA}
                  </Button>
                </>
              ) : null}
            </Group>
          </Group>
          <AvailabilityTable
            type={type}
            setOrder={(newValue) => setOrder(newValue)}
            setListEvent={(newValue) => setListEvent(newValue)}
            currentPage={currentPage}
            items={event.events}
          />
        </Tabs.Panel>
        <Tabs.Panel value="Communication" pt={'xs'}>
          <Filter
            listNode={listNode}
            type={type}
            removeFilter={removeFilter}
            setStDate={(newValue) => setStDate(newValue)}
            setEdDate={(newValue) => setEdDate(newValue)}
            setNodeID={(newValue) => setNodeID(newValue)}
            setDriving={(newValue) => setDrivingNegotiation(newValue)}
            setMessage={(newValue) => setMessageType(newValue)}
            setIsError={(newValue) => setIsError(newValue)}
            metaData={metaData}
          />
          <Group className={cx(classes.button)}>
            <Group>
              <Button
                leftIcon={<X size={14} strokeWidth={3} color={'white'} />}
                onClick={handleRemoveFilter}
                className={cx(classes.redButton)}
              >
                초기화
              </Button>
              <Button
                leftIcon={<Search size={14} strokeWidth={3} color={'white'} />}
                onClick={handleSearch}
                className={cx(classes.blueButton)}
              >
                검색
              </Button>
              <Group>
                <Title fw={500} fz={'14px'} lts={'0.6px'} lh={'16px'} pt={'2px'}>
                  {EVENT_PAGE_QUOTE.PAGE_SIZE_KOR}
                </Title>
                <NativeSelect
                  data={['10', '20', '50']}
                  defaultValue={'50'}
                  ref={ref}
                  color="white"
                  onChange={(event) => handleChangePageSizeComunication(event.currentTarget.value)}
                />
              </Group>
            </Group>
            <Group>
              <Button
                className={cx(classes.greenButton)}
                leftIcon={<Download size={14} strokeWidth={3} color={'white'} />}
                onClick={() => {
                  if (listEvent.length > 0) {
                    handleDownload(true);
                  } else {
                    notifications.show({
                      icon: <CircleX size="1rem" color="red" />,
                      autoClose: 2000,
                      color: 'red',
                      title: NOTIFICATIONS.NOTICED_KOR,
                      message: NOTIFICATIONS.NOTICED__MESS_KOR,
                    });
                  }
                }}
              >
                로그 내보내기
              </Button>
              {currentUser.username === 'root' ? (
                <>
                  <Button
                    className={cx(classes.greenButton)}
                    leftIcon={<Download size={14} strokeWidth={3} color={'white'} />}
                    onClick={() => {
                      if (listEvent.length > 0) {
                        handleDownload(false);
                      } else {
                        notifications.show({
                          icon: <CircleX size="1rem" color="red" />,
                          autoClose: 2000,
                          color: 'red',
                          title: NOTIFICATIONS.NOTICED_KOR,
                          message: NOTIFICATIONS.NOTICED__MESS_KOR,
                        });
                      }
                    }}
                  >
                    내보내기
                  </Button>
                  {status ? (
                    <FileButton onChange={isImport} accept=".csv">
                      {(props) => (
                        <Button
                          leftIcon={<Upload size={14} strokeWidth={3} color={'white'} />}
                          className={cx(classes.greenButton)}
                          {...props}
                        >
                          {EVENT_PAGE_QUOTE.BUTTON_UPLOAD}
                        </Button>
                      )}
                    </FileButton>
                  ) : (
                    <Button
                      leftIcon={<Upload size={14} strokeWidth={3} color={'white'} />}
                      className={cx(classes.greenButton)}
                      onClick={handleUpload}
                    >
                      {EVENT_PAGE_QUOTE.BUTTON_UPLOAD}
                    </Button>
                  )}
                  <Button
                    leftIcon={
                      status ? (
                        <PlayerPlay size={14} strokeWidth={3} color={'white'} />
                      ) : (
                        <PlayerStop size={14} strokeWidth={3} color={'white'} />
                      )
                    }
                    className={status ? cx(classes.greenButton) : cx(classes.redButton)}
                    onClick={handleStartStop}
                  >
                    {status ? EVENT_PAGE_QUOTE.BUTTON_START : EVENT_PAGE_QUOTE.BUTTON_STOP}
                  </Button>
                  <Button
                    leftIcon={<EraserOff size={18} strokeWidth={2} color={'white'} />}
                    className={cx(classes.grayButton)}
                    onClick={handleClearData}
                  >
                    {EVENT_PAGE_QUOTE.BUTTON_CLEAR_DATA}
                  </Button>
                </>
              ) : null}
            </Group>
          </Group>
          <CommunicaitonTable
            type={type}
            setOrder={(newValue) => setOrder(newValue)}
            setListEvent={(newValue) => setListEvent(newValue)}
            currentPage={currentPage}
            items={event.events}
          />
        </Tabs.Panel>
      </Tabs>
      {event.events.length > 0 ? (
        <Pagination
          totalPage={event.meta.totalPages}
          currentPage={currentPage}
          setCurrentPage={(value) => setCurrentPage(value)}
        />
      ) : (
        loadedAPI && <NoData />
      )}
      <LoadingOverlay visible={loading} overlayBlur={2} sx={{ position: 'fixed' }} />
      <LoadingOverlay
        visible={isImporting}
        loader={<CustomeLoader title="Data Importing..." />}
        overlayBlur={2}
        sx={{ position: 'fixed' }}
      />
      {handleButton(isOpen, typeButton)}
    </Box>
  );
};
export default EventStatus;
