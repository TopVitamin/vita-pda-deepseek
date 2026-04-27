import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockSortItems = [
  { id: '1', store: '深圳万象城店', orderNo: 'SO001', slotNo: 'G01', productCode: 'P001', productName: '面膜', barcode: 'BAR001', planQty: 20, sortedQty: 0 },
  { id: '2', store: '广州天河城店', orderNo: 'SO002', slotNo: 'G05', productCode: 'P003', productName: '口红', barcode: 'BAR003', planQty: 15, sortedQty: 0 },
  { id: '3', store: '深圳万象城店', orderNo: 'SO001', slotNo: 'G01', productCode: 'P004', productName: '纸巾', barcode: 'BAR004', planQty: 30, sortedQty: 10 },
  { id: '4', store: '深圳海岸城店', orderNo: 'SO003', slotNo: 'G08', productCode: 'P006', productName: '保温杯', barcode: 'BAR006', planQty: 10, sortedQty: 0 },
];

export default function SortingPage() {
  const navigate = useNavigate();
  const [taskNo, setTaskNo] = useState('');
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [scanBarcode, setScanBarcode] = useState('');
  const [activeTarget, setActiveTarget] = useState<typeof mockSortItems[0] | null>(null);
  const [sortQty, setSortQty] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoadTask = () => {
    if (!taskNo.trim()) { setError('请输入分拣任务号'); return; }
    setError('');
    setTaskLoaded(true);
  };

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    const item = mockSortItems.find((i) => i.barcode === scanBarcode.trim());
    if (item) {
      setActiveTarget(item);
      setSortQty(1);
      setError('');
      setSuccess('');
    } else {
      setError('商品条码不在当前分拣任务中');
    }
    setScanBarcode('');
  };

  const handleConfirmSort = () => {
    if (!activeTarget) return;
    if (sortQty <= 0) { setError('分拣数量必须大于0'); return; }
    setError('');
    setSuccess(`${activeTarget.productName} → ${activeTarget.slotNo}格口(${activeTarget.store}) ×${sortQty}`);
    setActiveTarget(null);
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">分拣</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">📊 分拣任务号</label>
          <div className="flex gap-2">
            <input type="text" value={taskNo} onChange={(e) => setTaskNo(e.target.value)} placeholder="扫描或输入分拣任务号"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleLoadTask()} />
            <button onClick={handleLoadTask} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">查询</button>
          </div>
        </div>

        {taskLoaded && (
          <>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-base font-bold">SORT-20260427-001</p>
              <p className="text-sm text-gray-500 mt-1">波次: WAVE001 | 商品: {mockSortItems.length}项</p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base font-medium">{success}</div>}

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
              <input type="text" value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)} placeholder="扫描或输入商品条码"
                className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()} autoFocus />
            </div>

            {activeTarget && (
              <div className="bg-white border-2 border-green-400 rounded-xl p-4 shadow-md text-center">
                <p className="text-sm text-gray-500">📍 请放入以下格口</p>
                <p className="text-4xl font-bold text-green-600 my-2">{activeTarget.slotNo}</p>
                <p className="text-lg font-bold text-gray-800">{activeTarget.store}</p>
                <p className="text-base text-gray-600">订单: {activeTarget.orderNo}</p>
                <p className="text-base text-gray-500 mt-2">{activeTarget.productName} ({activeTarget.productCode})</p>

                <div className="mt-3">
                  <label className="text-sm text-gray-600 mb-1 block">分拣数量</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSortQty(Math.max(0, sortQty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                    <input type="number" value={sortQty} onChange={(e) => setSortQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none" />
                    <button onClick={() => setSortQty(sortQty + 1)} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
                  </div>
                </div>

                <button onClick={handleConfirmSort} className="w-full h-11 bg-green-600 text-white rounded-lg text-base font-medium mt-4 active:bg-green-700">
                  确认分拣
                </button>
              </div>
            )}

            <div>
              <p className="text-base font-bold text-gray-800 mb-2">格口分配表</p>
              <div className="space-y-2">
                {mockSortItems.map((it) => (
                  <div key={it.id} className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-sm font-bold rounded mr-2">{it.slotNo}格口</span>
                        <span className="text-sm font-bold">{it.store}</span>
                      </div>
                      <span className="text-xs text-gray-500">{it.sortedQty}/{it.planQty}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{it.productName} ({it.productCode}) | {it.orderNo}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {taskLoaded && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
          <button onClick={() => { setSuccess('分拣完成！'); setTimeout(() => navigate('/home'), 1000); }}
            className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg active:bg-blue-700">
            完成分拣
          </button>
        </div>
      )}
    </div>
  );
}
