import { createHashRouter, Navigate } from 'react-router-dom';
import MobileLayout from '../layouts/MobileLayout';
import LoginPage from '../pages/auth/LoginPage';
import SelectWarehousePage from '../pages/warehouse/SelectWarehousePage';
import HomePage from '../pages/home/HomePage';
import TaskCenterPage from '../pages/tasks/TaskCenterPage';
import MyTaskPage from '../pages/tasks/MyTaskPage';
import ExceptionTaskPage from '../pages/tasks/ExceptionTaskPage';
import ReceivePage from '../pages/inbound/ReceivePage';
import QcPage from '../pages/inbound/QcPage';
import PutawayPage from '../pages/inbound/PutawayPage';
import PickingPage from '../pages/outbound/PickingPage';
import SortingPage from '../pages/outbound/SortingPage';
import RecheckPage from '../pages/outbound/RecheckPage';
import PackingPage from '../pages/outbound/PackingPage';
import ShipPage from '../pages/outbound/ShipPage';
import MovePage from '../pages/warehouse/MovePage';
import ReplenishPage from '../pages/warehouse/ReplenishPage';
import CountingExecutePage from '../pages/counting/CountingExecutePage';
import InventoryQueryPage from '../pages/query/InventoryQueryPage';
import LocationInventoryPage from '../pages/query/LocationInventoryPage';
import SystemSettingsPage from '../pages/settings/SystemSettingsPage';
import ParamsSettingsPage from '../pages/settings/ParamsSettingsPage';
import DeviceSettingsPage from '../pages/settings/DeviceSettingsPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'select-warehouse', element: <SelectWarehousePage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'tasks', element: <TaskCenterPage /> },
      { path: 'tasks/my', element: <MyTaskPage /> },
      { path: 'tasks/exception', element: <ExceptionTaskPage /> },
      { path: 'inbound/receive', element: <ReceivePage /> },
      { path: 'inbound/qc', element: <QcPage /> },
      { path: 'inbound/putaway', element: <PutawayPage /> },
      { path: 'outbound/picking', element: <PickingPage /> },
      { path: 'outbound/sorting', element: <SortingPage /> },
      { path: 'outbound/recheck', element: <RecheckPage /> },
      { path: 'outbound/packing', element: <PackingPage /> },
      { path: 'outbound/ship', element: <ShipPage /> },
      { path: 'warehouse/move', element: <MovePage /> },
      { path: 'warehouse/replenish', element: <ReplenishPage /> },
      { path: 'counting/execute', element: <CountingExecutePage /> },
      { path: 'query/inventory', element: <InventoryQueryPage /> },
      { path: 'query/location-inventory', element: <LocationInventoryPage /> },
      { path: 'settings/system', element: <SystemSettingsPage /> },
      { path: 'settings/params', element: <ParamsSettingsPage /> },
      { path: 'settings/device', element: <DeviceSettingsPage /> },
    ],
  },
]);
