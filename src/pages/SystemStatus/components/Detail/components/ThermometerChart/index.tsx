import React, { useState, useEffect } from 'react';
import { Text, createStyles } from '@mantine/core';

import './index.css';

interface ThermometerProps {
  title: string;
  temperature: number;
}

const useStyles = createStyles((theme) => ({
  text: {
    width: '100px',
    fontFamily: theme.fontFamily,
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    lineHeight: 1.55,
  },
}));

const ThermometerChart = (props: ThermometerProps) => {
  const { title, temperature } = props;
  const [fahrenheit, setFahrenheit] = useState(0);
  const [color, setColor] = useState('rgba(72, 187, 120, 1)');
  const { classes, cx } = useStyles();

  useEffect(() => {
    const fahrenheitValue = Math.round(temperature * 1.8 + 32);
    setFahrenheit(fahrenheitValue);
    if (temperature > 70) {
      setColor('rgba(245, 101, 101, 1)');
    } else {
      setColor('rgba(72, 187, 120, 1)');
    }
  }, [temperature]);

  return (
    <>
      <div className="container">
        <Text size={'sm'} weight={650}>
          {title}
        </Text>
        <div className="container-chart">
          <div className="cover">
            <div className="root">
              <div className="child" style={{ backgroundColor: color }}></div>
            </div>
            <div className="box">
              <div
                className="temperature"
                style={{ width: temperature + '%', backgroundColor: color }}
              ></div>
            </div>
          </div>
        </div>
        <div className={cx(classes.text)}>
          {' '}
          {temperature}&deg;C {fahrenheit}&deg;F
        </div>
      </div>
    </>
  );
};
export default ThermometerChart;
