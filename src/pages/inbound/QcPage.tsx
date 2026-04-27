import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const qcResults = ['合格', '不合格', '部分合格', '破损', '临期', '包装异常'];
const mockQcItems = [
  { id: '1', productCode: 'P001', productName: '面膜', barcode: 'BAR001', qcQty: 0, result: '', exceptionReason: '' },
  { id: '2', productCode: 'P002', productName: '洗面奶', barcode: 'BAR002', qcQty: 0, result: '', exceptionReason: '' },
  { id: '3', productCode: 'P003', productName: '口红', barcode: 'BAR003', qcQty: 0, result: '', exceptionReason: '' },
];

export default function QcPage() {
  const navigate = useNavigate();
  const [taskNo, setTaskNo] = useState('');
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [scanBarcode, setScanBarcode] = useState('');
  const [items, setItems] = useState(mockQcItems);
  const [activeItem, setActiveItem] = useState<typeof mockQcItems[0] | null>(null);
  const [qcQty, setQcQty] = useState(0);
  const [selectedResult, setSelectedResult] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoadTask = () => {
    if (!taskNo.trim()) { setError('请输入质检任务号'); return; }
    setError('');
    setTaskLoaded(true);
  };

  const handleScanBarcode = () => {
    if (!scanBarcode.trim()) return;
    const item = items.find((i) => i.barcode === scanBarcode.trim());
    if (item) {
      setActiveItem(item);
      setQcQty(0);
      setSelectedResult('');
      setError('');
    } else {
      setError('未找到对应商品');
    }
    setScanBarcode('');
  };

  const handleSubmitQc = () => {
    if (!selectedResult) { setError('请选择质检结果'); return; }
    if (qcQty <= 0) { setError('质检数量必须大于0'); return; }
    setError('');
    const updated = items.map((it) =>
      it.id === activeItem?.id ? { ...it, qcQty, result: selectedResult } : it
    );
    setItems(updated);
    setActiveItem(null);
    setSuccess('质检结果已保存');
    setTimeout(() => setSuccess(''), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">入库质检</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">🔍 质检任务号</label>
          <div className="flex gap-2">
            <input type="text" value={taskNo} onChange={(e) => setTaskNo(e.target.value)} placeholder="扫描或输入质检任务号"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
            <button onClick={handleLoadTask} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">查询</button>
          </div>
        </div>

        {taskLoaded && (
          <>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-base font-bold text-gray-800">QC-20260427-001</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span>来源单号: PO20260426003</span>
                <span>商品: {items.length}项</span>
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
              <input type="text" value={scanBarcode} onChange={(e) => setScanBarcode(e.target.value)}
                placeholder="扫描或输入商品条码"
                className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()} autoFocus />
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base">{success}</div>}

            {activeItem && (
              <div className="bg-white border-2 border-purple-400 rounded-xl p-4 shadow-md">
                <p className="text-lg font-bold text-gray-800">{activeItem.productName}</p>
                <p className="text-sm text-gray-500">条码: {activeItem.barcode}</p>

                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-600 mb-1 block">质检数量</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQcQty(Math.max(0, qcQty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                    <input type="number" value={qcQty} onChange={(e) => setQcQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none" />
                    <button onClick={() => setQcQty(qcQty + 1)} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">质检结果</label>
                  <div className="grid grid-cols-3 gap-2">
                    {qcResults.map((r) => (
                      <button key={r} onClick={() => setSelectedResult(r)}
                        className={`py-2.5 rounded-lg text-sm font-medium border active:scale-95 ${selectedResult === r ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-300 text-gray-700'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleSubmitQc} className="w-full h-11 bg-purple-600 text-white rounded-lg text-base font-medium mt-4 active:bg-purple-700">
                  确认质检
                </button>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-base font-bold text-gray-800">商品明细</p>
              {items.map((it) => (
                <div key={it.id} className="bg-white rounded-lg p-3 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">{it.productName}</p>
                    <p className="text-xs text-gray-500">{it.barcode}</p>
                  </div>
                  <div className="text-right">
                    {it.result ? (
                      <span className={`px-2 py-1 rounded text-xs ${it.result === '合格' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {it.result} ({it.qcQty})
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">待质检</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {taskLoaded && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
          <button onClick={() => { setSuccess('质检任务已全部提交'); setTimeout(() => navigate('/home'), 1000); }}
            className="w-full h-12 bg-purple-600 text-white text-lg font-medium rounded-lg active:bg-purple-700">
            提交全部质检结果
          </button>
        </div>
      )}
    </div>
  );
}
