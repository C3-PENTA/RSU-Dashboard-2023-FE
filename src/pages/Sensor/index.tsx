import { AUTO_REFRESH_TIME, EVENT_CLICK_NAME, EVENT_PAGE_QUOTE, NOTIFICATIONS } from '@/constants';
import { subscribe, unsubscribe } from '@/helper/event';
import { MetaData } from '@/interfaces/interfaceListEvent';
import { useLoading } from '@/LoadingContext';
import { getAutoRefresh } from '@/services/HeaderAPI';
import { Box, createStyles, Group, Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getMetaData } from '@/services/ListEventAPI';
import { DoorStatus } from './components';

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

const Sensor = () => {
  const { classes, cx } = useStyles();
  const [doorStatusReload, setDoorStatusReload] = useState<boolean>(false);
  // const [communicationReload, setCommunicationReload] = useState<boolean>(false);
  const [type, setType] = useState<string>('DoorStatus');

  const eventRefresh = () => {
    if (type === 'DoorStatus') {
      setDoorStatusReload(!doorStatusReload);
    }
  };

  useEffect(() => {
    subscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, eventRefresh);
    return () => {
      unsubscribe(EVENT_CLICK_NAME.REFRESH_BUTTON, eventRefresh);
    };
  }, [type, doorStatusReload]);

  const handleTypeChange = (value: string) => {
    if (value === 'DoorStatus') {
      setDoorStatusReload(!doorStatusReload);
      setType('DoorStatus');
    }
    // else {
    //   setCommunicationReload(!communicationReload);
    //   setType('Communication');
    // }
  };

  return (
    <Box p={'16px'} sx={{ height: 'auto', borderRadius: 8 }}>
      <Tabs defaultValue="DoorStatus" pt={'16px'}>
        <Tabs.List position="apart" sx={{ borderBottom: 'none' }}>
          <Group position="left" spacing={0}>
            <Tabs.Tab
              value="DoorStatus"
              onClick={() => handleTypeChange('DoorStatus')}
              className={cx(classes.tab)}
            >
              <Text>Door Status</Text>
            </Tabs.Tab>
            {/* <Tabs.Tab
              value="Communication"
              onClick={() => handleTypeChange('Communication')}
              className={cx(classes.tab)}
            >
              <Text>통신</Text>
            </Tabs.Tab> */}
          </Group>
        </Tabs.List>
        <Tabs.Panel value="DoorStatus">
          <DoorStatus reloadFlag={doorStatusReload} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
export default Sensor;
