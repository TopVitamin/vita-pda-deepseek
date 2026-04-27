import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockShipBoxes = [
  { boxNo: 'BOX-A001', scanned: false, orderNo: 'SO20260426001', weight: 3.5 },
  { boxNo: 'BOX-A002', scanned: false, orderNo: 'SO20260426001', weight: 2.8 },
  { boxNo: 'BOX-A003', scanned: false, orderNo: 'SO20260426001', weight: 4.2 },
  { boxNo: 'BOX-A004', scanned: false, orderNo: 'SO20260426002', weight: 5.1 },
];

export default function ShipPage() {
  const navigate = useNavigate();
  const [taskNo, setTaskNo] = useState('');
  const [taskLoaded, setTaskLoaded] = useState(false);
  const [boxes, setBoxes] = useState(mockShipBoxes);
  const [scanBox, setScanBox] = useState('');
  const [scanLogistics, setScanLogistics] = useState('');
  const [logisticsNo, setLogisticsNo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const scannedCount = boxes.filter((b) => b.scanned).length;

  const handleLoadTask = () => {
    if (!taskNo.trim()) { setError('请输入发运任务号'); return; }
    setError('');
    setBoxes(mockShipBoxes.map((b) => ({ ...b, scanned: false })));
    setTaskLoaded(true);
  };

  const handleScanBox = () => {
    if (!scanBox.trim()) return;
    const box = boxes.find((b) => b.boxNo === scanBox.trim());
    if (!box) { setError('箱码不在当前发运任务中'); setScanBox(''); return; }
    if (box.scanned) { setError('该箱已扫描，请勿重复扫描'); setScanBox(''); return; }
    setBoxes((prev) => prev.map((b) => b.boxNo === scanBox.trim() ? { ...b, scanned: true } : b));
    setSuccess(`箱 ${scanBox.trim()} 已确认 ✓`);
    setScanBox('');
    setError('');
    setTimeout(() => setSuccess(''), 1200);
  };

  const handleScanLogistics = () => {
    if (!scanLogistics.trim()) return;
    setLogisticsNo(scanLogistics.trim());
    setScanLogistics('');
    setSuccess('物流单号已录入');
    setTimeout(() => setSuccess(''), 1200);
  };

  const handleSubmit = () => {
    const remaining = boxes.filter((b) => !b.scanned);
    if (remaining.length > 0) {
      if (!window.confirm(`还有 ${remaining.length} 个箱未扫描确认 (${remaining.map((b) => b.boxNo).join(', ')}). 确认提交发运吗？`)) return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSuccess('发运提交成功！');
      setSubmitting(false);
      setTimeout(() => navigate('/home'), 1200);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">确认发运</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">🚚 发运任务号</label>
          <div className="flex gap-2">
            <input type="text" value={taskNo} onChange={(e) => setTaskNo(e.target.value)} placeholder="扫描或输入发运任务号"
              className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
            <button onClick={handleLoadTask} className="h-12 px-6 bg-blue-600 text-white text-base rounded-lg active:bg-blue-700">查询</button>
          </div>
        </div>

        {taskLoaded && (
          <>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-base font-bold">SHIP-20260427-001</p>
              <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                <p>承运商: 顺丰速运</p>
                {logisticsNo && <p>物流单号: <b>{logisticsNo}</b></p>}
              </div>
            </div>

            {/* Scan progress */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <p className="text-sm text-gray-500">已扫描 / 应扫描</p>
              <p className={`text-4xl font-bold ${scannedCount === boxes.length ? 'text-green-600' : 'text-blue-600'}`}>
                {scannedCount}<span className="text-2xl text-gray-400">/{boxes.length}</span>
              </p>
              <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${scannedCount === boxes.length ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${(scannedCount / boxes.length) * 100}%` }} />
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base font-medium">{success}</div>}

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描箱码确认装车</label>
              <input type="text" value={scanBox} onChange={(e) => setScanBox(e.target.value)} placeholder="扫描箱码"
                className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleScanBox()} autoFocus />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">📋 扫描物流单号</label>
              <input type="text" value={scanLogistics} onChange={(e) => setScanLogistics(e.target.value)} placeholder="扫描或输入物流单号"
                className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleScanLogistics()} />
            </div>

            <div>
              <p className="text-base font-bold text-gray-800 mb-2">待发运箱列表</p>
              <div className="space-y-1.5">
                {boxes.map((b) => (
                  <div key={b.boxNo} className={`bg-white rounded-lg p-3 border flex justify-between items-center ${b.scanned ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                    <div>
                      <p className="text-sm font-bold">{b.boxNo}</p>
                      <p className="text-xs text-gray-500">{b.orderNo} · {b.weight}kg</p>
                    </div>
                    {b.scanned ? (
                      <span className="text-green-600 font-bold text-sm">✓ 已装车</span>
                    ) : (
                      <span className="text-gray-400 text-sm">待扫描</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {taskLoaded && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
          <button onClick={handleSubmit} disabled={submitting}
            className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg disabled:bg-gray-400 active:bg-blue-700">
            {submitting ? '提交中...' : '提交发运'}
          </button>
        </div>
      )}
    </div>
  );
}
