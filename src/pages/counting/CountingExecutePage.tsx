import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const mockItems = [
  { id: '1', locationCode: 'A01-01-01', productCode: 'P001', productName: '面膜', barcode: 'BAR001', bookQty: 45, actualQty: undefined as number | undefined, diffQty: undefined as number | undefined },
  { id: '2', locationCode: 'A01-01-02', productCode: 'P003', productName: '口红', barcode: 'BAR003', bookQty: 30, actualQty: undefined, diffQty: undefined },
  { id: '3', locationCode: 'A01-02-01', productCode: 'P004', productName: '纸巾', barcode: 'BAR004', bookQty: 80, actualQty: undefined, diffQty: undefined },
  { id: '4', locationCode: 'A01-02-03', productCode: 'P006', productName: '保温杯', barcode: 'BAR006', bookQty: 20, actualQty: 45, diffQty: 25 },
  { id: '5', locationCode: 'A02-01-01', productCode: 'P007', productName: '数据线', barcode: 'BAR007', bookQty: 60, actualQty: undefined, diffQty: undefined },
];

export default function CountingExecutePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskNo = searchParams.get('taskNo') || 'CNT-20260427-001';
  const [blindMode] = useState(false);
  const [items] = useState(mockItems);
  const [scanLocation, setScanLocation] = useState('');
  const [scanBarcode, setScanBarcode] = useState('');
  const [activeItem, setActiveItem] = useState<typeof mockItems[0] | null>(null);
  const [actualQty, setActualQty] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedItems, setSavedItems] = useState<Record<string, number>>({});

  const handleScanLocation = () => {
    if (!scanLocation.trim()) return;
    const item = items.find((i) => i.locationCode === scanLocation.trim());
    if (item) { setActiveItem(item); setActualQty(item.bookQty); setScanLocation(''); setError(''); }
    else { setError('未找到该库位'); setScanLocation(''); }
  };

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    const item = items.find((i) => i.barcode === scanBarcode.trim());
    if (item) { setActiveItem(item); setActualQty(item.bookQty); setScanBarcode(''); setError(''); }
    else { setError('未找到该商品条码'); setScanBarcode(''); }
  };

  const handleSave = () => {
    if (!activeItem) return;
    if (actualQty < 0) { setError('实盘数量不能为负数'); return; }
    setError('');
    const diff = actualQty - activeItem.bookQty;
    setSavedItems((prev) => ({ ...prev, [activeItem.id]: actualQty }));
    setSuccess(`${activeItem.productName}: 实盘${actualQty}, 账面${activeItem.bookQty}, ${diff >= 0 ? '盘盈' : '盘亏'}${Math.abs(diff)}`);
    setActiveItem(null); setActualQty(0);
    setTimeout(() => setSuccess(''), 2000);
  };

  const countedCount = Object.keys(savedItems).length;
  const isDiff = (id: string) => { const qty = savedItems[id]; if (qty === undefined) return false; const item = items.find((i) => i.id === id); return item && qty !== item.bookQty; };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3"><button onClick={() => navigate('/home')} className="text-white text-xl">←</button><span className="text-white text-lg font-bold">盘点录入</span></div>
        <div className="flex items-center justify-between text-white/80 text-sm">
          <span>{taskNo}</span>
          <span className="px-2 py-0.5 bg-white/20 rounded text-xs">{blindMode ? '盲盘模式' : '明盘模式'}</span>
          <span>已盘: {countedCount}/{items.length}</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base">{success}</div>}

        <div><label className="block text-base font-medium text-gray-700 mb-1">📍 扫描库位</label>
          <input type="text" value={scanLocation} onChange={(e) => setScanLocation(e.target.value)} placeholder="扫描库位码"
            className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleScanLocation()} autoFocus /></div>

        <div><label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
          <input type="text" value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)} placeholder="扫描或输入商品条码"
            className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()} /></div>

        {activeItem && (
          <div className="bg-white border-2 border-blue-400 rounded-xl p-4 shadow-md">
            <p className="text-lg font-bold">{activeItem.productName} ({activeItem.productCode})</p>
            <p className="text-sm text-gray-500">库位: {activeItem.locationCode} | 条码: {activeItem.barcode}</p>
            {!blindMode && (
              <p className="text-sm text-gray-500 mt-1">账面数量: <b className="text-gray-800">{activeItem.bookQty}</b></p>
            )}

            <div className="mt-3">
              <label className="text-sm font-medium text-gray-600 mb-1 block">实盘数量</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setActualQty(Math.max(0, actualQty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                <input type="number" value={actualQty} onChange={(e) => setActualQty(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none" />
                <button onClick={() => setActualQty(actualQty + 1)} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
              </div>
            </div>

            {!blindMode && actualQty > 0 && (
              <div className={`mt-3 p-3 rounded-lg ${actualQty === activeItem.bookQty ? 'bg-green-50 border border-green-200' : actualQty > activeItem.bookQty ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex justify-between text-sm">
                  <span>差异:</span>
                  <span className={`font-bold ${actualQty === activeItem.bookQty ? 'text-green-600' : actualQty > activeItem.bookQty ? 'text-green-600' : 'text-red-600'}`}>
                    {actualQty - activeItem.bookQty >= 0 ? '+' : ''}{actualQty - activeItem.bookQty}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>结果:</span>
                  <span className={`font-bold ${actualQty === activeItem.bookQty ? 'text-green-600' : actualQty > activeItem.bookQty ? 'text-green-600' : 'text-red-600'}`}>
                    {actualQty === activeItem.bookQty ? '平账' : actualQty > activeItem.bookQty ? '盘盈' : '盘亏'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={() => { setActiveItem(null); setActualQty(0); }} className="flex-1 h-11 border border-gray-300 text-gray-600 rounded-lg text-sm active:bg-gray-50">取消</button>
              <button onClick={handleSave} className="flex-1 h-11 bg-blue-600 text-white rounded-lg text-base font-medium active:bg-blue-700">保存</button>
            </div>
          </div>
        )}

        <div>
          <p className="text-base font-bold text-gray-800 mb-2">盘点清单</p>
          <div className="space-y-1.5">
            {items.map((it) => (
              <div key={it.id} className={`bg-white rounded-lg p-3 border ${savedItems[it.id] !== undefined ? (isDiff(it.id) ? 'border-orange-300' : 'border-green-300') : 'border-gray-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold">{it.productName}</span>
                    <span className="text-xs text-gray-400 ml-2">{it.locationCode}</span>
                  </div>
                  {savedItems[it.id] !== undefined ? (
                    <span className={`text-sm font-bold ${isDiff(it.id) ? 'text-orange-600' : 'text-green-600'}`}>
                      {savedItems[it.id]} {isDiff(it.id) ? `(差${(savedItems[it.id] ?? 0) - it.bookQty})` : '✓'}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">待盘</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
        <div className="flex gap-2">
          <button onClick={() => { setSuccess('草稿已保存'); setTimeout(() => setSuccess(''), 1000); }}
            className="flex-1 h-12 border border-blue-300 text-blue-600 text-base font-medium rounded-lg active:bg-blue-50">保存草稿</button>
          <button onClick={() => { setSuccess('盘点结果已提交！'); setTimeout(() => navigate('/home'), 1200); }}
            className="flex-1 h-12 bg-blue-600 text-white text-base font-medium rounded-lg active:bg-blue-700">提交盘点</button>
        </div>
      </div>
    </div>
  );
}
