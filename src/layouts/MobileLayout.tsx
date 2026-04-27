import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useWarehouseStore } from '../store/warehouseStore';

export default function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useUserStore();
  const { currentWarehouse } = useWarehouseStore();

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isSelectWarehouse = location.pathname === '/select-warehouse';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col">
        <Outlet />
      </div>
    );
  }

  if (isSelectWarehouse) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Outlet />
      </div>
    );
  }

  if (!currentWarehouse && isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[480px] mx-auto shadow-lg">
      <div className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </div>
    </div>
  );
}
