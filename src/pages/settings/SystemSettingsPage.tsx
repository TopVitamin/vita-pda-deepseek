import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const userInfo = {
  name: '张伟', role: '仓库操作员', phone: '138-0000-1234',
  warehouse: '北京1号仓 (BJG-01)', position: '收货组-A班',
  shift: '白班 08:00-17:00', deviceId: 'PDA-BJG01-0032', pdaId: 'PDA-X9-2026-032',
  version: 'v1.0.0',
};

const SystemSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clearConfirm, setClearConfirm] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleClearCache = () => {
    if (!clearConfirm) { setClearConfirm(true); setTimeout(() => setClearConfirm(false), 3000); return; }
    setClearConfirm(false);
    setSuccessMsg('缓存已清除');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleLogout = () => {
    if (!logoutConfirm) { setLogoutConfirm(true); setTimeout(() => setLogoutConfirm(false), 3000); return; }
    setLogoutConfirm(false);
    setSuccessMsg('已退出登录');
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col max-w-[480px] mx-auto">
      <div className="bg-blue-600 text-white flex items-center gap-3 px-4 py-3 min-h-[44px]">
        <button onClick={() => navigate('/home')} className="text-white text-lg leading-none min-w-[44px] min-h-[44px] flex items-center justify-center">&larr;</button>
        <h1 className="text-lg font-semibold">系统设置</h1>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {successMsg && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">用户信息</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-500">姓名</div><div className="font-medium">{userInfo.name}</div>
            <div className="text-gray-500">角色</div><div>{userInfo.role}</div>
            <div className="text-gray-500">联系电话</div><div>{userInfo.phone}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">工作信息</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-500">当前仓库</div><div>{userInfo.warehouse}</div>
            <div className="text-gray-500">岗位</div><div>{userInfo.position}</div>
            <div className="text-gray-500">班次</div><div>{userInfo.shift}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">设备信息</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-500">设备ID</div><div className="text-xs">{userInfo.deviceId}</div>
            <div className="text-gray-500">PDA编号</div><div>{userInfo.pdaId}</div>
            <div className="text-gray-500">当前版本</div><div className="text-blue-600">{userInfo.version}</div>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button onClick={handleClearCache} className={`flex-1 py-3 rounded-lg text-sm font-medium min-h-[44px] ${clearConfirm ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-300'}`}>
            {clearConfirm ? '确认清除?' : '清除缓存'}
          </button>
          <button onClick={handleLogout} className={`flex-1 py-3 rounded-lg text-sm font-medium min-h-[44px] ${logoutConfirm ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-300'}`}>
            {logoutConfirm ? '确认退出?' : '退出登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
