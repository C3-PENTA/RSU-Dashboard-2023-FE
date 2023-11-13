import { Pagination, Group } from '@mantine/core';

interface PaginationProp {
  totalPage: number;
  currentPage: number;
  setCurrentPage: (newValue: number) => void;
}

const PaginationTable = (props: PaginationProp) => {
  const { totalPage, currentPage, setCurrentPage } = props;
  const total = totalPage;

  const handleCurrentPage = (value: number) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Pagination.Root
        total={total}
        value={currentPage}
        onChange={(value) => handleCurrentPage(value)}
        color="dark"
        radius="xl"
        siblings={1}
        size={'sm'}
      >
        <Group spacing={3} position="right" style={{ marginTop: '10px' }}>
          <Pagination.First aria-label="fr">First</Pagination.First>
          <Pagination.Previous />
          <Pagination.Items />
          <Pagination.Next />
          <Pagination.Last />
        </Group>
      </Pagination.Root>
    </>
  );
};

export default PaginationTable;
