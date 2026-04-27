import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useWarehouseStore } from '../../store/warehouseStore';

interface MenuGroup {
  title: string;
  items: { label: string; path: string; icon: string; count?: number }[];
}

const taskCounts: Record<string, number> = {
  '/inbound/receive': 5,
  '/inbound/qc': 2,
  '/inbound/putaway': 3,
  '/outbound/picking': 8,
  '/outbound/sorting': 4,
  '/outbound/recheck': 3,
  '/outbound/packing': 6,
  '/outbound/ship': 1,
  '/warehouse/move': 2,
  '/warehouse/replenish': 3,
  '/counting/execute': 4,
};

const baseMenuGroups: MenuGroup[] = [
  {
    title: '入库作业',
    items: [
      { label: '入库收货', path: '/inbound/receive', icon: '📥' },
      { label: '入库质检', path: '/inbound/qc', icon: '🔍' },
      { label: '上架', path: '/inbound/putaway', icon: '📤' },
    ],
  },
  {
    title: '出库作业',
    items: [
      { label: '拣货', path: '/outbound/picking', icon: '🧺' },
      { label: '分拣', path: '/outbound/sorting', icon: '📊' },
      { label: '复核', path: '/outbound/recheck', icon: '✅' },
      { label: '装箱', path: '/outbound/packing', icon: '📦' },
      { label: '发运', path: '/outbound/ship', icon: '🚚' },
    ],
  },
  {
    title: '库内作业',
    items: [
      { label: '移库', path: '/warehouse/move', icon: '🔄' },
      { label: '补货', path: '/warehouse/replenish', icon: '📥' },
    ],
  },
  {
    title: '盘点作业',
    items: [
      { label: '盘点录入', path: '/counting/execute', icon: '✏️' },
    ],
  },
  {
    title: '查询中心',
    items: [
      { label: '库存查询', path: '/query/inventory', icon: '🔎' },
      { label: '库位库存', path: '/query/location-inventory', icon: '🏠' },
    ],
  },
  {
    title: '系统设置',
    items: [
      { label: '系统配置', path: '/settings/system', icon: '⚙️' },
      { label: '参数配置', path: '/settings/params', icon: '🔧' },
      { label: '设备信息', path: '/settings/device', icon: '📱' },
    ],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUserStore();
  const { currentWarehouse } = useWarehouseStore();
  const [today] = useState(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }));
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const menuGroups = useMemo(() => {
    return baseMenuGroups.map((g) => ({
      ...g,
      items: g.items.map((item) => ({
        ...item,
        count: taskCounts[item.path],
      })),
    }));
  }, []);

  const toggleGroup = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold">{currentWarehouse?.name}</span>
              <button onClick={() => navigate('/select-warehouse')} className="text-blue-200 text-xs border border-blue-300 px-2 py-0.5 rounded">
                切换
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-0.5">{currentUser?.name} · {currentUser?.role} · {today}</p>
          </div>
          <button onClick={handleLogout} className="text-white/80 text-sm px-3 py-1.5 rounded-lg border border-white/30 active:bg-white/10">
            退出
          </button>
        </div>

        {/* Today summary */}
        <div className="flex gap-3 mt-3">
          <div className="bg-white/20 rounded-lg px-4 py-2 flex-1 text-center">
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-xs text-blue-100">待作业</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 flex-1 text-center">
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-blue-100">作业中</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 flex-1 text-center">
            <p className="text-2xl font-bold text-white">15</p>
            <p className="text-xs text-blue-100">今日已完成</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 flex-1 text-center">
            <p className="text-2xl font-bold text-orange-300">2</p>
            <p className="text-xs text-blue-100">异常</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => navigate('/tasks')} className="flex-1 bg-white text-blue-700 text-sm font-medium py-2 rounded-lg active:bg-blue-50">
            任务中心
          </button>
          <button onClick={() => navigate('/tasks/my')} className="flex-1 bg-white/80 text-blue-700 text-sm font-medium py-2 rounded-lg active:bg-white">
            我的任务
          </button>
          <button onClick={() => navigate('/tasks/exception')} className="flex-1 bg-orange-100 text-orange-700 text-sm font-medium py-2 rounded-lg active:bg-orange-200">
            异常任务
          </button>
        </div>
      </div>

      {/* Menu groups */}
      <div className="flex-1 px-3 py-4 space-y-3">
        {menuGroups.map((group) => {
          const isCollapsed = collapsed[group.title];
          return (
            <div key={group.title} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-50"
              >
                <span className="text-base font-bold text-gray-800">{group.title}</span>
                <span className={`text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {!isCollapsed && (
                <div className="grid grid-cols-3 gap-2 px-3 pb-3">
                  {group.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="relative flex flex-col items-center py-3 px-2 rounded-lg active:bg-blue-50"
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-xs text-gray-700 text-center leading-tight">{item.label}</span>
                      {item.count && item.count > 0 && (
                        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
