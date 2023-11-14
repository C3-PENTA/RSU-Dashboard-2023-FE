import { Box, Chip, Group, Popover, Table, ScrollArea, createStyles } from '@mantine/core';
import { ISummarySystemStatus } from '@/interfaces/interfaceDashboard';
import { useEffect, useState } from 'react';
import Filter from '@/assets/icons/Filter';
import { getSystemStatusSummary } from '@/services/DashboardAPI';

const colors = ['#51CF66', '#FF6B6B', '#faec4d'];
const getColor = (value: number | null, type: string): string => {
  if (value == null) {
    return '#ded9d9';
  }

  switch (type) {
    case 'cpu':
      return value < 70 ? colors[0] : colors[1];
    case 'ram':
    case 'disk':
      return value < 80 ? colors[0] : colors[1];
    case 'nic':
      return value === 2 ? colors[1] : colors[0];
    case 'keep-alive':
      switch (value) {
        case 0:
          return colors[0];
        case 1:
          return colors[2];
        case 2:
          return colors[1];
        default:
          return '#ded9d9';
      }
    default:
      return '#ded9d9';
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

interface SummarySystemStatusProp {
  data: ISummarySystemStatus[];
}

const SummarySystemStatus = (props: SummarySystemStatusProp) => {
  const { data } = props;
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setSelectedNodeIds(data.map((item) => item.rsuID));
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

  const filteredData = data.filter((item) => selectedNodeIds.includes(item.rsuID));

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
            backgroundColor: getColor(element.nodeStatus, 'keep-alive'),
          }}
        />
      </td>
      <td className={cx(classes.cells)}>
        {element.cpuUsage !== null ? (
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              marginLeft: '6px',
              backgroundColor: getColor(element.cpuUsage, 'cpu'),
            }}
          />
        ) : (
          <div>-</div>
        )}
      </td>
      <td className={cx(classes.cells)}>
        {element.ramUsage !== null ? (
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              marginLeft: '6px',
              backgroundColor: getColor(element.ramUsage, 'ram'),
            }}
          />
        ) : (
          <div>-</div>
        )}
      </td>
      <td className={cx(classes.cells)}>
        {element.diskUsage !== null ? (
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              marginLeft: '6px',
              backgroundColor: getColor(element.diskUsage, 'disk'),
            }}
          />
        ) : (
          <div>-</div>
        )}
      </td>
      <td className={cx(classes.cells)}>
        {element.networkStatus !== null ? (
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              marginLeft: '6px',
              backgroundColor: getColor(element.networkStatus, 'nic'),
            }}
          />
        ) : (
          <div>-</div>
        )}
      </td>
    </tr>
  ));
  const renderList = (
    <Popover.Dropdown className={cx(classes.dropdownMenu)}>
      {data.map((item) => {
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
            backgroundColor: colors[0],
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
            backgroundColor: colors[1],
          }}
        ></div>
        <div>비정상</div>
      </div>
      <div className={cx(classes.label)}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: colors[2],
          }}
        ></div>
        <div>Unknown</div>
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
            <th className={cx(classes.theadCells)}>ALIVE</th>
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
