import {
  Tabs,
  Box,
  NavLink,
  Chip,
  Group,
  Text,
  Title,
  Popover,
  Skeleton,
  Button,
} from '@mantine/core';
import { Adjustments } from 'tabler-icons-react';
import { memo, useEffect, useState } from 'react';
import LineChartSystem from './Components/Chart';
import { AUTO_REFRESH_TIME, EVENT_CLICK_NAME, LINE_CHART_TYPE } from '@/constants';
import { useLoading } from '@/LoadingContext';
import { getRSUUsage } from '@/services/UsageAPI';
import { LineChartData } from '@/interfaces/interfaceSystemStatus';
import { getAutoRefresh } from '@/services/HeaderAPI';
import ZoomIn from '@/assets/icons/ZoomIn';
import ZoomOut from '@/assets/icons/ZoomOut';

interface LineChartProps {
  title: string;
  type: string;
}

export interface StateInfo {
  id: string;
  state: boolean;
}

const LineChart = (props: LineChartProps) => {
  const { title, type } = props;
  const [listStateRSU, setListStateRSU] = useState<StateInfo[]>([]);
  const [monthData, setMonthData] = useState<LineChartData[]>([]);
  const [dateData, setDateData] = useState<LineChartData[]>([]);
  const [hourData, setHourData] = useState<LineChartData[]>([]);
  const [apiCount, setApiCount] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('1시간');
  const { setLoading } = useLoading();

  const handlePopoverToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckedChange = (index: number) => {
    setListStateRSU((prevState) => {
      const newState = [...prevState];
      newState[index].state = !newState[index].state;
      return newState;
    });
  };

  useEffect(() => {
    getUsage();
    const interval = setInterval(() => {
      getAutoRefresh().subscribe({
        next: ({ data }) => {
          data && getUsage();
        },
        error(err) {
          console.log(err);
        },
      });
    }, AUTO_REFRESH_TIME * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('refreshClick', getUsage);
    return () => {
      document.removeEventListener('refreshClick', getUsage);
    };
  }, []);

  const renderList = (
    <Popover.Dropdown
      sx={(theme) => ({
        width: '1vw',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[5],
        borderRadius: theme.radius['2xl'],
        border: `1px solid ${theme.colors['white-alpha'][2]}`,
      })}
    >
      {listStateRSU.map((item, index) => {
        return (
          <Chip
            key={type + item.id}
            checked={listStateRSU[index].state}
            onChange={() => handleCheckedChange(index)}
            mb={'xs'}
            variant="light"
          >
            {item.id}
          </Chip>
        );
      })}
    </Popover.Dropdown>
  );

  const handleZoomInParent = () => {
    let name = LINE_CHART_TYPE.HOUR;
    if (activeTab === '1일') {
      name = LINE_CHART_TYPE.DATE;
    }
    if (activeTab === '1달') {
      name = LINE_CHART_TYPE.MONTH;
    }
    const event = new CustomEvent(EVENT_CLICK_NAME.ZOOM_IN_BUTTON + title + name, { detail: {} });
    document.dispatchEvent(event);
  };
  const handleZoomOutParent = () => {
    let name = LINE_CHART_TYPE.HOUR;
    if (activeTab === '1일') {
      name = LINE_CHART_TYPE.DATE;
    }
    if (activeTab === '1달') {
      name = LINE_CHART_TYPE.MONTH;
    }
    const event = new CustomEvent(EVENT_CLICK_NAME.ZOOM_OUT_BUTTON + title + name, { detail: {} });
    document.dispatchEvent(event);
  };

  const getUsage = () => {
    setLoading(true);

    // Create an array to hold all the API request promises
    const apiRequests = [];
    const setInitApiCount = new Promise<void>((resolve) => {
      setApiCount(false);
      resolve();
    });
    setApiCount(false);
    // getRSUUsage API requests
    const getRSUUsagePromises = ['month', 'date', 'hour'].map((interval) => {
      return new Promise<void>((resolve, reject) => {
        getRSUUsage(type, interval).subscribe({
          next: ({ data }) => {
            if (interval === 'month') {
              const rsuArr: StateInfo[] = data.map((item) => {
                return { id: item.id, state: true };
              });
              setListStateRSU(rsuArr);
              setMonthData(data);
            } else if (interval === 'date') {
              setDateData(data);
            } else if (interval === 'hour') {
              setHourData(data);
            }
            resolve();
          },
          error(err) {
            console.error(err);
            reject(err);
          },
        });
      });
    });

    // Add the promises to the array
    apiRequests.push(setInitApiCount);
    // apiRequests.push(getListRSUPromise);
    apiRequests.push(...getRSUUsagePromises);

    // Wait for all promises to resolve
    Promise.all(apiRequests)
      .then(() => {
        // All API calls are done
        setApiCount(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };
  return (
    <Box
      id="line-chart"
      sx={(theme) => ({
        minWidth: '30%',
        height: '100%',
        marginRight: '1%',
        borderRadius: '16px',
        padding: '0.8vw',
        backgroundColor: theme.colors.gray[7],
        boxShadow: theme.shadows.base,
      })}
    >
      <Tabs
        variant="pills"
        radius="xs"
        color="gray"
        defaultValue={'1시간'}
        onTabChange={setActiveTab}
      >
        <Tabs.List position="apart">
          <Group spacing={2}>
            <Tabs.Tab
              p={'0.4vw'}
              value="1시간"
              sx={(theme) => ({
                '&:hover': {
                  backgroundColor: theme.colors.gray[6],
                },
              })}
            >
              <Text color="white">1시간</Text>
            </Tabs.Tab>
            <Tabs.Tab
              p={'0.4vw'}
              value="1일"
              sx={(theme) => ({
                '&:hover': {
                  backgroundColor: theme.colors.gray[6],
                },
              })}
            >
              <Text color="white">1일</Text>
            </Tabs.Tab>
            <Tabs.Tab
              p={'0.4vw'}
              value="1달"
              sx={(theme) => ({
                '&:hover': {
                  backgroundColor: theme.colors.gray[6],
                },
              })}
            >
              <Text color="white">1달</Text>
            </Tabs.Tab>
          </Group>
          <Popover
            id={title}
            width={120}
            trapFocus
            position="bottom"
            shadow="md"
            opened={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <Popover.Target>
              <NavLink
                className="rsu-list parent"
                sx={(theme) => ({
                  width: 'auto',
                  '&:hover': {
                    borderRadius: theme.radius['md'],
                    backgroundColor: theme.colors.gray[6],
                  },
                })}
                label={
                  <Title order={6} color="white">
                    {title}
                  </Title>
                }
                onClick={handlePopoverToggle}
                rightSection={<Adjustments size={20} strokeWidth={2} color={'white'} />}
              ></NavLink>
            </Popover.Target>
            {renderList}
          </Popover>
          <Group position="apart" spacing={'xl'} sx={{ width: 'fit-content', alignItems: 'end' }}>
            <ZoomIn onClick={handleZoomInParent} />
            <ZoomOut onClick={handleZoomOutParent} />
          </Group>
        </Tabs.List>
        <Tabs.Panel value="1시간" pt="xs">
          {!apiCount && (
            <>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </>
          )}
          {apiCount && (
            <LineChartSystem
              listStateRSU={listStateRSU}
              title={title}
              type={LINE_CHART_TYPE.HOUR}
              data={hourData}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="1일" pt="xs">
          {!apiCount && (
            <>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </>
          )}
          {apiCount && (
            <LineChartSystem
              listStateRSU={listStateRSU}
              title={title}
              type={LINE_CHART_TYPE.DATE}
              data={dateData}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="1달" pt="xs">
          {!apiCount && (
            <>
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </>
          )}
          {apiCount && (
            <LineChartSystem
              listStateRSU={listStateRSU}
              title={title}
              type={LINE_CHART_TYPE.MONTH}
              data={monthData}
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default memo(LineChart);
