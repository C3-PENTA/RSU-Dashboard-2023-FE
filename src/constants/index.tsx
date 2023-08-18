import { Path } from '@/config/path';
import Home from '@/assets/icons/Home';
import Setting from '@/assets/icons/Setting';
import Policy from '@/assets/icons/Policy';
import System from '@/assets/icons/System';
import Event from '@/assets/icons/Event';

export const SERVER_STATUS = {
  NORMAL: 'normal',
  ERROR: 'error',
  NOT_WORK: 'notWork',
};

export const CERTIFICATE_ISSUE = {
  NONE: 'None',
  NO_CERT: 'No Certificate',
  EXPIRED: 'Certificate Expired',
};

export const MAIN_LINK = [
  {
    id: 'dashboard',
    icon: (status: boolean) => <Home status={status} />,
    label: '대시보드',
    path: Path.DASHBOARD,
    items: [
      {
        id: 'system_status',
        icon: (status: boolean) => <System status={status} />,
        label: '시스템 현황',
        path: Path.SYSTEM,
      },
      {
        id: 'event_status',
        icon: (status: boolean) => <Event status={status} />,
        label: '이벤트 현황',
        path: Path.EVENT,
      },
    ],
  },
  {
    id: 'policy',
    icon: (status: boolean) => <Policy status={status} />,
    label: '정책 설정',
    path: Path.POLICY,
  },
  {
    id: 'environment_setting',
    icon: (status: boolean) => <Setting status={status} />,
    label: '환경 설정',
    path: Path.ENV,
  },
];

export const TLS_STATUS = [
  {
    key: 'NONE',
    status: 'NONE',
    label: 'TLS_COMMUNICATIONS.STATUS.NONE',
    color: '#868E96',
  },
  {
    key: 'TLS',
    status: 'TLS',
    label: 'TLS_COMMUNICATIONS.STATUS.TLS',
    color: '#20C997',
  },
  {
    key: 'IMPOSSIBLE',
    status: 'IMPOSSIBLE',
    label: 'TLS_COMMUNICATIONS.STATUS.IMPOSSIBLE',
    color: '#FCC419',
  },
];

export const AUTHEN_TYPE = {
  LOGIN: '제출하다',
  REGISTER: 'register',
};

export const AUTHEN_QUOTE = {
  WELCOME: '지능형 RSU 통합 모니터링 시스템',
  EMAIL: 'Email',
  USERNAME: '사용자 이름',
  PASSWORD: '비밀번호',
  CONFIRM_PASSWORD: '비밀번호 확인',
  INVALID_EMAIL: 'Invalid email',
  INVALID_EMAIL_KOR: '무효한 이메일입니다',
  INVALID_PASSWORD: `비밀번호 설정 규칙:
  - 비밀번호의 길이는 최소 6자리 이상으로 설정
  - 비밀헌호는 반드시 1개 이상의 대문자(A-Z)를 포함하여야 합니다.
  - 비밀헌호는 반드시 1개 이상의 소문자(a-z)를 포함하여야 합니다.
  - 비밀헌호는 반드시 1개 이상의 숫자(0-9)를 포함하여야 합니다.
  - 비밀헌호는 반드시 1개 이상의 특수문자(!@#$%^&*)를 포함하여야 합니다.`,
  WRONG_CREDENTIAL: 'Sorry, your username and/or password are incorrect. Please try again.',
  WRONG_CREDENTIAL_KOR: '죄송합니다. 사용자 이름 및/또는 암호가 잘못되었습니다. 다시 시도하십시오.',
  INVALID_NAME: 'Invalid name',
  INVALID_NAME_KOR: '무효한 이름입니다.',
  INVALID_CONFIRM_PASSWORD: 'Passwords did not match',
  INVALID_CONFIRM_PASSWORD_KOR: '암호가 일치하지 않습니다.',
  NOT_AUTHORIZED: 'Not Authorized',
  NOT_AUTHORIZED_KOR: '승인되지 않음',
  NOT_AUTHORIZED_MESS: 'Sorry, You Are Not Allowed to Access This Page.',
  NOT_AUTHORIZED_MESS_KOR: '죄송합니다. 이 페이지를 접속 불가능합니다.',
};

export const PAGE_TITLE = {
  DASHBOARD_ENG: 'Dashboard',
  DASHBOARD_KOR: '계기반',
  MONITOR_ENG: 'Monitor',
  MONITOR_KOR: '모니터링',
  POLICY_END: 'Policy',
  POLICY_KOR: '정책',
  ENV_ENG: 'Environment Setting',
  ENV_KOR: '환경 설정​',
};

export const TABLE_HEADER_KOR = {
  USERNAME: '사용자 이름',
  NAME: '이름',
  EMAIL: '이메일​',
  ROLE: '역할',
  CREATED_AT: '생성일자​	',
  LAST_ACCESS: '마지막 접속 일자​	',
};

export const RSU_TITLE = 'Intelligent RSU integrate monitoring system';
export const RSU_TITLE_KOR = '지능형 RSU 통합 모니터링 시스템​';

export const LINE_CHART_TITLE = {
  RAM: 'RAM 활용량',
  CPU: 'CPU 활용량',
};

export const Role = {
  OPERATOR: 'OPERATOR',
  MANAGER: 'MANAGER',
  NORMAL: 'NORMAL',
};

export const LINE_CHART_TYPE = {
  HOUR: 'HOUR',
  DATE: 'DATE',
  MONTH: 'MONTH',
};

export const TOOLTIP_COLOR = {
  BACKGROUND: '#373E47',
  BORDER: '#CCCCCC',
};

export const PIE_CHART_COLOR = {
  USED: '#228B22',
  AVAILABLE: '#C0C2C9',
  NOT_ASSIGN: '#4D4E4F',
  OTHER: '#FFCE56',
  FULL: '#FF2400',
};

export const EVENT_CLICK_NAME = {
  REFRESH_BUTTON: 'refreshClick',
  ZOOM_IN_BUTTON: 'zoomInClick',
  ZOOM_OUT_BUTTON: 'zoomOutClick',
};

export const ENV_PAGE_QUOTE = {
  ROLE_FILTER_ENG: 'Role Filter',
  ROLE_FILTER_KOR: '역할 필터',
  PLACE_HOLDER_ROLE_FILTER_ENG: 'Pick all roles you want to show in list',
  PLACE_HOLDER_ROLE_FILTER_KOR: '목록에 표시할 모든 역할 선택',
  ADD_NEW_USER_BUTTON_ENG: 'Add New User',
  ADD_NEW_USER_BUTTON_KOR: '신규 사용자 추가',
  ADD_USER_BUTTON_ENG: 'Add User',
  ADD_USER_BUTTON_KOR: '시용자 추가',
  UPDATE_USER_INFO_TITLE_ENG: 'Update User Information',
  UPDATE_USER_INFO_TITLE_KOR: '사용자 정보 업데이트',
  UPDATE_BUTTON_ENG: 'Update',
  UPDATE_BUTTON_KOR: '업데이트',
  RESET_BUTTON_ENG: 'Reset',
  RESET_BUTTON_KOR: '초기화',
  CANCEL_BUTTON_ENG: 'Cancel',
  CANCEL_BUTTON_KOR: '취소',
  CONFIRM_BUTTON_ENG: 'Confirm',
  CONFIRM_BUTTON_KOR: '확인',
  CONFIRM_MODAL_TITLE_ENG: 'Please confirm your action',
  CONFIRM_MODAL_TITLE_KOR: '작업을 확인하십시오',
  CONFIRM_MODAL_DECR_ENG:
    'This action is so important that you are required to confirm it with a modal. Please click one of these buttons to proceed.',
  CONFIRM_MODAL_DECR_KOR:
    '이 작업은 매우 중요하므로 모달로 확인하여야 합니다. 계속하려면 다음 버튼 중 하나를 클릭하십시오.',
  RESET_MODAL_TITLE_ENG: 'Reset Password',
  RESET_MODAL_TITLE_KOR: '비밀번호 초기화',
  RESET_PASSWORD_BUTTON: 'Reset Password',
  RESET_PASSWORD_BUTTON_KOR: '비밀번호 초기화',
};

export const NOTIFICATIONS = {
  UPDATE_SUCCESSFUL_ENG: 'Updated successfully',
  UPDATE_SUCCESSFUL_KOR: '업데이트 성공했습니다.',
  SAVED_CHANGES_ENG: 'Your changes were saved',
  SAVED_CHANGES_KOR: '변경사항이 저장되었습니다.',
  USER_DELETED_ENG: 'User deleted',
  USER_DELETED_KOR: '사용자가 사젝되었습니다.',
  USER_CREATED_ENG: 'User created',
  USER_CREATED_KOR: '사용자 생성 완료되었습니다.',
  CONFLICT_ENG: 'Confilct',
  CONFLICT_KOR: '충돌',
  CONFLICT_MESS_ENG: 'Username already existed!',
  CONFLICT_MESS_KOR: '사용자 이름이 이미 존재합니다',
  RESET_PASSWORD_ENG: 'Reset password successfully',
  RESET_PASSWORD_KOR: '비밀번호 초기화 완료했습니다.',
  NOTICED: 'NOTICED',
  NOTICED_KOR: '공지되었습니다.',
  NOTICED_MESS: 'Choose file to download.',
  NOTICED__MESS_KOR: '다운로드 파일을 선택하십시오.',
  INVALID_INPUT: 'Invalid Input.',
  INVALID_INPUT_KOR: '다운로드 파일을 선택하십시오.',
};

export const EVENT_PAGE_QUOTE = {
  CHOOSE_DATE_ENG: 'Choose the date',
  CHOOSE_DATE_KOR: '날짜를 선택',
  CHOOSE_NODE_ID_ENG: 'Choose Node ID',
  CHOOSE_NODE_ID_KOR: 'Node ID를 선택',
  CHOOSE_MESSAGE_TYPE_ENG: 'Choose Message type',
  CHOOSE_MESSAGE_TYPE_KOR: '메시지 유형 선택',
  PAGE_SIZE_ENG: 'Page size',
  PAGE_SIZE_KOR: '페이지 사이즈',
  BUTTON_START: '활성화',
  BUTTON_STOP: '비활성화',
  NOTICED_START: '데이터 자동 생성이 비활성화 되었습니다. 데이터 자동 생성이 활성화 하시겠습니까? ',
  NOTICED_STOP: '데이터 자동 생성이 활성화 되었습니다. 데이터 자동 생성이 비활성화 하시겠습니까?',
  BUTTON_UPLOAD: '데이터 삽입',
  NOTICED_UPLOAD: '데이터 자동 생성이 활성화되었습니다. 파일을 가져오시겠습니까?',
  BUTTON_CLEAR_DATA: '데이터 삭제',
  NOTICED_CLEAR_DATA: '모든 레코드를 삭제하시겠습니까?',
  BUTTON_CONTINUE: '계속하다',
  BUTTON_CANCEL: '취소',
  WARNING: '경고',
};

export const AUTO_REFRESH_TIME = 60;
