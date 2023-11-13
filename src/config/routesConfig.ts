import { lazy } from 'react';
import { IRoute } from '@/interfaces/interfaceCommon';
import { Path } from './path';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Policy = lazy(() => import('../pages/Policy'));
const SystemStatus = lazy(() => import('../pages/SystemStatus'));
const EventStatus = lazy(() => import('../pages/EventStatus'));
const EnvironmentSetting = lazy(() => import('../pages/EnvironmentSetting'));
const DoorStatus = lazy(() => import('../pages/Sensor'));

const routesConfig: IRoute[] = [
  {
    path: Path.DASHBOARD,
    component: Dashboard,
  },
  {
    path: Path.POLICY,
    component: Policy,
  },
  {
    path: Path.SYSTEM,
    component: SystemStatus,
  },
  {
    path: Path.UNDEFINED,
    component: NotFound,
  },
  {
    path: Path.EVENT,
    component: EventStatus,
  },
  {
    path: Path.SENSOR,
    component: DoorStatus,
  },
  {
    path: Path.ENV,
    component: EnvironmentSetting,
  },
];

export default routesConfig;
