import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const deviceInfo = {
  deviceId: 'PDA-BJG01-0032',
  browser: 'Chrome/120.0.0.0 Mobile Safari/537.36',
  screen: '390 x 844 (DPR: 3)',
  version: 'v1.0.0',
  network: 'WiFi (已连接)',
  user: '张伟',
  warehouse: '北京1号仓 (BJG-01)',
};

const DeviceSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [checking, setChecking] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleClearCache = () => {
    if (!clearConfirm) { setClearConfirm(true); setTimeout(() => setClearConfirm(false), 3000); return; }
    setClearConfirm(false);
    setSuccessMsg('本地缓存已清除');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleCheckUpdate = () => {
    setChecking(true);
    setTimeout(() => { setChecking(false); setSuccessMsg('当前已是最新版本 v1.0.0'); setTimeout(() => setSuccessMsg(''), 2000); }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col max-w-[480px] mx-auto">
      <div className="bg-blue-600 text-white flex items-center gap-3 px-4 py-3 min-h-[44px]">
        <button onClick={() => navigate('/home')} className="text-white text-lg leading-none min-w-[44px] min-h-[44px] flex items-center justify-center">&larr;</button>
        <h1 className="text-lg font-semibold">设备信息</h1>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {successMsg && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">设备详情</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-500">设备编号</div><div className="font-medium">{deviceInfo.deviceId}</div>
            <div className="text-gray-500">浏览器信息</div><div className="text-xs break-all">{deviceInfo.browser}</div>
            <div className="text-gray-500">屏幕尺寸</div><div>{deviceInfo.screen}</div>
            <div className="text-gray-500">当前版本</div><div className="text-blue-600 font-medium">{deviceInfo.version}</div>
            <div className="text-gray-500">网络状态</div><div className="text-green-600">{deviceInfo.network}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">运行环境</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-500">当前用户</div><div>{deviceInfo.user}</div>
            <div className="text-gray-500">当前仓库</div><div>{deviceInfo.warehouse}</div>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button onClick={handleClearCache} className={`flex-1 py-3 rounded-lg text-sm font-medium min-h-[44px] ${clearConfirm ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-300'}`}>
            {clearConfirm ? '确认清除?' : '清除本地缓存'}
          </button>
          <button onClick={handleCheckUpdate} disabled={checking} className="flex-1 bg-white text-blue-600 border border-blue-600 py-3 rounded-lg text-sm font-medium min-h-[44px] disabled:opacity-50">
            {checking ? '检查中...' : '模拟检查更新'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSettingsPage;
