import React, { useContext, useEffect, useState } from 'react';
import { Box, Group, Switch, Text, createStyles } from '@mantine/core';
import TitleMenu from '@/assets/icons/TitleMenu';
import moment from 'moment';
import RefreshButton from '@/assets/icons/Refresh';
import { publish } from '@/helper/event';
import { EVENT_CLICK_NAME, EdgeSystemConnection, Role } from '@/constants';
import { LoginContext } from '@/App';
import { getAutoRefresh, updateAutoRefresh } from '@/services/HeaderAPI';

const useStyles = createStyles((theme) => ({
  titleBar: {
    backgroundColor: theme.colors.gray[7],
    width: 'auto',
    height: '64px',
    padding: '0 0',
    position: 'sticky',
    top: 64,
    zIndex: 99,
    border: '0px none',
  },
  titleWrapper: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
  },

  title: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    gap: '16px',
    position: 'relative',
  },

  textTitle: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.lg,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '28px',
    marginTop: '-1px',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },
  reload: {
    alignItems: 'center',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: '8px',
    position: 'relative',
  },

  reloadText: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.xs,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
  },
}));

const MainTitle = () => {
  const { currentUser } = useContext(LoginContext);
  const { classes, cx } = useStyles();
  const [now, setNow] = useState(moment().local().format('YYYY-MM-DD HH:mm:ss'));
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (currentUser.role.name === Role.OPERATOR) {
      getAutoRefreshState();
    }
  }, []);

  const isShowRefreshButton = !(
    window.location.href.includes('environment') || window.location.href.includes('policy')
  );

  const handleRefresh = () => {
    publish(EVENT_CLICK_NAME.REFRESH_BUTTON, {});
    setNow(moment().local().format('YYYY.MM.DD HH:mm:ss'));
  };

  const getAutoRefreshState = () => {
    getAutoRefresh().subscribe({
      next: ({ data }) => {
        setAutoRefresh(data);
      },
      error(err) {
        console.log(err);
      },
    });
  };

  const handleSwitchAutoRefresh = (state: boolean) => {
    setAutoRefresh(state);
    updateAutoRefresh(state);
  };

  return (
    <Box className={cx(classes.titleBar)}>
      <Box className={cx(classes.titleWrapper)}>
        <Group className={cx(classes.title)}>
          <TitleMenu />
          <Text className={cx(classes.textTitle)}>지능형 RSU 통합 모니터링 시스템</Text>
        </Group>
        {isShowRefreshButton && (
          <Group className={cx(classes.reload)}>
            <div className={cx(classes.reloadText)}>{`갱신 일시: ${now}`}</div>
            <RefreshButton onClick={handleRefresh} />
            {currentUser.role.name === Role.OPERATOR && (
              <Switch
                labelPosition="left"
                label={
                  <Text fz="xs" color="white">
                    자동 새로 고침
                  </Text>
                }
                onLabel="ON"
                offLabel="OFF"
                size="sm"
                checked={autoRefresh}
                onChange={(event) => handleSwitchAutoRefresh(event.currentTarget.checked)}
              />
            )}
          </Group>
        )}
      </Box>
    </Box>
  );
};

export default MainTitle;
