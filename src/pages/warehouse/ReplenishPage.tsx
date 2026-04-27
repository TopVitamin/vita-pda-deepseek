import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockReplenishTasks = [
  { id: '1', taskNo: 'RPL-20260427-001', productCode: 'P001', productName: '面膜', fromLoc: 'B01-01-01', toLoc: 'A01-01-01', planQty: 200, doneQty: 80, waitQty: 120 },
  { id: '2', taskNo: 'RPL-20260427-002', productCode: 'P003', productName: '口红', fromLoc: 'B02-01-01', toLoc: 'A01-02-01', planQty: 150, doneQty: 0, waitQty: 150 },
];

export default function ReplenishPage() {
  const navigate = useNavigate();
  const [tasks] = useState(mockReplenishTasks);
  const [activeTask, setActiveTask] = useState<typeof mockReplenishTasks[0] | null>(null);
  const [qty, setQty] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConfirm = () => {
    if (!activeTask) return;
    if (qty <= 0) { setError('补货数量必须大于0'); return; }
    if (qty > activeTask.waitQty) { setError(`不能超过待补数量(${activeTask.waitQty})`); return; }
    setSuccess(`${activeTask.productName} 补货 ${qty} 件完成`);
    setActiveTask(null); setQty(0);
    setTimeout(() => setSuccess(''), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3"><button onClick={() => navigate('/home')} className="text-white text-xl">←</button><span className="text-white text-lg font-bold">补货作业</span></div>
      </div>
      <div className="px-4 py-3 space-y-3">
        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base">{success}</div>}

        <p className="text-base font-bold text-gray-800">补货任务列表</p>
        {tasks.map((t) => (
          <button key={t.id} onClick={() => { setActiveTask(t); setQty(t.waitQty); setError(''); }}
            className={`w-full text-left bg-white rounded-xl p-4 border-2 ${activeTask?.id === t.id ? 'border-blue-400' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-base font-bold text-gray-800">{t.taskNo}</span>
              <span className="text-xs text-orange-600 font-bold">待补: {t.waitQty}</span>
            </div>
            <p className="text-sm text-gray-600">{t.productName} ({t.productCode})</p>
            <div className="flex gap-4 mt-1 text-xs text-gray-500">
              <span>来源: {t.fromLoc}</span>
              <span>目标: {t.toLoc}</span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(t.doneQty / t.planQty) * 100}%` }} />
            </div>
          </button>
        ))}

        {activeTask && (
          <div className="bg-white border-2 border-purple-400 rounded-xl p-4">
            <p className="text-lg font-bold">{activeTask.productName}</p>
            <p className="text-sm text-gray-500">来源: {activeTask.fromLoc} → 目标: {activeTask.toLoc}</p>
            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">补货数量</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(0, qty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                <input type="number" value={qty} onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none" />
                <button onClick={() => setQty(Math.min(activeTask.waitQty, qty + 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
              </div>
            </div>
            <button onClick={handleConfirm} className="w-full h-11 bg-purple-600 text-white rounded-lg text-base font-medium mt-4 active:bg-purple-700">
              确认补货
            </button>
          </div>
        )}
      </div>
      {activeTask && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
          <button onClick={() => { setSuccess('补货任务提交完成'); setTimeout(() => navigate('/home'), 1000); }}
            className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg active:bg-blue-700">提交补货结果</button>
        </div>
      )}
    </div>
  );
}
