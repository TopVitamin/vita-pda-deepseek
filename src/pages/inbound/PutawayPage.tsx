import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '@/mock/products';

const mockPutawayItems = [
  { id: '1', productCode: 'SKU00001', productName: '面膜', barcode: 'BAR001', batchNo: 'B20260427', planQty: 100, doneQty: 0, waitQty: 100, targetLocation: '' },
  { id: '2', productCode: 'SKU00002', productName: '洗面奶', barcode: 'BAR002', batchNo: 'B20260427', planQty: 200, doneQty: 30, waitQty: 170, targetLocation: '' },
  { id: '3', productCode: 'SKU00003', productName: '口红', barcode: 'BAR003', batchNo: 'B20260426', planQty: 150, doneQty: 0, waitQty: 150, targetLocation: '' },
];

const steps = ['扫商品', '扫库位', '输入数量', '确认上架'];

export default function PutawayPage() {
  const navigate = useNavigate();
  const [taskNo, setTaskNo] = useState('');
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [items, setItems] = useState(mockPutawayItems);
  const [activeItem, setActiveItem] = useState<typeof mockPutawayItems[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [scanBarcode, setScanBarcode] = useState('');
  const [scanLocation, setScanLocation] = useState('');
  const [putawayQty, setPutawayQty] = useState(0);
  const [suggestLocation] = useState('A01-02-03');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLoadTask = () => {
    if (!taskNo.trim()) { setError('请输入上架任务号'); return; }
    setError('');
    setItems(JSON.parse(JSON.stringify(mockPutawayItems)));
    setTaskLoaded(true);
  };

  const productByBarcode = useMemo(() => {
    const map: Record<string, (typeof mockProducts)[0]> = {};
    mockProducts.forEach((p) => { map[p.barcode] = p; });
    return map;
  }, []);

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    const barcode = scanBarcode.trim();

    // 先在上架任务商品中查找
    const item = items.find((i) => i.barcode === barcode);
    if (item) {
      if (item.waitQty <= 0) { setError(`${item.productName} 已全部上架`); setScanBarcode(''); return; }
      setActiveItem(item);
      setPutawayQty(1);
      setScanLocation('');
      setScanBarcode('');
      setCurrentStep(1);
      setError('');
      return;
    }

    // 在商品主数据中查找
    const product = productByBarcode[barcode];
    if (product) {
      setError(`商品「${product.name}」不在当前上架任务中，请检查任务`);
      setScanBarcode('');
      return;
    }

    setError(`未找到条码「${barcode}」对应的商品，请检查条码`);
    setScanBarcode('');
  };

  const handleScanLocation = () => {
    if (!scanLocation.trim()) { setError('请扫描目标库位'); return; }
    setCurrentStep(2);
    setError('');
  };

  const handleConfirmPutaway = () => {
    if (putawayQty <= 0) { setError('上架数量必须大于0'); return; }
    if (putawayQty > (activeItem?.waitQty ?? 0)) { setError(`上架数量不能超过待上架数量(${activeItem?.waitQty})`); return; }
    if (!scanLocation.trim()) { setError('请先扫描目标库位'); return; }

    const updated = items.map((it) =>
      it.id === activeItem?.id
        ? { ...it, doneQty: it.doneQty + putawayQty, waitQty: Math.max(0, it.waitQty - putawayQty), targetLocation: scanLocation }
        : it
    );
    setItems(updated);
    setSuccess(`${activeItem?.productName} 上架成功！库位: ${scanLocation}`);
    setActiveItem(null);
    setScanLocation('');
    setPutawayQty(0);
    setCurrentStep(0);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleSubmitAll = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSuccess('上架任务已全部提交！');
      setSubmitting(false);
      setTimeout(() => navigate('/home'), 1200);
    }, 800);
  };

  const allDone = items.every((it) => it.waitQty <= 0);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">上架</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">📤 上架任务号</label>
          <div className="flex gap-2">
            <input type="text" value={taskNo} onChange={(e) => setTaskNo(e.target.value)} placeholder="扫描或输入上架任务号"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleLoadTask()} />
            <button onClick={handleLoadTask} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">查询</button>
          </div>
        </div>

        {taskLoaded && (
          <>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-base font-bold text-gray-800">PTW-20260427-001</p>
              <div className="flex gap-4 mt-1 text-sm">
                <span>来源单号: PO20260426001</span>
                <span>待上架: {items.reduce((s, i) => s + i.waitQty, 0)}件</span>
              </div>
            </div>

            {/* Step guide */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-1">
                {steps.map((s, idx) => (
                  <div key={idx} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx < currentStep ? 'bg-green-500 text-white' : idx === currentStep ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                        {idx < currentStep ? '✓' : idx + 1}
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">{s}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${idx < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base font-medium">{success}</div>}

            {/* Step 0: Scan product */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
              <input type="text" value={scanBarcode} onChange={(e) => { setScanBarcode(e.target.value); if (activeItem) { setActiveItem(null); setCurrentStep(0); } }}
                placeholder="扫描或输入商品条码"
                className={`w-full h-12 px-4 text-base border-2 rounded-lg outline-none ${currentStep === 0 ? 'border-blue-500' : 'border-gray-300'}`}
                onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()} autoFocus />
              <p className="text-xs text-gray-400 mt-1">可扫条码：{items.map(i => i.barcode).join('、')}</p>
            </div>

            {/* Step 1: Scan location */}
            {currentStep >= 1 && (
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">📍 扫描目标库位</label>
                <div className="relative">
                  <input type="text" value={scanLocation} onChange={(e) => setScanLocation(e.target.value)}
                    placeholder="扫描或输入目标库位码"
                    className={`w-full h-12 px-4 text-base border-2 rounded-lg outline-none ${currentStep === 1 ? 'border-blue-500' : 'border-gray-300'}`}
                    onKeyDown={(e) => e.key === 'Enter' && handleScanLocation()} autoFocus={currentStep === 1} />
                </div>
                <p className="text-sm text-blue-600 mt-1">💡 建议库位: <b>{suggestLocation}</b></p>
              </div>
            )}

            {/* Step 2: Qty */}
            {currentStep >= 2 && activeItem && (
              <div className="bg-white border-2 border-blue-400 rounded-xl p-4">
                <p className="text-lg font-bold mb-2">{activeItem.productName}</p>
                <div className="text-sm text-gray-500 mb-3">
                  <span>待上架: <b className="text-orange-600">{activeItem.waitQty}</b></span>
                  <span className="ml-4">目标库位: <b className="text-blue-600">{scanLocation || suggestLocation}</b></span>
                </div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">上架数量</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPutawayQty(Math.max(0, putawayQty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                  <input type="number" value={putawayQty} onChange={(e) => setPutawayQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none" />
                  <button onClick={() => setPutawayQty(Math.min(activeItem.waitQty, putawayQty + 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
                </div>
                <button onClick={handleConfirmPutaway} className="w-full h-11 bg-green-600 text-white rounded-lg text-base font-medium mt-4 active:bg-green-700">
                  确认上架 {putawayQty} 件到 {scanLocation || suggestLocation}
                </button>
              </div>
            )}

            {/* Item list */}
            <div>
              <p className="text-base font-bold text-gray-800 mb-2">商品明细</p>
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold">{it.productName} <span className="text-xs text-gray-400">({it.productCode})</span></p>
                        <p className="text-xs text-gray-500">批次: {it.batchNo} | 条码: {it.barcode}</p>
                        {it.targetLocation && <p className="text-xs text-blue-600">已上架至: {it.targetLocation}</p>}
                      </div>
                      <div className="text-right text-xs">
                        <span className={it.waitQty > 0 ? 'text-orange-600' : 'text-green-600'}>
                          {it.waitQty > 0 ? `待:${it.waitQty}` : '✓完成'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(it.doneQty / it.planQty) * 100}%` }} />
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
            onClick={handleSubmitAll}
            disabled={submitting || !allDone}
            className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg disabled:bg-gray-400 active:bg-blue-700"
          >
            {submitting ? '提交中...' : allDone ? '提交全部上架结果' : '提交上架结果 (仍有未完成的商品)'}
          </button>
        </div>
      )}
    </div>
  );
}
