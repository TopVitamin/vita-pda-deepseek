import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BoxItem {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  packedQty: number;
}

export default function PackingPage() {
  const navigate = useNavigate();
  const [taskNo, setTaskNo] = useState('');
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [scanBox, setScanBox] = useState('');
  const [scanBarcode, setScanBarcode] = useState('');
  const [currentBoxNo, setCurrentBoxNo] = useState('');
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);
  const [boxStatus, setBoxStatus] = useState<'open' | 'closed'>('open');
  const [packingQty, setPackingQty] = useState(1);
  const [boxes, setBoxes] = useState<{ boxNo: string; status: string; totalQty: number }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoadTask = () => {
    if (!taskNo.trim()) { setError('请输入任务号'); return; }
    setError('');
    setTaskLoaded(true);
  };

  const handleCreateBox = () => {
    const newBoxNo = `BOX-${Date.now().toString(36).toUpperCase()}`;
    setCurrentBoxNo(newBoxNo);
    setBoxItems([]);
    setBoxStatus('open');
    setSuccess(`已创建箱号: ${newBoxNo}`);
    setTimeout(() => setSuccess(''), 1500);
  };

  const handleScanBox = () => {
    if (!scanBox.trim()) return;
    const existing = boxes.find((b) => b.boxNo === scanBox.trim());
    if (existing && existing.status === 'closed') {
      setError('该箱已关闭，不能继续加入商品');
      setScanBox('');
      return;
    }
    setCurrentBoxNo(scanBox.trim());
    setBoxStatus('open');
    setBoxItems([]);
    setScanBox('');
    setError('');
  };

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    if (!currentBoxNo) { setError('请先创建或扫描箱号'); setScanBarcode(''); return; }
    if (boxStatus === 'closed') { setError('该箱已关闭'); setScanBarcode(''); return; }

    // Find product from mock mapping
    const barcodeMap: Record<string, { code: string; name: string }> = {
      BAR001: { code: 'P001', name: '面膜' },
      BAR002: { code: 'P002', name: '洗面奶' },
      BAR003: { code: 'P003', name: '口红' },
      BAR004: { code: 'P004', name: '纸巾' },
      BAR006: { code: 'P006', name: '保温杯' },
    };

    const product = barcodeMap[scanBarcode.trim()];
    if (!product) { setError('未识别该商品条码'); setScanBarcode(''); return; }

    setBoxItems((prev) => {
      const existing = prev.find((i) => i.barcode === scanBarcode.trim());
      if (existing) {
        return prev.map((i) => i.barcode === scanBarcode.trim() ? { ...i, packedQty: i.packedQty + packingQty } : i);
      }
      return [...prev, { id: Date.now().toString(), productCode: product.code, productName: product.name, barcode: scanBarcode.trim(), packedQty: packingQty }];
    });
    setPackingQty(1);
    setScanBarcode('');
    setSuccess('商品已加入当前箱');
    setTimeout(() => setSuccess(''), 1000);
  };

  const handleCloseBox = () => {
    if (boxItems.length === 0) { setError('箱内无商品，无法封箱'); return; }
    setBoxStatus('closed');
    setBoxes((prev) => [...prev.filter((b) => b.boxNo !== currentBoxNo), { boxNo: currentBoxNo, status: 'closed', totalQty: boxItems.reduce((s, i) => s + i.packedQty, 0) }]);
    setSuccess(`箱 ${currentBoxNo} 已关闭`);
    setTimeout(() => setSuccess(''), 1500);
  };

  const handleReopenBox = () => {
    setBoxStatus('open');
    setSuccess(`箱 ${currentBoxNo} 已重新打开`);
    setTimeout(() => setSuccess(''), 1000);
  };

  const handleRemoveItem = (id: string) => {
    setBoxItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">装箱</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">📦 任务号/订单号</label>
          <div className="flex gap-2">
            <input type="text" value={taskNo} onChange={(e) => setTaskNo(e.target.value)} placeholder="扫描或输入"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
            <button onClick={handleLoadTask} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">确认</button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base">{success}</div>}

        {/* Current box status */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">当前箱号</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${boxStatus === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {boxStatus === 'open' ? '未封箱' : '已封箱'}
            </span>
          </div>
          {currentBoxNo ? (
            <p className="text-xl font-bold text-gray-800">{currentBoxNo}</p>
          ) : (
            <p className="text-gray-400">未创建/扫描箱号</p>
          )}
          <p className="text-sm text-gray-500 mt-1">箱内件数: <b className="text-blue-600">{boxItems.reduce((s, i) => s + i.packedQty, 0)}</b></p>
        </div>

        <div className="flex gap-2">
          <input type="text" value={scanBox} onChange={(e) => setScanBox(e.target.value)} placeholder="扫描箱码"
            className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleScanBox()} />
          <button onClick={handleCreateBox} className="h-12 px-4 bg-green-600 text-white text-sm rounded-lg active:bg-green-700 whitespace-nowrap">
            新建箱
          </button>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
          <div className="flex gap-2">
            <input type="text" value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)} placeholder="扫描商品条码" autoFocus
              className="flex-1 h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()} />
            <div className="flex items-center gap-1">
              <button onClick={() => setPackingQty(Math.max(1, packingQty - 1))} className="w-8 h-8 bg-gray-200 rounded text-sm">−</button>
              <input type="number" value={packingQty} onChange={(e) => setPackingQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 h-8 text-center text-sm border border-gray-300 rounded outline-none" />
              <button onClick={() => setPackingQty(packingQty + 1)} className="w-8 h-8 bg-gray-200 rounded text-sm">+</button>
            </div>
          </div>
        </div>

        {/* Box items */}
        {currentBoxNo && boxItems.length > 0 && (
          <div>
            <p className="text-base font-bold text-gray-800 mb-2">箱内商品 ({boxItems.length}项)</p>
            <div className="space-y-1.5">
              {boxItems.map((it) => (
                <div key={it.id} className="bg-white rounded-lg p-3 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">{it.productName}</p>
                    <p className="text-xs text-gray-500">{it.productCode} | {it.barcode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{it.packedQty}</span>
                    <button onClick={() => handleRemoveItem(it.id)} className="text-red-500 text-xs">移除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Box history */}
        {boxes.length > 0 && (
          <div>
            <p className="text-base font-bold text-gray-800 mb-2">已装箱列表</p>
            <div className="space-y-1.5">
              {boxes.map((b) => (
                <div key={b.boxNo} className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">{b.boxNo}</p>
                    <p className="text-xs text-gray-500">{b.totalQty}件</p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">已封箱</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
        {currentBoxNo && boxStatus === 'open' ? (
          <div className="flex gap-2">
            <button onClick={handleCloseBox} className="flex-1 h-12 bg-green-600 text-white text-base font-medium rounded-lg active:bg-green-700">
              关闭当前箱 ({boxItems.reduce((s, i) => s + i.packedQty, 0)}件)
            </button>
          </div>
        ) : currentBoxNo && boxStatus === 'closed' ? (
          <div className="flex gap-2">
            <button onClick={handleReopenBox} className="flex-1 h-12 border border-blue-300 text-blue-600 text-base font-medium rounded-lg active:bg-blue-50">
              重新开箱
            </button>
            <button onClick={() => navigate('/print/carton-label')} className="flex-1 h-12 bg-blue-600 text-white text-base font-medium rounded-lg active:bg-blue-700">
              打印箱码
            </button>
          </div>
        ) : (
          <button className="w-full h-12 bg-gray-400 text-white text-base rounded-lg" disabled>
            请先创建或扫描箱号
          </button>
        )}
      </div>
    </div>
  );
}
