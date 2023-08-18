import { LoadingOverlay, MantineProvider } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import 'dayjs/locale/ko';
import { Suspense, createContext, useEffect, useId, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PageLayout from './components/PageLayout';
import { SocketEvents } from './config/httpConfig/socket';
import routesConfig from './config/routesConfig';
import { ISocketEvent } from './interfaces/interfaceListEvent';
import useGlobalStore from './stores';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import { Authentication } from './pages';
import { userInfo } from './interfaces/interfaceAuthentication';
import { Path } from './config/path';
import { LoadingProvider } from './LoadingContext';
import { customTheme } from './config/mantineProvider';
import { CircleX } from 'tabler-icons-react';
import { getNewEvents } from './services/ListEventAPI';
import { getAutoRefresh } from './services/HeaderAPI';
import { AUTO_REFRESH_TIME } from './constants';

const initUser: userInfo = {
  username: '',
  email: '',
  role: {
    id: -1,
    name: '',
  },
  iat: -1,
  exp: -1,
};

export const LoginContext = createContext({
  loginState: false,
  setLoginState: (loginState: boolean) => {
    return;
  },
  setIsFirstAccess: (firstAccess: boolean) => {
    return;
  },
  currentUser: initUser,
});

function App() {
  const { socket, setCommunicationEvent, setNodeData, communicationEvent } = useGlobalStore(
    (state) => ({
      socket: state.socket,
      communicationEvent: state.communicationEvent,
      setCommunicationEvent: state.setCommunicationEvent,
      setNodeData: state.setNodeData,
    }),
  );
  const uID = useId();
  let currentUser: userInfo = initUser;
  const accessToken = Cookies.get('accessToken');
  if (accessToken !== undefined) {
    currentUser = jwtDecode(accessToken);
  }
  const [loginState, setLoginState] = useState<boolean>(
    currentUser !== initUser && currentUser.exp > Date.now() / 1000,
  );

  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [userId, setUserId] = useState(currentUser.username);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginState && isFirstAccess) {
      navigate('/');
      setIsFirstAccess(false);
      getAutoRefresh().subscribe({
        next: ({ data }) => {
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
    }
    if (!loginState) {
      navigate('/login');
    } else {
      const interval = setInterval(() => {
        getAutoRefresh().subscribe({
          next: ({ data }) => {
            if (window.location.href.includes('event-status')) return;
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
      return () => clearInterval(interval);
    }
  }, [loginState, isFirstAccess]);

  useEffect(() => {
    socket.on('connect_error', () => {
      socket.disconnect();
    });

    return () => {
      socket.off('connect_error');
    };
  }, []);

  const updateEvent = (event: ISocketEvent) => {
    const eventList = communicationEvent;
    const clearEvent = eventList.filter((item) => {
      return (
        item.sendNodeId != event.sendNodeId ||
        item.receiveNodeId != event.receiveNodeId ||
        item.id == event.id
      );
    });
    if (event.status != -1) {
      const updatedData = clearEvent.map((item) =>
        item.id === event.id ? { ...item, status: event.status } : item,
      );
      setCommunicationEvent(updatedData);
    } else {
      const updatedData = clearEvent.map((item) =>
        item.id === event.id ? { ...item, animated: false } : item,
      );
      setCommunicationEvent(updatedData);
    }
  };

  const createNewEvent = (event: ISocketEvent) => {
    const newEvent = communicationEvent.concat(event).filter((item) => {
      return (
        item.sendNodeId != event.sendNodeId ||
        item.receiveNodeId != event.receiveNodeId ||
        item.id == event.id
      );
    });
    setCommunicationEvent(newEvent);
  };

  useEffect(() => {
    socket.on(SocketEvents.NEW_COMMUNICATION, (event: ISocketEvent) => {
      createNewEvent(event);
    });
    socket.on(SocketEvents.UPDATE_COMMUNICATION, (event: ISocketEvent) => {
      updateEvent(event);
    });

    return () => {
      socket.off(SocketEvents.NEW_COMMUNICATION);
      socket.off(SocketEvents.UPDATE_COMMUNICATION);
    };
  }, [communicationEvent]);

  return (
    <LoadingProvider>
      <LoginContext.Provider
        value={{
          loginState,
          setLoginState,
          setIsFirstAccess,
          currentUser,
        }}
      >
        <MantineProvider withGlobalStyles withNormalizeCSS theme={customTheme}>
          <Notifications />
          <Suspense fallback={<LoadingOverlay overlayOpacity={0} visible />}>
            <Routes>
              <Route
                path={Path.LOGIN}
                element={
                  <Authentication
                    setLoginState={setLoginState}
                    setUserId={setUserId}
                    setIsFirstAccess={setIsFirstAccess}
                  />
                }
              />

              <Route path="/" element={<PageLayout />}>
                {routesConfig.map((route, index) => (
                  <Route key={`${uID}-${index}`} path={route.path} element={<route.component />} />
                ))}
              </Route>
            </Routes>
          </Suspense>
        </MantineProvider>
      </LoginContext.Provider>
    </LoadingProvider>
  );
}

export default App;
