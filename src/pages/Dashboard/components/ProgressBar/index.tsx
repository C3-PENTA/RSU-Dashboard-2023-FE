import React, { useEffect, useState } from 'react';
import { ISummaryEventStatus } from '@/interfaces/interfaceDashboard';
import { getEventStatusSummary } from '@/services/DashboardAPI';
import { Group, RingProgress, createStyles } from '@mantine/core';
import CloseButton from '@/assets/icons/CloseButton';

const color = ['#48BB78', '#F56565'];

const useStyles = createStyles((theme) => ({
  layout: {
    alignItems: 'flex-start',
    width: '319px',
    height: '448px',
    backgroundColor: theme.colors.gray[7],
    borderRadius: theme.radius['2xl'],
    zIndex: 10,
    gap: '32px',
    position: 'absolute',
    padding: '16px 32px',
    display: 'flex',
    flexDirection: 'column',
    right: '16px',
    top: '16px',
  },

  header: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    padding: '0px 8px 8px 8px',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderBottom: `2px solid ${theme.colors.blue[4]}`,
  },

  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  textTitle: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.lg,
    fontWeight: 600,
    lineHeight: '28px',
    flex: '0 0 1',
  },

  legend: {
    display: 'inline-flex',
    gap: '16px',
    alignItems: 'flex-start',
  },

  label: {
    color: theme.colors.gray[4],
    alignItems: 'center',
    display: 'inline-flex',
    flex: '0 0 auto',
    gap: '8px',
    fontSize: theme.fontSizes.xs,
    fontWeight: 400,
    lineHeight: '16px',
  },

  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    alignSelf: 'stretch',
  },

  textProgressBar: {
    color: theme.white,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.xs,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeightL: '16px',
  },
}));

const ProgressBar = (props: { id: string }) => {
  const [eventStatusData, setEventStatusData] = useState<ISummaryEventStatus[]>([]);

  useEffect(() => {
    getEventStatusSummary('all').subscribe({
      next: ({ data }) => {
        setEventStatusData(data.summary);
      },
    });
  }, []);

  const { classes, cx } = useStyles();
  const elements = eventStatusData.map((item) => {
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
  const filterData = elements.filter((item) => item.id == props.id);
  let percentTotalEvent: { value: number; color: string; tooltip: string }[] = [];
  let percentAvailabilityEvents: { value: number; color: string; tooltip: string }[] = [];
  let percentCommunicationEvents: { value: number; color: string; tooltip: string }[] = [];
  let titleDevice = '';
  if (filterData.length > 0) {
    percentTotalEvent = [
      {
        value: (filterData[0].normalAvailability + filterData[0].normalCommunication) / 2,
        color: color[0],
        tooltip: `${(filterData[0].normalAvailability + filterData[0].normalCommunication) / 2}`,
      },
      {
        value: (filterData[0].errorAvailability + filterData[0].errorCommunication) / 2,
        color: color[1],
        tooltip: `${(filterData[0].errorAvailability + filterData[0].errorCommunication) / 2}`,
      },
    ];
    percentAvailabilityEvents = [
      {
        value: filterData[0].normalAvailability,
        color: color[0],
        tooltip: `${filterData[0].normalAvailability}`,
      },
      {
        value: filterData[0].errorAvailability,
        color: color[1],
        tooltip: `${filterData[0].errorAvailability}`,
      },
    ];
    percentCommunicationEvents = [
      {
        value: filterData[0].normalCommunication,
        color: color[0],
        tooltip: `${filterData[0].normalCommunication}`,
      },
      {
        value: filterData[0].errorCommunication,
        color: color[1],
        tooltip: `${filterData[0].errorCommunication}`,
      },
    ];
    titleDevice = filterData[0].device;
  }
  const processBarTitle = (
    <Group className={cx(classes.header)}>
      <Group className={cx(classes.title)}>
        <div className={cx(classes.textTitle)}>{titleDevice} 발생 현황</div>
      </Group>
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
    </Group>
  );
  const mainProcessBar = (
    <Group>
      <div className={cx(classes.progressBar)}>
        <RingProgress size={88} thickness={12} sections={percentTotalEvent} />
        <div className={cx(classes.textProgressBar)}>전체 이벤트 중 오류 발생 비율</div>
      </div>
      <div className={cx(classes.progressBar)}>
        <RingProgress size={88} thickness={12} sections={percentAvailabilityEvents} />
        <div className={cx(classes.textProgressBar)}>가용성 중 오류 발생 비율</div>
      </div>
      <div className={cx(classes.progressBar)}>
        <RingProgress size={88} thickness={12} sections={percentCommunicationEvents} />
        <div className={cx(classes.textProgressBar)}>통신 중 오류 발생 비율</div>
      </div>
    </Group>
  );
  const processBar = (
    <div className={cx(classes.layout)}>
      {processBarTitle}
      {mainProcessBar}
    </div>
  );
  return processBar;
};

export default ProgressBar;
