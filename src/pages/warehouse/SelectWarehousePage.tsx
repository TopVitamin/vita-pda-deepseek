import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouseStore } from '../../store/warehouseStore';
import { useUserStore } from '../../store/userStore';
import type { Warehouse } from '../../types';

export default function SelectWarehousePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUserStore();
  const { selectWarehouse, loadWarehouses, currentWarehouse, warehouses, loading } = useWarehouseStore();

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  useEffect(() => {
    if (currentWarehouse) {
      navigate('/home', { replace: true });
    }
  }, [currentWarehouse, navigate]);

  const handleSelect = (wh: Warehouse) => {
    selectWarehouse(wh);
    navigate('/home', { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      standard: '标准仓', ecommerce: '电商仓', front: '前置仓',
      return: '退货仓', return_processing: '退货处理仓', bonded: '保税仓',
    };
    return map[type] || type;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-base">加载仓库列表...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">当前用户</p>
            <p className="text-lg font-bold text-gray-800">{currentUser?.name}</p>
            <p className="text-sm text-gray-400">{currentUser?.role}</p>
          </div>
          <button onClick={handleLogout} className="text-red-500 text-base border border-red-300 px-4 py-2 rounded-lg active:bg-red-50">
            退出
          </button>
        </div>
      </div>

      <p className="text-lg font-bold text-gray-800 mb-4">选择作业仓库</p>

      <div className="flex-1 space-y-3">
        {warehouses.map((wh) => (
          <button
            key={wh.warehouseId}
            onClick={() => handleSelect(wh)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:bg-blue-50 active:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-gray-800">{wh.name}</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">{getTypeLabel(wh.type)}</span>
                </div>
                <p className="text-sm text-gray-500">编码：{wh.code}</p>
                <p className="text-sm text-gray-400">{wh.orgName} · {wh.address}</p>
              </div>
              <div className="text-right ml-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                  <span className="text-xl font-bold text-blue-600">{wh.todayTaskCount}</span>
                </div>
                <p className="text-xs text-gray-400">今日待处理</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        维他仓库PDA v1.0.0
      </p>
    </div>
  );
}
