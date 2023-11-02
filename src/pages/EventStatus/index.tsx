import { AUTO_REFRESH_TIME, EVENT_CLICK_NAME, EVENT_PAGE_QUOTE, NOTIFICATIONS } from '@/constants';
import { subscribe, unsubscribe } from '@/helper/event';
import { MetaData } from '@/interfaces/interfaceListEvent';
import { useLoading } from '@/LoadingContext';
import { getAutoRefresh } from '@/services/HeaderAPI';
import { Box, createStyles, Group, Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CommunicationEvent } from './components';
import AvailabilityEvent from './components/AvailibilityEvent';
import { getMetaData } from '@/services/ListEventAPI';

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
  const [metaData, setMetaData] = useState<MetaData>(initMetaData);
  const { classes, cx } = useStyles();
  const [availabilityReload, setAvailabilityReload] = useState<boolean>(false);
  const [communicationReload, setCommunicationReload] = useState<boolean>(false);

  useEffect(() => {
    getMetaDataEvent();
  }, [availabilityReload, communicationReload]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getAutoRefresh().subscribe({
  //       next: ({ data }) => {
  //         data && getEvent();
  //         data
  //           ? getNewEvents(1).subscribe({
  //               next: ({ data }) => {
  //                 data.forEach((event, index) => {
  //                   setTimeout(() => {
  //                     notifications.show({
  //                       icon: <CircleX size="1rem" color="red" />,
  //                       autoClose: 3000,
  //                       color: 'red',
  //                       title: 'Error: ' + event.nodeId,
  //                       message: event.detail,
  //                     });
  //                   }, 200 * index);
  //                 });
  //               },
  //               error(err) {
  //                 console.log(err);
  //               },
  //             })
  //           : notifications.show({
  //               icon: <CircleX size="1rem" color="red" />,
  //               autoClose: 3500,
  //               color: 'red',
  //               title: 'Maintaining',
  //               message: 'Auto refresh is off',
  //             });
  //       },
  //       error(err) {
  //         console.log(err);
  //       },
  //     });
  //   }, AUTO_REFRESH_TIME * 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

  useEffect(() => {
    subscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, getMetaDataEvent);
    return () => {
      unsubscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, getMetaDataEvent);
    };
  }, []);

  // const getStartStop = async () => {
  //   getStatusStartStop().subscribe({
  //     next: (response: any) => {
  //       if (response.data.status === 'OFF') {
  //         setStatus(true);
  //       } else {
  //         setStatus(false);
  //       }
  //     },
  //     error: () => {
  //       setLoading(false);
  //       setLoadedAPI(true);
  //     },
  //   });
  // };

  // useEffect(() => {
  //   getStartStop();
  // }, [status]);

  const handleTypeChange = (value: string) => {
    if (value === 'Availability') {
      setAvailabilityReload(!availabilityReload);
    } else {
      setCommunicationReload(!communicationReload);
    }
  };

  const getMetaDataEvent = () => {
    getMetaData().subscribe({
      next: (data: any) => {
        setMetaData(data.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
          <AvailabilityEvent metaData={metaData} reloadFlag={availabilityReload} />
        </Tabs.Panel>
        <Tabs.Panel value="Communication" pt={'xs'}>
          <CommunicationEvent metaData={metaData} reloadFlag={communicationReload} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
export default EventStatus;
