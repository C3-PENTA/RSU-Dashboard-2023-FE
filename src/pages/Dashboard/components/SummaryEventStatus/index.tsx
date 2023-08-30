import { Box, Chip, Group, Popover, ScrollArea, Table, createStyles } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { ISummaryEventStatus } from '@/interfaces/interfaceDashboard';
import { getEventStatusSummary } from '@/services/DashboardAPI';
import Filter from '@/assets/icons/Filter';

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
  scrolled: {
    boxShadow: theme.shadows.sm,
  },

  text: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    lineHeight: '20px',
  },

  eventStatus: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
    gap: '16px',
    position: 'relative',
  },

  eventStatusHeader: {
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

function SummaryEventStatus() {
  const [eventStatusData, setEventStatusData] = useState<ISummaryEventStatus[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
  };

  const handleChipClick = (nodeId: string) => {
    setSelectedNodeIds((prevSelectedNodeIds) => {
      if (prevSelectedNodeIds.includes(nodeId)) {
        return prevSelectedNodeIds.filter((id) => id !== nodeId);
      } else {
        return [...prevSelectedNodeIds, nodeId];
      }
    });
  };

  const filteredData = eventStatusData.filter((item) => selectedNodeIds.includes(item.customId));

  useEffect(() => {
    getEventStatusSummary('hour_ago').subscribe({
      next: ({ data }) => {
        setEventStatusData(data.summary);
        setSelectedNodeIds(data.summary.map((item) => item.customId));
      },
    });
  }, []);

  const elements = filteredData.map((item) => {
    const element = {
      id: item.nodeId,
      device: item.customId,
      normalAvailability: item.percentAvailabilityNormal,
      errorAvailability: item.percentAvailabilityError,
      totalAvailability: item.percentTotalAvailability,
      normalCommunication: item.percentCommunicationNormal,
      errorCommunication: item.percentCommunicationError,
      totalCommunication: item.percentTotalCommunication,
    };
    return element;
  });
  const rows = elements.map((element, index) => (
    <React.Fragment key={index}>
      <tr key={element.device + '1'}>
        <td className={cx(classes.cells)} rowSpan={2}>
          {element.device}
        </td>
        <td className={cx(classes.cells)}>가용성</td>
        <td className={cx(classes.cells)}>{element.normalAvailability}</td>
        <td className={cx(classes.cells)}>{element.errorAvailability}</td>
        <td className={cx(classes.cells)}>{element.totalAvailability}</td>
      </tr>
      <tr key={element.device + '2'}>
        <td className={cx(classes.cells)}>통신</td>
        <td className={cx(classes.cells)}>{element.normalCommunication}</td>
        <td className={cx(classes.cells)}>{element.errorCommunication}</td>
        <td className={cx(classes.cells)}>{element.totalCommunication}</td>
      </tr>
    </React.Fragment>
  ));
  const renderList = (
    <Popover.Dropdown className={cx(classes.dropdownMenu)}>
      {eventStatusData.map((item) => {
        return (
          <Chip
            key={item.customId}
            mb={'xs'}
            variant="light"
            checked={selectedNodeIds.includes(item.customId)}
            onClick={() => handleChipClick(item.customId)}
          >
            {item.customId}
          </Chip>
        );
      })}
    </Popover.Dropdown>
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
  const mainTable = (
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
            <th className={cx(classes.theadCells)}>구분</th>
            <th className={cx(classes.theadCells)}>정상</th>
            <th className={cx(classes.theadCells)}>오류</th>
            <th className={cx(classes.theadCells)}>총 이벤트</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea.Autosize>
  );
  return (
    <Box className={cx(classes.eventStatus)}>
      <Group className={cx(classes.eventStatusHeader)}>
        <div className={cx(classes.textTitle)}>최근 1시간 이벤트 발생 현황</div>
        <Group className={cx(classes.textDescription)}>
          {title}
          {label}
        </Group>
      </Group>
      <Group className={cx(classes.table)}>{mainTable}</Group>
    </Box>
  );
}
export default SummaryEventStatus;
