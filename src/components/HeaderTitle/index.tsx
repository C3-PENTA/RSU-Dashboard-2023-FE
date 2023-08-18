import { Group, Text } from '@mantine/core';

type Props = {
  label: string;
};

const HeaderTitle = (props: Props) => {
  const { label } = props;
  return (
    <Group pb={10}>
      <Text
        sx={(theme) => ({
          color: theme.colors.blue[5],
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderBottom: `2px solid ${theme.colors.blue[5]}`,
        })}
      >
        {label}
      </Text>
    </Group>
  );
};

export default HeaderTitle;
