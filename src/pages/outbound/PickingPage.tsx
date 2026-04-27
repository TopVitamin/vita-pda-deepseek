import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockPickingItems = [
  { id: '1', locationCode: 'A01-01-01', productCode: 'P001', productName: '面膜', barcode: 'BAR001', planQty: 50, pickedQty: 0, waitQty: 50, status: '待拣' },
  { id: '2', locationCode: 'A01-01-02', productCode: 'P003', productName: '口红', barcode: 'BAR003', planQty: 30, pickedQty: 0, waitQty: 30, status: '待拣' },
  { id: '3', locationCode: 'A01-02-01', productCode: 'P004', productName: '纸巾', barcode: 'BAR004', planQty: 100, pickedQty: 20, waitQty: 80, status: '部分拣货' },
  { id: '4', locationCode: 'A01-02-03', productCode: 'P006', productName: '保温杯', barcode: 'BAR006', planQty: 20, pickedQty: 0, waitQty: 20, status: '待拣' },
  { id: '5', locationCode: 'A02-01-01', productCode: 'P007', productName: '数据线', barcode: 'BAR007', planQty: 60, pickedQty: 0, waitQty: 60, status: '待拣' },
];

export default function PickingPage() {
  const navigate = useNavigate();
  const [taskNo, setTaskNo] = useState('');
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [items, setItems] = useState(mockPickingItems);
  const [scanLocation, setScanLocation] = useState('');
  const [scanBarcode, setScanBarcode] = useState('');
  const [pickingQty, setPickingQty] = useState(0);
  const [activeItem, setActiveItem] = useState<typeof mockPickingItems[0] | null>(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showShortage, setShowShortage] = useState(false);
  const [shortageQty, setShortageQty] = useState(0);
  const [shortageReason, setShortageReason] = useState('');

  const nextItem = items.find((i) => i.waitQty > 0);

  const handleLoadTask = () => {
    if (!taskNo.trim()) { setError('请输入拣货任务号'); return; }
    setError('');
    setItems(JSON.parse(JSON.stringify(mockPickingItems)));
    setTaskLoaded(true);
    const first = mockPickingItems.find((i) => i.waitQty > 0);
    if (first) setCurrentLocation(first.locationCode);
  };

  const handleScanLocation = () => {
    if (!scanLocation.trim()) return;
    const item = items.find((i) => i.locationCode === scanLocation.trim());
    if (item) {
      setCurrentLocation(scanLocation.trim());
      setScanSuccess(true);
      setError('');
      setTimeout(() => setScanSuccess(false), 1200);
    } else {
      setError('库位未在任务中');
    }
    setScanLocation('');
  };

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    if (!currentLocation) { setError('请先扫描库位'); setScanBarcode(''); return; }
    const item = items.find((i) => i.barcode === scanBarcode.trim() && i.locationCode === currentLocation);
    if (item) {
      if (item.waitQty <= 0) { setError(`${item.productName} 已全部拣完`); setScanBarcode(''); return; }
      setActiveItem(item);
      setPickingQty(item.waitQty);
      setShowShortage(false);
      setShortageQty(0);
      setShortageReason('');
      setError('');
      setScanBarcode('');
    } else {
      setError('该库位未找到此商品');
      setScanBarcode('');
    }
  };

  const handleConfirmPick = () => {
    if (!activeItem) return;
    if (pickingQty <= 0) { setError('拣货数量必须大于0'); return; }
    if (pickingQty > activeItem.waitQty) { setError(`拣货数量不能超过待拣数量(${activeItem.waitQty})`); return; }
    if (pickingQty < activeItem.waitQty) {
      if (!showShortage || shortageQty <= 0) { setShowShortage(true); return; }
    }
    setError('');

    const updated = items.map((it) =>
      it.id === activeItem.id
        ? { ...it, pickedQty: it.pickedQty + pickingQty, waitQty: Math.max(0, it.waitQty - pickingQty), status: it.waitQty - pickingQty <= 0 ? '已拣完' : '部分拣货' }
        : it
    );
    setItems(updated);
    setSuccess(`${activeItem.productName} 拣货 ${pickingQty} 件 ✓`);

    const next = updated.find((i) => i.waitQty > 0);
    if (next) {
      setCurrentLocation(next.locationCode);
    }
    setActiveItem(null);
    setPickingQty(0);
    setTimeout(() => setSuccess(''), 1500);
  };

  const handleSkip = () => {
    if (!activeItem) return;
    const updated = items.map((it) =>
      it.id === activeItem.id ? { ...it, status: '已跳过' } : it
    );
    setItems(updated);
    setActiveItem(null);
    setSuccess(`${activeItem.productName} 已跳过`);
    setTimeout(() => setSuccess(''), 1000);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">出库拣货</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">🧺 拣货任务号</label>
          <div className="flex gap-2">
            <input type="text" value={taskNo} onChange={(e) => setTaskNo(e.target.value)} placeholder="扫描或输入拣货任务号"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
            <button onClick={handleLoadTask} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">查询</button>
          </div>
        </div>

        {taskLoaded && (
          <>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-base font-bold text-gray-800">PK-20260427-001</p>
              <div className="flex gap-4 mt-1 text-sm">
                <span>出库单: SO20260427001</span>
                <span>波次: WAVE001</span>
                <span>进度: {items.reduce((s, i) => s + i.pickedQty, 0)}/{items.reduce((s, i) => s + i.planQty, 0)}</span>
              </div>
            </div>

            {/* Current location highlight */}
            {currentLocation && (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center">
                <p className="text-sm text-green-600">📍 当前应前往库位</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{currentLocation}</p>
              </div>
            )}

            {nextItem && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                <p className="text-sm text-orange-600">📦 当前应拣商品</p>
                <p className="text-lg font-bold text-orange-800">{nextItem.productName} ({nextItem.productCode})</p>
                <p className="text-sm text-orange-600">待拣: {nextItem.waitQty}件 | 条码: {nextItem.barcode}</p>
              </div>
            )}

            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base font-medium">{success}</div>}

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📍 扫描库位</label>
              <input type="text" value={scanLocation} onChange={(e) => setScanLocation(e.target.value)}
                placeholder="扫描或输入库位码"
                className={`w-full h-12 px-4 text-base border-2 rounded-lg outline-none ${scanSuccess ? 'border-green-500 bg-green-50' : 'border-gray-300 focus:border-blue-500'}`}
                onKeyDown={(e) => e.key === 'Enter' && handleScanLocation()} autoFocus />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
              <input type="text" value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)}
                placeholder="扫描或输入商品条码"
                className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()} />
            </div>

            {activeItem && (
              <div className="bg-white border-2 border-blue-400 rounded-xl p-4 shadow-md">
                <p className="text-lg font-bold text-gray-800">{activeItem.productName}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <span>待拣: <b className="text-orange-600">{activeItem.waitQty}</b></span>
                </div>

                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-600 mb-1 block">拣货数量</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPickingQty(Math.max(0, pickingQty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                    <input type="number" value={pickingQty} onChange={(e) => setPickingQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none" />
                    <button onClick={() => setPickingQty(Math.min(activeItem.waitQty, pickingQty + 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
                  </div>
                </div>

                {showShortage && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-700 mb-2">缺货登记</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">缺货数量:</span>
                      <input type="number" value={shortageQty} onChange={(e) => setShortageQty(parseInt(e.target.value) || 0)}
                        className="w-20 h-9 px-2 text-sm border border-gray-300 rounded outline-none" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 block mb-1">缺货原因:</span>
                      <select value={shortageReason} onChange={(e) => setShortageReason(e.target.value)}
                        className="w-full h-9 px-2 text-sm border border-gray-300 rounded outline-none">
                        <option value="">请选择</option>
                        <option value="库存不足">库存不足</option>
                        <option value="商品破损">商品破损</option>
                        <option value="找不到商品">找不到商品</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button onClick={handleSkip} className="flex-1 h-11 border border-gray-300 text-gray-600 rounded-lg text-sm active:bg-gray-50">跳过</button>
                  <button onClick={handleConfirmPick} className="flex-1 h-11 bg-blue-600 text-white rounded-lg text-base font-medium active:bg-blue-700">
                    确认拣货 {pickingQty}件
                  </button>
                </div>
              </div>
            )}

            <div>
              <p className="text-base font-bold text-gray-800 mb-2">待拣商品 ({items.filter(i => i.waitQty > 0).length}项)</p>
              <div className="space-y-1.5">
                {items.map((it) => (
                  <div key={it.id} className={`bg-white rounded-lg p-2.5 border ${activeItem?.id === it.id ? 'border-blue-400' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="text-sm font-bold">{it.productName}</span>
                        <span className="text-xs text-gray-400 ml-2">库位: {it.locationCode}</span>
                      </div>
                      <span className={`text-xs font-bold ${it.waitQty > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {it.waitQty > 0 ? `${it.pickedQty}/${it.planQty}` : '✓'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {taskLoaded && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
          <button
            onClick={() => { setSuccess('拣货任务完成！'); setTimeout(() => navigate('/home'), 1000); }}
            className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg active:bg-blue-700"
          >
            完成拣货
          </button>
        </div>
      )}
    </div>
  );
}
