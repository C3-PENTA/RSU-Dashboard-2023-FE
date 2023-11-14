import { AUTO_REFRESH_TIME, EVENT_CLICK_NAME, EVENT_PAGE_QUOTE, NOTIFICATIONS } from '@/constants';
import { subscribe, unsubscribe } from '@/helper/event';
import { MetaData } from '@/interfaces/interfaceListEvent';
import { useLoading } from '@/LoadingContext';
import { getAutoRefresh } from '@/services/HeaderAPI';
import { Box, createStyles, Group, Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CommunicationEvent } from './components';
import AvailabilityEvent from './components/AvailabilityEvent';
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

const EventStatus = () => {
  const { classes, cx } = useStyles();
  // const [metaData, setMetaData] = useState<MetaData>(initMetaData);
  // const [availabilityReload, setAvailabilityReload] = useState<boolean>(false);
  // const [communicationReload, setCommunicationReload] = useState<boolean>(false);
  const [type, setType] = useState<number>(1);

  // useEffect(() => {
  //   getMetaDataEvent();
  // }, []);

  // const eventRefresh = () => {
  //   if (type === 'Availability') {
  //     setAvailabilityReload(!availabilityReload);
  //   } else {
  //     setCommunicationReload(!communicationReload);
  //   }
  // };

  // useEffect(() => {
  //   subscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, eventRefresh);
  //   return () => {
  //     unsubscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, eventRefresh);
  //   };
  // }, [type, availabilityReload, communicationReload]);

  const handleTypeChange = (value: number) => {
    if (value === 1) {
      // setAvailabilityReload(!availabilityReload);
      setType(1);
    } else {
      // setCommunicationReload(!communicationReload);
      setType(2);
    }
  };

  // const getMetaDataEvent = () => {
  //   getMetaData().subscribe({
  //     next: (data: any) => {
  //       setMetaData(data.data);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // };

  // console.log(availabilityReload);
  // console.log(communicationReload);
  return (
    <Box p={'16px'} sx={{ height: 'auto', borderRadius: 8 }}>
      <Tabs defaultValue="Availability" pt={'16px'}>
        <Tabs.List position="apart" sx={{ borderBottom: 'none' }}>
          <Group position="left" spacing={0}>
            <Tabs.Tab
              value="Availability"
              onClick={() => handleTypeChange(1)}
              className={cx(classes.tab)}
            >
              <Text>가용성</Text>
            </Tabs.Tab>
            <Tabs.Tab
              value="Communication"
              onClick={() => handleTypeChange(2)}
              className={cx(classes.tab)}
            >
              <Text>통신</Text>
            </Tabs.Tab>
          </Group>
        </Tabs.List>
        <Tabs.Panel value="Availability">
          <AvailabilityEvent reloadFlag={type} />
        </Tabs.Panel>
        <Tabs.Panel value="Communication" pt={'xs'}>
          <CommunicationEvent reloadFlag={type} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
export default EventStatus;
