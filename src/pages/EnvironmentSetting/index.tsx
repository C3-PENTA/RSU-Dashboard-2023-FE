/* eslint-disable camelcase */
import { HeaderTitle, NoData, NotAuthorized } from '@/components';
import { ENV_PAGE_QUOTE, PAGE_TITLE, Role, TABLE_HEADER_KOR } from '@/constants';
import { IUserUpdate, User } from '@/interfaces/interfaceUser';
import { getListUser } from '@/services/EnvironmentSettingAPI';
import {
  Box,
  LoadingOverlay,
  Table,
  Text,
  Button,
  Group,
  Modal,
  MultiSelect,
  ScrollArea,
  createStyles,
  rem,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import moment from 'moment';
import { useEffect, useState, useContext } from 'react';
import { Edit, Trash, UserPlus } from 'tabler-icons-react';
import { ConfirmModal, Register } from './components';
import UpdateUserModal from './components/UpdateUserModal';
import { LoginContext } from '@/App';
import './Table.scss';

const initUpdateUser = {
  id: '',
  username: '',
  name: '',
  email: '',
  role: '',
  created_at: '',
  updated_at: '',
};

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colors.gray[6],
    transition: 'box-shadow 150ms ease',
    borderBottom: `${rem(1)} solid ${theme.colors['white-alpha'][2]}`,

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
  row: {
    backgroundColor: theme.colors.gray[7],
  },

  cell: {
    height: '40px',
    alignItems: 'center',
    borderBottom: `${rem(1)} solid ${theme.colors['white-alpha'][2]}`,
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));
const EnvironmentSetting = () => {
  const { setLoginState, currentUser } = useContext(LoginContext);
  const currentRole = currentUser.role.name;
  const isReadOnly = currentRole === Role.MANAGER;

  const [isAuthorized, setAuthorized] = useState(currentUser.role.name !== Role.NORMAL);
  const [users, setUsers] = useState<User[]>([]);
  const [loadedAPI, setLoadedAPI] = useState(false);
  const [isLoadingInternal, setLoadingInternal] = useState(false);
  const [showConfirmDeleteModal, toggleConfirmDeleteModal] = useToggle();
  const [showRegisterModal, toggleRegisterModal] = useToggle();
  const [showUpdateModal, toggleUpdateModal] = useToggle();
  const [userSelected, setUserSelected] = useState<IUserUpdate>({ role: 2 });
  const [userUpdateSelected, setUserUpdateSelected] = useState<User>(initUpdateUser);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoginState(currentUser.exp > Date.now() / 1000);
    if (currentUser.exp > Date.now() / 1000) {
      setLoadingInternal(true);
      getListUser().subscribe({
        next: ({ data }) => {
          setUsers(data);
          setLoadingInternal(false);
          setLoadedAPI(true);
        },
        error(err) {
          if (err.response.data.statusCode === 401 || err.response.data.statusCode === 401) {
            setAuthorized(false);
          }
          setLoadingInternal(false);
          setLoadedAPI(true);
        },
      });
    }
  };
  const onOpenConfirmDeleteModal = (user: IUserUpdate) => {
    setLoginState(currentUser.exp > Date.now() / 1000);
    toggleConfirmDeleteModal();
    setUserSelected(user);
  };
  const handleDelete = (userId: string, role: string) => {
    setLoginState(currentUser.exp > Date.now() / 1000);
    const roleNumber = role === Role.MANAGER ? 1 : 2;
    const user = {
      id: userId,
      role: roleNumber,
    };
    onOpenConfirmDeleteModal(user);
  };
  const onOpenUpdateModal = (user: User) => {
    setLoginState(currentUser.exp > Date.now() / 1000);
    toggleUpdateModal();
    setUserUpdateSelected(user);
  };
  const rows = users.map((user, i) => {
    if (roleFilter.length === 0 || roleFilter.includes(user.role)) {
      return (
        <tr className={cx(classes.row)} key={user.id} onDoubleClick={() => onOpenUpdateModal(user)}>
          <td className={cx(classes.cell)}>{i + 1}</td>
          <td className={cx(classes.cell)}>{user.username}</td>
          <td className={cx(classes.cell)}>{user.name}</td>
          <td className={cx(classes.cell)}>{user.email}</td>
          <td className={cx(classes.cell)}>{user.role}</td>
          <td className={cx(classes.cell)}>
            {moment(user.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </td>
          <td className={cx(classes.cell)}>
            {moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </td>
          <td className={cx(classes.cell)}>
            <Group align="center">
              <Button
                className="function-btn"
                variant="outline"
                radius={'md'}
                disabled={
                  isReadOnly && user.role !== Role.NORMAL && user.username !== currentUser.username
                }
                onClick={() => onOpenUpdateModal(user)}
              >
                <Edit size={14} color="white" />
              </Button>
              <Button
                className="function-btn"
                color="red"
                radius={'md'}
                disabled={user.role === Role.OPERATOR || currentRole === Role.MANAGER}
                onClick={() => handleDelete(user.id, user.role)}
              >
                <Trash size={14} />
              </Button>
            </Group>
          </td>
        </tr>
      );
    }
  });
  if (!isAuthorized || currentRole === Role.NORMAL || currentUser.exp < Date.now() / 1000) {
    return (
      <Box p={16} sx={{ height: '100%', borderRadius: 8 }}>
        <HeaderTitle label={PAGE_TITLE.ENV_KOR} />
        <NotAuthorized />
      </Box>
    );
  }
  return (
    <Box
      p={'16px'}
      sx={{ height: 'auto', borderRadius: 8, display: 'flex', flexDirection: 'column' }}
    >
      <Group position="apart">
        <HeaderTitle label={PAGE_TITLE.ENV_KOR} />
        <Button
          leftIcon={<UserPlus size={18} strokeWidth={2} color={'white'} />}
          m={'sm'}
          size={'sm'}
          sx={(theme) => ({
            borderRadius: theme.radius.md,
            backgroundColor: 'rgba(49, 130, 206, 1)',
          })}
          onClick={() => {
            toggleRegisterModal();
          }}
        >
          {ENV_PAGE_QUOTE.ADD_NEW_USER_BUTTON_KOR}
        </Button>
      </Group>
      <MultiSelect
        sx={{ width: '30% ', marginBottom: '2vh' }}
        data={[Role.OPERATOR, Role.MANAGER, Role.NORMAL]}
        value={roleFilter}
        onChange={setRoleFilter}
        label={<Text color="white">{ENV_PAGE_QUOTE.ROLE_FILTER_KOR}</Text>}
        placeholder={ENV_PAGE_QUOTE.PLACE_HOLDER_ROLE_FILTER_KOR}
        transitionProps={{ duration: 150, transition: 'pop-top-left', timingFunction: 'ease' }}
        maxSelectedValues={2}
        clearable
      />
      {users.length > 0 ? (
        <ScrollArea.Autosize
          mah={'60vh'}
          sx={(theme) => ({
            borderRadius: '16px',
            padding: '16px',
            backgroundColor: theme.colors.gray[7],
          })}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table id="list-user" className={cx(classes.text)} verticalSpacing={'xs'} miw={800}>
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
              style={{ zIndex: 1 }}
            >
              <tr>
                <th>IDX</th>
                <th>{TABLE_HEADER_KOR.USERNAME}</th>
                <th>{TABLE_HEADER_KOR.NAME}</th>
                <th>{TABLE_HEADER_KOR.EMAIL}</th>
                <th>{TABLE_HEADER_KOR.ROLE}</th>
                <th>{TABLE_HEADER_KOR.CREATED_AT}</th>
                <th>{TABLE_HEADER_KOR.LAST_ACCESS}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea.Autosize>
      ) : (
        loadedAPI && <NoData />
      )}
      <LoadingOverlay visible={isLoadingInternal} overlayBlur={2} sx={{ position: 'fixed' }} />
      <Modal
        title={<Text color="black">{ENV_PAGE_QUOTE.CONFIRM_MODAL_TITLE_KOR}</Text>}
        size="md"
        shadow={'xs'}
        onClose={toggleConfirmDeleteModal}
        opened={showConfirmDeleteModal}
      >
        <ConfirmModal
          action="Delete"
          onCloseParent={() => {
            return;
          }}
          onSave={getUsers}
          onClose={toggleConfirmDeleteModal}
          setLoading={setLoadingInternal}
          data={userSelected}
        />
      </Modal>
      {/* ADD USER */}
      <Modal
        title={
          <Text size={'md'} color="black" weight={500}>
            {ENV_PAGE_QUOTE.ADD_USER_BUTTON_KOR}
          </Text>
        }
        size="lg"
        shadow={'xs'}
        onClose={toggleRegisterModal}
        opened={showRegisterModal}
      >
        <Register getUsers={getUsers} onClose={toggleRegisterModal} role={currentRole} />
      </Modal>
      {/* UPDATE USER INFO */}
      <Modal
        title={
          <Text size={'lg'} color="black" weight={500}>
            {ENV_PAGE_QUOTE.UPDATE_USER_INFO_TITLE_KOR}
          </Text>
        }
        size="lg"
        shadow={'xs'}
        onClose={toggleUpdateModal}
        opened={showUpdateModal}
      >
        <UpdateUserModal
          onClose={toggleUpdateModal}
          onSave={getUsers}
          setLoading={setLoadingInternal}
          user={userUpdateSelected}
          role={currentRole}
        />
      </Modal>
    </Box>
  );
};

export default EnvironmentSetting;
