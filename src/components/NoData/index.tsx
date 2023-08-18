import { Box, Text } from '@mantine/core';

const NoData = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '80%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        sx={(theme) => ({
          fontSize: 20,
        })}
      >
        DATA NOT FOUND
      </Text>
    </Box>
  );
};

export default NoData;
