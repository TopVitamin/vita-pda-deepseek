import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '@/mock/products';

interface DocItem {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  spec: string;
  unit: string;
  planQty: number;
  receivedQty: number;
  waitQty: number;
  currentQty: number;
}

const initialDocItems: DocItem[] = [
  { id: '1', productCode: 'SKU00001', productName: '面膜', barcode: 'BAR001', spec: '25ml*5片/盒', unit: '盒', planQty: 100, receivedQty: 0, waitQty: 100, currentQty: 0 },
  { id: '2', productCode: 'SKU00002', productName: '洗面奶', barcode: 'BAR002', spec: '120ml/支', unit: '支', planQty: 200, receivedQty: 30, waitQty: 170, currentQty: 0 },
  { id: '3', productCode: 'SKU00003', productName: '口红', barcode: 'BAR003', spec: '3.5g/支', unit: '支', planQty: 150, receivedQty: 0, waitQty: 150, currentQty: 0 },
  { id: '4', productCode: 'SKU00004', productName: '纸巾', barcode: 'BAR004', spec: '3层*120抽*6包/提', unit: '提', planQty: 500, receivedQty: 0, waitQty: 500, currentQty: 0 },
];

const exceptionReasons = ['少收', '多收', '破损', '错货', '临期', '包装异常'];

export default function ReceivePage() {
  const navigate = useNavigate();
  const [docNo, setDocNo] = useState('');
  const [docLoaded, setDocLoaded] = useState(false);
  const [scanBarcode, setScanBarcode] = useState('');
  const [items, setItems] = useState<DocItem[]>([]);
  const [activeItem, setActiveItem] = useState<DocItem | null>(null);
  const [currentQty, setCurrentQty] = useState(1);
  const [showException, setShowException] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanSuccess, setScanSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [overReceiving, setOverReceiving] = useState(false);

  const productByBarcode = useMemo(() => {
    const map: Record<string, (typeof mockProducts)[0]> = {};
    mockProducts.forEach((p) => { map[p.barcode] = p; });
    return map;
  }, []);

  const handleLoadDoc = () => {
    if (!docNo.trim()) { setError('请输入或扫描入库通知单号'); return; }
    setError('');
    setItems(JSON.parse(JSON.stringify(initialDocItems)));
    setDocLoaded(true);
  };

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    const barcode = scanBarcode.trim();

    // 先在单据商品中查找
    const item = items.find((i) => i.barcode === barcode);
    if (item) {
      if (item.waitQty <= 0) { setError(`${item.productName} 已全部收货`); setScanBarcode(''); return; }
      setActiveItem(item);
      setCurrentQty(1);
      setScanSuccess(true);
      setError('');
      setTimeout(() => setScanSuccess(false), 1200);
      setScanBarcode('');
      return;
    }

    // 在商品主数据中查找
    const product = productByBarcode[barcode];
    if (product) {
      setError(`商品「${product.name}」不在当前收货单中，请检查单据`);
      setScanBarcode('');
      return;
    }

    setError(`未找到条码「${barcode}」对应的商品，请检查条码`);
    setScanBarcode('');
  };

  const handleQtyChange = (delta: number) => {
    const maxQty = overReceiving ? 9999 : (activeItem?.waitQty ?? 0);
    setCurrentQty((prev) => Math.max(0, Math.min(maxQty, prev + delta)));
  };

  const handleOverReceiveToggle = () => {
    setOverReceiving(!overReceiving);
    if (!overReceiving) {
      setShowException(true);
    } else {
      setExceptionReason('');
      setShowException(false);
    }
  };

  const handleAddToCurrent = () => {
    if (!activeItem) return;
    if (currentQty <= 0) { setError('收货数量必须大于0'); return; }
    if (currentQty > activeItem.waitQty && !overReceiving) {
      setError(`收货数量不能超过待收数量(${activeItem.waitQty})`); return;
    }
    if (overReceiving && !exceptionReason) { setError('多收时必须选择异常原因'); return; }
    if (currentQty < activeItem.waitQty && !overReceiving) {
      if (!exceptionReason) { setError('少收请选择原因，或多收请勾选多收'); return; }
    }
    setError('');
    const updated = items.map((it) =>
      it.id === activeItem.id
        ? { ...it, receivedQty: it.receivedQty + currentQty, waitQty: Math.max(0, it.waitQty - currentQty), currentQty: 0 }
        : it
    );
    setItems(updated);
    setActiveItem(null);
    setCurrentQty(1);
    setExceptionReason('');
    setOverReceiving(false);
    setShowException(false);
  };

  const handleSubmit = () => {
    const hasUnfinished = items.some((it) => it.waitQty > 0);
    const hasReceived = items.some((it) => it.receivedQty > 0);
    if (!hasReceived) { setError('请至少完成一件商品的收货'); return; }
    if (hasUnfinished) {
      if (!window.confirm('仍有商品未全部收货，确认提交吗？')) return;
    }
    setSubmitting(true);
    setError('');
    setTimeout(() => {
      setSuccess('收货提交成功！');
      setSubmitting(false);
      setTimeout(() => {
        setDocLoaded(false);
        setItems([]);
        setDocNo('');
        setSuccess('');
      }, 1500);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">入库收货</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Step 1: Load doc */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">📄 入库通知单号</label>
          <div className="flex gap-2">
            <input
              type="text" value={docNo} onChange={(e) => setDocNo(e.target.value)}
              placeholder="扫描或输入入库通知单号"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleLoadDoc()}
            />
            <button onClick={handleLoadDoc} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">
              查询
            </button>
          </div>
        </div>

        {docLoaded && (
          <>
            {/* Doc info */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">单号</span>
                <span className="text-sm font-bold">PO20260427001</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">类型</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">采购入库</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">供应商</span>
                <span className="text-sm">广州日化供应公司</span>
              </div>
            </div>

            {/* Step 2: Scan barcode */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
              <div className="relative">
                <input
                  type="text" value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)}
                  placeholder="扫描或输入商品条码"
                  className={`w-full h-12 px-4 pr-10 text-base border-2 rounded-lg outline-none transition-colors ${scanSuccess ? 'border-green-500 bg-green-50' : 'border-gray-300 focus:border-blue-500'}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()}
                  autoFocus
                />
                {scanBarcode && (
                  <button onClick={() => setScanBarcode('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">✕</button>
                )}
              </div>
              {scanSuccess && <p className="text-green-600 text-sm mt-1">扫描成功 ✓</p>}
              <p className="text-xs text-gray-400 mt-1">可扫条码：{items.map(i => i.barcode).join('、')}</p>
            </div>

            {/* Error / Success */}
            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base font-medium">{success}</div>}

            {/* Active item - qty input */}
            {activeItem && (
              <div className="bg-white border-2 border-blue-400 rounded-xl p-4 shadow-md">
                <div className="mb-3">
                  <p className="text-lg font-bold text-gray-800">{activeItem.productName}</p>
                  <p className="text-sm text-gray-500">条码: {activeItem.barcode} · 规格: {activeItem.spec} · 单位: {activeItem.unit}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-500">应收: <b className="text-gray-800">{activeItem.planQty}</b></span>
                    <span className="text-gray-500">已收: <b className="text-green-600">{activeItem.receivedQty}</b></span>
                    <span className="text-gray-500">待收: <b className="text-orange-600">{activeItem.waitQty}</b></span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">本次收货数量</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleQtyChange(-1)} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                    <input
                      type="number" value={currentQty}
                      onChange={(e) => setCurrentQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none"
                    />
                    <button onClick={() => handleQtyChange(1)} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <label className="flex items-center">
                    <input type="checkbox" checked={overReceiving} onChange={handleOverReceiveToggle} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="ml-2 text-sm text-gray-700">多收（超应收）</span>
                  </label>
                  {currentQty < (activeItem?.waitQty ?? 1) && !overReceiving && (
                    <button onClick={() => setShowException(true)} className="text-sm text-orange-600 underline">
                      登记少收原因
                    </button>
                  )}
                </div>

                {showException && (
                  <div className="mt-3">
                    <label className="text-sm font-medium text-gray-600 mb-1 block">异常原因</label>
                    <div className="flex flex-wrap gap-2">
                      {exceptionReasons.map((r) => (
                        <button
                          key={r} onClick={() => setExceptionReason(r)}
                          className={`px-3 py-1.5 rounded-lg text-sm border ${exceptionReason === r ? 'bg-red-100 border-red-400 text-red-700' : 'bg-white border-gray-300 text-gray-600'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setActiveItem(null); setExceptionReason(''); setShowException(false); }} className="flex-1 h-11 border border-gray-300 text-gray-600 rounded-lg text-base active:bg-gray-50">
                    取消
                  </button>
                  <button onClick={handleAddToCurrent} className="flex-1 h-11 bg-blue-600 text-white rounded-lg text-base font-medium active:bg-blue-700">
                    确认收货 {currentQty}{activeItem.unit}
                  </button>
                </div>
              </div>
            )}

            {/* Item list */}
            <div>
              <p className="text-base font-bold text-gray-800 mb-2">商品明细 ({items.length}项)</p>
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className={`bg-white rounded-lg p-3 border ${activeItem?.id === it.id ? 'border-blue-400 bg-blue-50' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{it.productName} <span className="text-xs text-gray-400">({it.productCode})</span></p>
                        <p className="text-xs text-gray-500">{it.spec} · {it.unit}</p>
                      </div>
                      <div className="text-right text-xs">
                        <span className={it.waitQty > 0 ? 'text-orange-600 font-bold' : 'text-green-600 font-bold'}>
                          {it.waitQty > 0 ? `待收:${it.waitQty}` : '已收完'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                      <span>应收:{it.planQty}</span>
                      <span>已收:<span className="text-green-600 font-bold">{it.receivedQty}</span></span>
                    </div>
                    <div className="mt-1.5 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(it.receivedQty / it.planQty) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom action */}
      {docLoaded && !success && items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg disabled:bg-gray-400 active:bg-blue-700"
          >
            {submitting ? '提交中...' : '提交收货'}
          </button>
        </div>
      )}
    </div>
  );
}
