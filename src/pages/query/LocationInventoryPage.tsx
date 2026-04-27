import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockLocationItems = [
  { id: '1', productCode: 'P001', productName: '面膜', batch: 'B20260427', total: 50, available: 45, frozen: 5, status: '正常' },
  { id: '2', productCode: 'P003', productName: '口红', batch: 'B20260426', total: 150, available: 150, frozen: 0, status: '正常' },
  { id: '3', productCode: 'P004', productName: '纸巾', batch: 'B20260415', total: 100, available: 90, frozen: 10, status: '部分冻结' },
];

export default function LocationInventoryPage() {
  const navigate = useNavigate();
  const [scanLocation, setScanLocation] = useState('');
  const [location, setLocation] = useState('');
  const [items] = useState(mockLocationItems);

  const handleScan = () => {
    if (!scanLocation.trim()) return;
    setLocation(scanLocation.trim());
    setScanLocation('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-2"><button onClick={() => navigate('/home')} className="text-white text-xl">←</button><span className="text-white text-lg font-bold">库位库存</span></div>
        <div className="flex gap-2">
          <input type="text" value={scanLocation} onChange={(e) => setScanLocation(e.target.value)} placeholder="扫描库位码"
            className="flex-1 h-10 px-3 text-sm rounded-lg outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleScan()} autoFocus />
          <button onClick={handleScan} className="h-10 px-4 bg-white text-blue-700 text-sm rounded-lg active:bg-blue-50">查询</button>
        </div>
      </div>
      <div className="flex-1 px-3 py-3 space-y-2">
        {location && (
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 mb-3">
            <p className="text-lg font-bold text-gray-800">📍 {location}</p>
            <p className="text-sm text-gray-500">共 {items.length} 种商品</p>
          </div>
        )}
        {location && items.map((it) => (
          <div key={it.id} className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex justify-between"><span className="text-sm font-bold">{it.productName}</span><span className="text-xs text-gray-400">{it.productCode}</span></div>
            <p className="text-xs text-gray-500 mt-0.5">批次: {it.batch}</p>
            <div className="flex gap-3 mt-1.5 text-sm">
              <span>总: <b>{it.total}</b></span><span className="text-green-600">可用: <b>{it.available}</b></span>
              {it.frozen > 0 && <span className="text-orange-600">冻结: <b>{it.frozen}</b></span>}
            </div>
          </div>
        ))}
        {!location && <div className="text-center py-16"><div className="text-4xl mb-3">🏠</div><p className="text-gray-500">请扫描或输入库位码查询</p></div>}
      </div>
    </div>
  );
}
