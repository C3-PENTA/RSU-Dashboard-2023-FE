import { Box, Chip, Group, Popover, Table, ScrollArea, createStyles } from '@mantine/core';
import { ISummarySystemStatus } from '@/interfaces/interfaceDashboard';
import { useEffect, useState } from 'react';
import Filter from '@/assets/icons/Filter';
import { getSystemStatusSummary } from '@/services/DashboardAPI';

const colors = ['#51CF66', '#FF6B6B'];
const getColor = (value: number, type: string) => {
  if (value == null) {
    return '#ded9d9';
  }
  if (type === 'cpu') {
    return value < 70 ? colors[0] : colors[1];
  } else if (type === 'ram' || type === 'disk') {
    return value < 80 ? colors[0] : colors[1];
  } else if (type === 'nic') {
    return value === 2 ? colors[1] : colors[0];
  }
};

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colors.gray[6],
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  },

  text: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    lineHeight: '20px',
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
  systemStatus: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
    gap: '16px',
    position: 'relative',
  },

  systemStatusHeader: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    borderColor: theme.colors.blue[4],
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    gap: '8px',
    padding: '0px 8px 8px',
    position: 'relative',
    width: '100%',
  },

  textTitle: {
    alignSelf: 'stretch',
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.lg,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '28px',
  },

  textDescription: {
    display: 'flex',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    height: '20px',
    width: '100%',
    color: theme.colors.gray[4],
    fontFamily: theme.fontFamily,
  },

  filter: {
    alignItems: 'center',
    display: 'flex',
    gap: '8px',
    left: 0,
    top: 0,
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fontFamily,
    fontWeight: 400,
    lineHeight: '20px',
    cursor: 'pointer',
  },

  legend: {
    display: 'inline-flex',
    gap: '16px',
    alignItems: 'flex-start',
  },

  label: {
    alignItems: 'center',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: '8px',
    fontSize: theme.fontSizes.xs,
    fontWeight: 400,
    lineHeight: '16px',
  },

  table: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.gray[7],
    border: '1px solid',
    borderColor: theme.colors.gray[6],
    borderRadius: theme.radius['2xl'],
    display: 'flex',
    flex: '0 0 auto',
    padding: '12px',
    width: '100%',
  },

  cells: {
    height: '40px',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors['white-alpha'][2]}`,
  },

  dropdownMenu: {
    backgroundColor: theme.colors.gray[5],
    borderRadius: theme.radius['2xl'],
    border: `1px solid ${theme.colors['white-alpha'][2]}`,
  },

  theadCells: {
    color: theme.white,
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
    lineHeight: '16px',
    letterSpacing: '0.6px',
  },
}));

const SummarySystemStatus = () => {
  const [systemStatusData, setSystemStatusData] = useState<ISummarySystemStatus[]>([]);
  useEffect(() => {
    getSystemStatusSummary().subscribe({
      next: ({ data }) => {
        setSystemStatusData(data);
      },
    });
  }, []);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
  };

  console.log(systemStatusData);
  useEffect(() => {
    setSelectedNodeIds(systemStatusData.map((item) => item.rsuID));
  }, [systemStatusData]);
  const handleChipClick = (nodeId: string) => {
    setSelectedNodeIds((prevSelectedNodeIds) => {
      if (prevSelectedNodeIds.includes(nodeId)) {
        return prevSelectedNodeIds.filter((id) => id !== nodeId);
      } else {
        return [...prevSelectedNodeIds, nodeId];
      }
    });
  };
  const filteredData = systemStatusData.filter((item) => selectedNodeIds.includes(item.rsuID));

  const rows = filteredData.map((element) => (
    <tr key={element.rsuID}>
      <td className={cx(classes.cells)}>{element.rsuID}</td>
      <td className={cx(classes.cells)}>
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: '50%',
            marginLeft: '6px',
            backgroundColor: getColor(element.cpuUsage, 'cpu'),
          }}
        />
      </td>
      <td className={cx(classes.cells)}>
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: '50%',
            marginLeft: '6px',
            backgroundColor: getColor(element.ramUsage, 'ram'),
          }}
        />
      </td>
      <td className={cx(classes.cells)}>
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: '50%',
            marginLeft: '6px',
            backgroundColor: getColor(element.diskUsage, 'disk'),
          }}
        />
      </td>
      <td className={cx(classes.cells)}>
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: '50%',
            marginLeft: '6px',
            backgroundColor: getColor(element.networkStatus, 'nic'),
          }}
        />
      </td>
    </tr>
  ));
  const renderList = (
    <Popover.Dropdown className={cx(classes.dropdownMenu)}>
      {systemStatusData.map((item) => {
        return (
          <Chip
            key={item.rsuID}
            mb={'xs'}
            variant="light"
            checked={selectedNodeIds.includes(item.rsuID)}
            onClick={() => handleChipClick(item.rsuID)}
          >
            {item.rsuID}
          </Chip>
        );
      })}
    </Popover.Dropdown>
  );

  const title = (
    <Popover position="bottom" opened={isOpen} onClose={() => setIsOpen(false)}>
      <Popover.Target>
        <Group className={cx(classes.filter)} onClick={handleFilterClick}>
          <div>필터</div>
          <Filter />
        </Group>
      </Popover.Target>
      {renderList}
    </Popover>
  );
  const label = (
    <Group className={cx(classes.legend)}>
      <div className={cx(classes.label)}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#48BB78',
          }}
        ></div>
        <div>정상</div>
      </div>
      <div className={cx(classes.label)}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#F56565',
          }}
        ></div>
        <div>비정상</div>
      </div>
    </Group>
  );
  const table = (
    <ScrollArea.Autosize
      w={'100%'}
      h={200}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      scrollbarSize={2}
    >
      <Table verticalSpacing="xs" className={cx(classes.text)}>
        <thead
          className={cx(classes.header, {
            [classes.scrolled]: scrolled,
          })}
        >
          <tr>
            <th className={cx(classes.theadCells)}>장비 정보</th>
            <th className={cx(classes.theadCells)}>CPU</th>
            <th className={cx(classes.theadCells)}>RAM</th>
            <th className={cx(classes.theadCells)}>DISK</th>
            <th className={cx(classes.theadCells)}>NIC</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea.Autosize>
  );
  return (
    <Box className={cx(classes.systemStatus)}>
      <Group className={cx(classes.systemStatusHeader)}>
        <div className={cx(classes.textTitle)}>시스템 현황</div>
        <Group className={cx(classes.textDescription)}>
          {title}
          {label}
        </Group>
      </Group>
      <Group className={cx(classes.table)}>{table}</Group>
    </Box>
  );
};
export default SummarySystemStatus;
