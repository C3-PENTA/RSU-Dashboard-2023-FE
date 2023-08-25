import { Title, Box, ScrollArea, Popover, Chip, Group, NavLink, Skeleton } from '@mantine/core';
import ThermometerChart from './components/ThermometerChart';
import './index.css';
import { AvailEventData } from '../..';
import { useEffect, useState } from 'react';
import { Adjustments } from 'tabler-icons-react';
import { NoData } from '@/components';

interface DetailDataProp {
  data: AvailEventData[];
  loadedAPI: boolean;
}

const Detail = (props: DetailDataProp) => {
  const { data, loadedAPI } = props;
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedNodeIds(data.map((item) => item.nodeId));
  }, [data]);

  const handleChipClick = (nodeId: string) => {
    setSelectedNodeIds((prevSelectedNodeIds) => {
      if (prevSelectedNodeIds.includes(nodeId)) {
        return prevSelectedNodeIds.filter((id) => id !== nodeId);
      } else {
        return [...prevSelectedNodeIds, nodeId];
      }
    });
  };
  const filteredData = data.filter((item) => selectedNodeIds.includes(item.nodeId));

  const renderTemperatureList = (
    <ScrollArea h={280}>
      <Box>
        {filteredData.map((item) => {
          return (
            <ThermometerChart key={item.nodeId} title={item.nodeId} temperature={item.cpuTemp} />
          );
        })}
      </Box>
    </ScrollArea>
  );
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
      {data.map((item) => {
        return (
          <Chip
            key={item.nodeId}
            mb={'xs'}
            variant="light"
            checked={selectedNodeIds.includes(item.nodeId)}
            onClick={() => handleChipClick(item.nodeId)}
          >
            {item.nodeId}
          </Chip>
        );
      })}
    </Popover.Dropdown>
  );
  const handlePopoverToggle = () => {
    setIsOpen(!isOpen);
  };
  const title = (
    <Group style={{ height: '15%', display: 'flex', justifyContent: 'center' }}>
      <Popover
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
              borderRadius: theme.radius['md'],
              '&:hover': {
                backgroundColor: theme.colors.gray[6],
              },
            })}
            label={
              <Title order={6} color="white">
                {' '}
                CPU 온도{' '}
              </Title>
            }
            onClick={handlePopoverToggle}
            rightSection={<Adjustments size={20} strokeWidth={2} color={'white'} />}
          ></NavLink>
        </Popover.Target>
        {renderList}
      </Popover>
    </Group>
  );
  return (
    <Box
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
      {title}
      {data.length <= 0 && loadedAPI && <NoData />}
      {data.length <= 0 && !loadedAPI && (
        <>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </>
      )}
      {data.length > 0 && renderTemperatureList}
    </Box>
  );
};

export default Detail;
