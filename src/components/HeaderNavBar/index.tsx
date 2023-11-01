import { useContext, useEffect, useState } from 'react';
import {
  createStyles,
  Header,
  Group,
  rem,
  Box,
  HoverCard,
  Text,
  Indicator,
  Menu,
  ScrollArea,
  CloseButton,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { FaUserCog, FaUser, FaUserTie } from 'react-icons/fa';
import Notification from '@/assets/icons/Notification';
// Asset
import Logo from '@/assets/icons/Logo';
import { Path } from '@/config/path';
import { LoginContext } from '@/App';
import { logout } from '@/services/AuthenticationAPI';
import { NOTIFICATIONS, Role } from '@/constants';
import { INotifications } from '@/interfaces/interfaceNotification';
import { delNotification, pushNotification } from '@/services/NotificationsAPI';
import useGlobalStore from '@/stores';
import { SocketEvents } from '@/config/httpConfig/socket';
const useStyles = createStyles((theme) => ({
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray[8],
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '64px',
    padding: '0px 16px',
    borderBottom: '0px',
  },

  headerSidebar: {
    alignItems: 'center',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: '24px',
  },

  logo: {
    left: 'unset',
    position: 'relative',
    top: 'unset',
    width: '185px',
  },

  account: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.md,
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: '0px',
    lineHeight: '24px',
    display: 'block',
    padding: `${rem(8)} ${rem(12)}`,
    color: theme.white,
    textDecoration: 'none',
    width: 'fit-content',
    position: 'relative',
    textAlign: 'center',
    justifyItems: 'center',

    '&:hover': {
      backgroundColor: theme.colors.gray[5],
      borderRadius: theme.radius.base,
    },
  },

  element: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.md,
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: '0px',
    lineHeight: '24px',
    display: 'block',
    padding: `${rem(8)} ${rem(12)}`,
    color: theme.colors.gray[4],
    textDecoration: 'none',
    width: 'fit-content',
    position: 'relative',
    textAlign: 'center',
    justifyItems: 'center',

    '&:hover': {
      backgroundColor: theme.colors.gray[5],
      borderRadius: theme.radius.base,
    },
  },
  item: {
    '&[data-hovered]': {
      backgroundColor: theme.colors.gray[6],
      color: theme.black,
      cursor: 'auto',
    },
  },

  clearAllButton: {
    color: theme.white,
    backgroundColor: theme.colors.red[5],
    textAlign: 'center',
    '&[data-hovered]': {
      backgroundColor: theme.colors.red[4],
      color: theme.white,
      cursor: 'pointer',
    },
  },
}));

const initNotifications: INotifications = {
  notification: [],
};

const HeaderNavBar = () => {
  const { socket } = useGlobalStore((state) => ({
    socket: state.socket,
  }));

  const { setLoginState, currentUser } = useContext(LoginContext);
  const [notifications, setNotification] = useState(initNotifications);
  const { classes, cx } = useStyles();
  let currentRole = '';
  let currentEmail = '';
  let userIcon = <FaUser size={20} />;
  if (currentUser !== undefined) {
    currentRole = currentUser.role.name;
    currentEmail = currentUser.email;
    if (currentRole === Role.MANAGER) {
      userIcon = <FaUserTie size={20} />;
    }
    if (currentRole === Role.OPERATOR) {
      userIcon = <FaUserCog size={20} />;
    }
  }
  useEffect(() => {
    pushNotification(currentUser.username).subscribe({
      next: ({ data }) => {
        setNotification(data);
      },
    });
  }, []);

  const deleteEvent = (username: string, eventId: string) => {
    const payload = [
      {
        username: username,
        // eslint-disable-next-line camelcase
        event_id: eventId,
      },
    ];
    delNotification(payload).subscribe(() => {
      pushNotification(currentUser.username).subscribe({
        next: ({ data }) => {
          setNotification(data);
        },
      });
    });
  };
  const handleDelete = (eventId: string) => {
    const itemIndex = notifications.notification.findIndex((item) => item.id === eventId);
    if (itemIndex !== -1) {
      const updatedNotifications = [...notifications.notification];
      updatedNotifications.splice(itemIndex, 1);
      setNotification({ ...notifications, notification: updatedNotifications });
      deleteEvent(currentUser.username, eventId);
    }
  };
  const clearAllNotifications = () => {
    const payload = notifications.notification.map((item) => ({
      username: currentUser.username,
      // eslint-disable-next-line camelcase
      event_id: item.id,
    }));
    delNotification(payload).subscribe(() => {
      setNotification(initNotifications);
    });
  };
  const countNotifications = notifications.notification.length;
  const notificationsItem = (
    <Menu.Dropdown
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[7],
        width: '250px',
        borderRadius: '1%',
      })}
    >
      <Menu.Label
        sx={{
          fontSize: '16px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {NOTIFICATIONS.NOTIFICATION_KOR}
      </Menu.Label>
      <ScrollArea.Autosize w={'100%'} h={350} scrollbarSize={2}>
        {notifications.notification.map((item) => (
          <Menu.Item
            key={item.id}
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[6],
              margin: '5px 0px',
            })}
            rightSection={
              <CloseButton onClick={() => handleDelete(item.id)} color="red"></CloseButton>
            }
          >
            <Group
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                alignItems: 'start',
                width: '100%',
              }}
            >
              <Text color="white">
                {NOTIFICATIONS.ERROR_KOR}: {item.nodeId}
              </Text>
              <Text color="white">
                {NOTIFICATIONS.DETAIL_KOR}: {item.detail}
              </Text>
              <Text color="white">
                {NOTIFICATIONS.TIME_KOR}: {new Date(item.createAt).toLocaleString()}
              </Text>
            </Group>
          </Menu.Item>
        ))}
      </ScrollArea.Autosize>
      <Menu.Divider />
      <Menu.Item
        className={cx(classes.clearAllButton)}
        onClick={() => {
          clearAllNotifications();
        }}
      >
        {NOTIFICATIONS.CLEAR_ALL_KOR}
      </Menu.Item>
    </Menu.Dropdown>
  );
  const itemsHeader = [
    {
      link: '',
      label: currentUser.username === '' ? 'User ID' : currentUser.username,
    },
    {
      link: '',
      label: 'Notification',
    },
    {
      link: Path.ENV,
      label: '설정',
    },
    {
      link: Path.LOGIN,
      label: '로그아웃​',
    },
  ];
  const items = itemsHeader.map((item) => {
    if (item.label === '설정' || item.label === '로그아웃​') {
      return (
        <Link
          key={item.label}
          to={item.link}
          className={cx(classes.element)}
          onClick={() => {
            if (item.label === '로그아웃​') {
              socket.off(SocketEvents.KEEP_ALIVE);
              socket.off(SocketEvents.NEW_NOTIFICATION);
              setLoginState(false);
              logout().subscribe({
                error(err) {
                  console.log(err);
                },
              });
            }
          }}
        >
          {item.label}
        </Link>
      );
    } else if (item.label === 'Notification') {
      return (
        <Group key={item.label} mt={'auto'}>
          {countNotifications ? (
            <Menu closeOnItemClick={false} classNames={classes} width={'350px'}>
              <Menu.Target>
                <Indicator inline label={countNotifications}>
                  <Notification />
                </Indicator>
              </Menu.Target>
              {notificationsItem}
            </Menu>
          ) : (
            <Indicator inline>
              <Notification />
            </Indicator>
          )}
        </Group>
      );
    } else {
      return (
        <Group key={item.label}>
          <HoverCard shadow="md">
            <HoverCard.Target>
              <Link
                key={item.label}
                to={item.link}
                className={cx(classes.account)}
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                <Group position="center" spacing="xs">
                  {userIcon}
                  {item.label}
                </Group>
              </Link>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text color="black" size="sm">
                {currentEmail}
              </Text>
              <Text color="black" size="sm">
                {currentRole}
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      );
    }
  });
  return (
    <Header height={64} className={classes.header}>
      <Box className={classes.logo}>
        <Link to={Path.DASHBOARD}>
          <Logo />
        </Link>
      </Box>
      <Box className={classes.headerSidebar}>{items}</Box>
    </Header>
  );
};
export default HeaderNavBar;
