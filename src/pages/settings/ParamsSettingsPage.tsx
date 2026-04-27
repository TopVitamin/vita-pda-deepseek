import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ToggleSettings {
  scanAutoSubmit: boolean;
  soundHint: boolean;
  vibrationHint: boolean;
  defaultQtyOne: boolean;
  autoJumpNext: boolean;
  showSensitiveFields: boolean;
}

const ParamsSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ToggleSettings>({
    scanAutoSubmit: true, soundHint: true, vibrationHint: false,
    defaultQtyOne: true, autoJumpNext: true, showSensitiveFields: false,
  });
  const [pageSize, setPageSize] = useState(20);
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const toggle = (key: keyof ToggleSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSuccessMsg('参数已保存'); setTimeout(() => setSuccessMsg(''), 2000); }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col max-w-[480px] mx-auto pb-24">
      <div className="bg-blue-600 text-white flex items-center gap-3 px-4 py-3 min-h-[44px]">
        <button onClick={() => navigate('/home')} className="text-white text-lg leading-none min-w-[44px] min-h-[44px] flex items-center justify-center">&larr;</button>
        <h1 className="text-lg font-semibold">参数设置</h1>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {successMsg && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
          <ToggleRow label="扫码自动提交" description="扫描完成后自动提交数据" checked={settings.scanAutoSubmit} onChange={() => toggle('scanAutoSubmit')} />
          <ToggleRow label="声音提示" description="操作成功/失败时播放声音" checked={settings.soundHint} onChange={() => toggle('soundHint')} />
          <ToggleRow label="震动提示" description="操作成功/失败时震动反馈" checked={settings.vibrationHint} onChange={() => toggle('vibrationHint')} />
          <ToggleRow label="默认数量为1" description="新建操作时数量默认为1" checked={settings.defaultQtyOne} onChange={() => toggle('defaultQtyOne')} />
          <ToggleRow label="扫码后自动跳转下一输入框" description="扫码完成后自动聚焦下一个输入框" checked={settings.autoJumpNext} onChange={() => toggle('autoJumpNext')} />
          <ToggleRow label="显示库存敏感字段" description="列表中显示库存数量等敏感信息" checked={settings.showSensitiveFields} onChange={() => toggle('showSensitiveFields')} />
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <div className="text-sm text-gray-800">每页列表数量</div>
              <div className="text-xs text-gray-400">设置列表分页大小(10-100)</div>
            </div>
            <input type="number" value={pageSize} onChange={e => setPageSize(Math.max(10, Math.min(100, parseInt(e.target.value) || 20)))} className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-base text-center min-h-[44px] focus:outline-none focus:border-blue-600" min={10} max={100} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-200 px-4 py-3">
        <button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium min-h-[44px] disabled:opacity-50">
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
};

const ToggleRow: React.FC<{ label: string; description: string; checked: boolean; onChange: () => void }> = ({ label, description, checked, onChange }) => (
  <div className="flex justify-between items-center px-4 py-3 cursor-pointer" onClick={onChange}>
    <div className="flex-1">
      <div className="text-sm text-gray-800">{label}</div>
      <div className="text-xs text-gray-400">{description}</div>
    </div>
    <div className={`w-12 h-7 rounded-full transition-colors ml-3 flex items-center ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
  </div>
);

export default ParamsSettingsPage;
