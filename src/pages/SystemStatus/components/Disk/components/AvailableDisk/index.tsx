import { PIE_CHART_COLOR } from '@/constants';
import { Grid, Group, SimpleGrid, Text } from '@mantine/core';

const AvailableDisk = (props: { usage: number }) => {
  const { usage } = props;

  return (
    <Group position="center" pb={'md'} pl={'sm'} spacing={0.2}>
      <SimpleGrid cols={6} spacing="xl" sx={{ width: '100%' }}>
        <Text size={'xs'}>0%</Text>
        <Text size={'xs'}>20%</Text>
        <Text size={'xs'}>40%</Text>
        <Text sx={{ display: 'flex', justifyContent: 'center' }} size={'xs'}>
          60%
        </Text>
        <Text sx={{ display: 'flex', justifyContent: 'right' }} size={'xs'}>
          80%
        </Text>
        <Text sx={{ display: 'flex', justifyContent: 'right' }} size={'xs'}>
          100%
        </Text>
      </SimpleGrid>
      <Grid gutter="xs" columns={10}>
        {[...Array(10)].map((_, index) => {
          let fillColor = '';
          if (index >= usage) {
            fillColor = PIE_CHART_COLOR.AVAILABLE;
          } else if (index > 7) {
            fillColor = PIE_CHART_COLOR.FULL;
          } else {
            fillColor = PIE_CHART_COLOR.USED;
          }
          return (
            <Grid.Col span={1} key={index}>
              <svg
                width="1.5vw"
                height="1.5vw"
                style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
              >
                <rect width="100%" height="100%" fill={fillColor} />
              </svg>
            </Grid.Col>
          );
        })}
      </Grid>
    </Group>
  );
};

export default AvailableDisk;
