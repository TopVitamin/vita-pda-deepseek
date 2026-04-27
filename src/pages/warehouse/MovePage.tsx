import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const moveReasons = ['库位整理', '商品归位', '异常调整', '临时转移', '其他'];

export default function MovePage() {
  const navigate = useNavigate();
  const [scanProduct, setScanProduct] = useState('');
  const [scanFrom, setScanFrom] = useState('');
  const [scanTo, setScanTo] = useState('');
  const [moveQty, setMoveQty] = useState(0);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(0);
  const [productInfo, setProductInfo] = useState<{ name: string; code: string; currentStock: number } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = ['扫商品', '扫原库位', '扫目标库位', '输入数量'];

  const handleScanProduct = () => {
    if (!scanProduct.trim()) { setError('请扫描商品条码'); return; }
    setProductInfo({ name: '面膜', code: 'P001', currentStock: 50 });
    setScanProduct('');
    setStep(1);
    setError('');
  };

  const handleScanFrom = () => {
    if (!scanFrom.trim()) { setError('请扫描原库位'); return; }
    setError('');
    setScanFrom('');
    setStep(2);
  };

  const handleScanTo = () => {
    if (!scanTo.trim()) { setError('请扫描目标库位'); return; }
    if (scanTo === productInfo?.code) { setError('目标库位不能与原库位相同'); return; }
    setError('');
    setScanTo('');
    setStep(3);
  };

  const handleSubmit = () => {
    if (moveQty <= 0) { setError('移动数量必须大于0'); return; }
    if (!reason) { setError('请选择移库原因'); return; }
    if (moveQty > (productInfo?.currentStock ?? 0)) { setError(`移动数量不能超过当前库存(${productInfo?.currentStock})`); return; }
    setError('');
    setSuccess('移库成功！');
    setTimeout(() => navigate('/home'), 1200);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">移库</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Step guide */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-1">
            {steps.map((s, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx < step ? 'bg-green-500 text-white' : idx === step ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                    {idx < step ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs text-gray-500 mt-0.5">{s}</span>
                </div>
                {idx < 3 && <div className={`flex-1 h-0.5 mx-1 ${idx < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-600 text-base font-medium">{success}</div>}

        {/* Step 0: Scan product */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">📦 扫描商品条码</label>
          <input type="text" value={scanProduct} onChange={(e) => setScanProduct(e.target.value)}
            placeholder="扫描或输入商品条码"
            className={`w-full h-12 px-4 text-base border-2 rounded-lg outline-none ${step === 0 ? 'border-blue-500' : 'border-gray-300'}`}
            onKeyDown={(e) => e.key === 'Enter' && handleScanProduct()} autoFocus />
        </div>

        {productInfo && (
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <p className="text-base font-bold">{productInfo.name} ({productInfo.code})</p>
            <p className="text-sm text-gray-500">当前库存: {productInfo.currentStock}</p>
          </div>
        )}

        {/* Step 1: Scan from location */}
        {step >= 1 && (
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">📍 扫描原库位</label>
            <input type="text" value={scanFrom} onChange={(e) => setScanFrom(e.target.value)}
              placeholder="扫描原库位码"
              className={`w-full h-12 px-4 text-base border-2 rounded-lg outline-none ${step === 1 ? 'border-blue-500' : 'border-gray-300'}`}
              onKeyDown={(e) => e.key === 'Enter' && handleScanFrom()} autoFocus={step === 1} />
          </div>
        )}

        {/* Step 2: Scan to location */}
        {step >= 2 && (
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">📍 扫描目标库位</label>
            <input type="text" value={scanTo} onChange={(e) => setScanTo(e.target.value)}
              placeholder="扫描目标库位码"
              className={`w-full h-12 px-4 text-base border-2 rounded-lg outline-none ${step === 2 ? 'border-blue-500' : 'border-gray-300'}`}
              onKeyDown={(e) => e.key === 'Enter' && handleScanTo()} autoFocus={step === 2} />
          </div>
        )}

        {/* Step 3: Qty + Reason */}
        {step >= 3 && (
          <div className="bg-white border-2 border-blue-400 rounded-xl p-4">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 block">移动数量</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setMoveQty(Math.max(0, moveQty - 1))} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">−</button>
                <input type="number" value={moveQty} onChange={(e) => setMoveQty(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none" />
                <button onClick={() => setMoveQty(moveQty + 1)} className="w-12 h-12 bg-gray-200 text-xl font-bold rounded-lg active:bg-gray-300">+</button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">移库原因</label>
              <div className="flex flex-wrap gap-2">
                {moveReasons.map((r) => (
                  <button key={r} onClick={() => setReason(r)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${reason === r ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-300 text-gray-600'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t px-4 py-3">
        <button onClick={handleSubmit}
          className="w-full h-12 bg-blue-600 text-white text-lg font-medium rounded-lg disabled:bg-gray-400 active:bg-blue-700"
          disabled={step < 3}>
          提交移库
        </button>
      </div>
    </div>
  );
}
