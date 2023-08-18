import { useEffect, useState } from 'react';
import {
  Box,
  NavLink,
  Chip,
  Group,
  Text,
  Button,
  Title,
  Popover,
  ScrollArea,
  Grid,
  Skeleton,
  SimpleGrid,
} from '@mantine/core';
import { Adjustments } from 'tabler-icons-react';
import AvailableDisk from './components/AvailableDisk';
import { AvailEventData } from '../..';
import PieChart from './components/PieChart';
import { NoData } from '@/components';

interface DisksUsageDataProp {
  title: string;
  data: AvailEventData[];
  loadedAPI: boolean;
}

function Disk(props: DisksUsageDataProp) {
  const { title, data, loadedAPI } = props;
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [nodeIdPieChart, setNodeIdPieChart] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const handlePopoverToggle = () => {
    setIsOpen(!isOpen);
  };
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

  const filteredData = data.filter((item) => selectedNodeIds.includes(item.nodeId));

  const renderListButton = (
    <SimpleGrid cols={1}>
      {filteredData.map((item) => {
        return (
          <Button
            key={item.nodeId}
            variant={nodeIdPieChart === item.nodeId ? 'filled' : 'default'}
            size={'xs'}
            onClick={() => {
              setNodeIdPieChart((preState) => (preState === item.nodeId ? '' : item.nodeId));
            }}
          >
            <Text size={'xs'} weight={650}>
              {item.nodeId}
            </Text>
          </Button>
        );
      })}
    </SimpleGrid>
  );

  const renderDiskList = (
    <Group position="center" spacing={0}>
      {filteredData.map((item: AvailEventData) => {
        return (
          <Grid key={item.nodeId} columns={13} align="center" sx={{ paddingBottom: 0 }}>
            <Grid.Col span={2} sx={{ paddingBottom: 0 }}>
              <Button
                variant={nodeIdPieChart === item.nodeId ? 'filled' : 'default'}
                size={'xs'}
                onClick={() => {
                  setNodeIdPieChart((preState) => (preState === item.nodeId ? '' : item.nodeId));
                }}
                compact
              >
                <Text size={'xs'} weight={650}>
                  {item.nodeId}
                </Text>
              </Button>
            </Grid.Col>
            <Grid.Col span={10} sx={{ paddingBottom: 0 }}>
              <AvailableDisk usage={item.diskUsage / 10} />
            </Grid.Col>
            <Grid.Col span={1} sx={{ paddingBottom: 0 }}>
              <Text size={'xs'}>100 GB</Text>
            </Grid.Col>
          </Grid>
        );
      })}
    </Group>
  );
  return (
    <Box
      id="disk-usage"
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
      <Group position="center">
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
      </Group>
      {data.length <= 0 && loadedAPI && <NoData />}
      {data.length <= 0 && !loadedAPI && (
        <>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </>
      )}
      {nodeIdPieChart !== '' && (
        <Group align="left" spacing={'xs'}>
          <ScrollArea h={300} type="auto" scrollbarSize={6}>
            {renderListButton}
          </ScrollArea>
          <PieChart data={data.find((item) => item.nodeId === nodeIdPieChart)} />
        </Group>
      )}
      {data.length <= 5 && nodeIdPieChart === '' && renderDiskList}
      {data.length > 5 && nodeIdPieChart === '' && (
        <ScrollArea h={300} type="hover" scrollbarSize={6}>
          {renderDiskList}
        </ScrollArea>
      )}
    </Box>
  );
}

export default Disk;
