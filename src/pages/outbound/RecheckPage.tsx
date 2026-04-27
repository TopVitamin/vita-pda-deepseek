import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockRecheckItems = [
  { id: '1', productCode: 'P001', productName: '面膜', barcode: 'BAR001', planQty: 20, checkedQty: 0, diffType: '' },
  { id: '2', productCode: 'P003', productName: '口红', barcode: 'BAR003', planQty: 15, checkedQty: 0, diffType: '' },
  { id: '3', productCode: 'P004', productName: '纸巾', barcode: 'BAR004', planQty: 30, checkedQty: 30, diffType: '' },
];

const diffTypes = ['多货', '少货', '错货', '商品破损', '批次不符'];

export default function RecheckPage() {
  const navigate = useNavigate();
  const [taskNo, setTaskNo] = useState('');
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [scanBarcode, setScanBarcode] = useState('');
  const [activeItem, setActiveItem] = useState<typeof mockRecheckItems[0] | null>(null);
  const [recheckQty, setRecheckQty] = useState(0);
  const [diffType, setDiffType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoadTask = () => {
    if (!taskNo.trim()) { setError('请输入复核任务号'); return; }
    setError('');
    setTaskLoaded(true);
  };

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    const item = mockRecheckItems.find((i) => i.barcode === scanBarcode.trim());
    if (item) {
      setActiveItem(item);
      setRecheckQty(item.planQty);
      setDiffType('');
      setError('');
    } else {
      setError('该商品不在复核任务中');
    }
    setScanBarcode('');
  };

  const handleConfirm = () => {
    if (!activeItem) return;
    if (recheckQty !== activeItem.planQty && !diffType) {
      setError('复核数量与应复核数不一致，请选择差异类型');
      return;
    }
    setError('');
    setSuccess(`${activeItem.productName} 复核完成 ✓`);
    setActiveItem(null);
    setTimeout(() => setSuccess(''), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">复核</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">✅ 复核任务号</label>
          <div className="flex gap-2">
            <input type="text" value={taskNo} onChange={(e) => setTaskNo(e.target.value)} placeholder="扫描或输入复核任务号"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleLoadTask()} />
            <button onClick={handleLoadTask} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">查询</button>
          </div>
        </div>

        {taskLoaded && (
          <>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-base font-bold">RCK-20260427-001</p>
              <div className="flex gap-4 mt-1 text-sm">
                <span>订单: SO20260427003</span>
                <span>应复核: {mockRecheckItems.reduce((s, i) => s + i.planQty, 0)}件</span>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base font-medium">{success}</div>}

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
              <input type="text" value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)} placeholder="扫描或输入商品条码"
                className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()} autoFocus />
            </div>

            {activeItem && (
              <div className="bg-white border-2 border-blue-400 rounded-xl p-4 shadow-md">
                <p className="text-lg font-bold">{activeItem.productName}</p>
                <p className="text-sm text-gray-500">条码: {activeItem.barcode} | 应复核: {activeItem.planQty}件</p>

                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-600 mb-1 block">复核数量</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setRecheckQty(Math.max(0, recheckQty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                    <input type="number" value={recheckQty} onChange={(e) => setRecheckQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`flex-1 h-12 text-center text-xl font-bold border rounded-lg outline-none ${recheckQty !== activeItem.planQty ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'}`} />
                    <button onClick={() => setRecheckQty(recheckQty + 1)} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
                  </div>
                  {recheckQty !== activeItem.planQty && (
                    <p className="text-red-600 text-sm mt-1">⚠ 数量不符！应复核 {activeItem.planQty} 件</p>
                  )}
                </div>

                {recheckQty !== activeItem.planQty && (
                  <div className="mt-3">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">差异类型</label>
                    <div className="flex flex-wrap gap-2">
                      {diffTypes.map((d) => (
                        <button key={d} onClick={() => setDiffType(d)}
                          className={`px-3 py-1.5 rounded-lg text-sm border ${diffType === d ? 'bg-red-100 border-red-400 text-red-700' : 'bg-white border-gray-300 text-gray-600'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={handleConfirm} className="w-full h-11 bg-blue-600 text-white rounded-lg text-base font-medium mt-4 active:bg-blue-700">
                  确认复核
                </button>
              </div>
            )}

            <div>
              <p className="text-base font-bold text-gray-800 mb-2">复核明细</p>
              <div className="space-y-2">
                {mockRecheckItems.map((it) => (
                  <div key={it.id} className="bg-white rounded-lg p-3 border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">{it.productName}</p>
                      <p className="text-xs text-gray-500">应复核: {it.planQty}件</p>
                    </div>
                    <span className={`text-xs font-bold ${it.checkedQty === it.planQty ? 'text-green-600' : it.diffType ? 'text-red-600' : 'text-gray-400'}`}>
                      {it.checkedQty === it.planQty ? '✓ 完成' : it.diffType || '待复核'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {taskLoaded && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
          <button onClick={() => { setSuccess('复核完成！'); setTimeout(() => navigate('/home'), 1000); }}
            className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg active:bg-blue-700">
            完成复核
          </button>
        </div>
      )}
    </div>
  );
}
