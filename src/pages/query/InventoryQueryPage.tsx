import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockInventory = [
  { id: '1', productCode: 'P001', productName: '面膜', barcode: 'BAR001', warehouse: 'WH001华南中心仓', location: 'A01-01-01', batch: 'B20260427', total: 50, available: 45, frozen: 5, locked: 0 },
  { id: '2', productCode: 'P001', productName: '面膜', barcode: 'BAR001', warehouse: 'WH001华南中心仓', location: 'B01-01-01', batch: 'B20260420', total: 200, available: 200, frozen: 0, locked: 0 },
  { id: '3', productCode: 'P003', productName: '口红', barcode: 'BAR003', warehouse: 'WH001华南中心仓', location: 'A01-01-02', batch: 'B20260426', total: 150, available: 150, frozen: 0, locked: 0 },
  { id: '4', productCode: 'P004', productName: '纸巾', barcode: 'BAR004', warehouse: 'WH001华南中心仓', location: 'A01-02-01', batch: 'B20260415', total: 500, available: 480, frozen: 10, locked: 10 },
  { id: '5', productCode: 'P006', productName: '保温杯', barcode: 'BAR006', warehouse: 'WH001华南中心仓', location: 'A01-02-03', batch: 'B20260401', total: 20, available: 20, frozen: 0, locked: 0 },
  { id: '6', productCode: 'P007', productName: '数据线', barcode: 'BAR007', warehouse: 'WH002华东电商仓', location: 'C01-01-01', batch: 'B20260410', total: 300, available: 290, frozen: 0, locked: 10 },
];

export default function InventoryQueryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'code' | 'barcode' | 'name' | 'location'>('barcode');
  const [results, setResults] = useState(mockInventory);

  const handleSearch = () => {
    if (!search.trim()) { setResults(mockInventory); return; }
    const q = search.trim().toLowerCase();
    setResults(mockInventory.filter((r) => {
      if (searchType === 'code') return r.productCode.toLowerCase().includes(q);
      if (searchType === 'barcode') return r.barcode.toLowerCase().includes(q);
      if (searchType === 'name') return r.productName.toLowerCase().includes(q);
      if (searchType === 'location') return r.location.toLowerCase().includes(q);
      return true;
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3"><button onClick={() => navigate('/home')} className="text-white text-xl">←</button><span className="text-white text-lg font-bold">库存查询</span></div>
        <div className="flex gap-2 mb-2">
          {[{ k: 'barcode', l: '条码' }, { k: 'code', l: '编码' }, { k: 'name', l: '名称' }, { k: 'location', l: '库位' }].map((t) => (
            <button key={t.k} onClick={() => setSearchType(t.k as typeof searchType)}
              className={`px-2 py-1 text-xs rounded-lg ${searchType === t.k ? 'bg-white text-blue-700' : 'bg-white/20 text-white'}`}>{t.l}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={searchType === 'barcode' ? '扫描或输入条码' : '输入关键词'}
            className="flex-1 h-10 px-3 text-sm rounded-lg outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} autoFocus />
          <button onClick={handleSearch} className="h-10 px-4 bg-white text-blue-700 text-sm font-medium rounded-lg active:bg-blue-50">查询</button>
        </div>
      </div>
      <div className="flex-1 px-3 py-3 space-y-2">
        {results.length === 0 ? (
          <div className="text-center py-16"><div className="text-4xl mb-3">🔍</div><p className="text-gray-500">未找到库存记录</p></div>
        ) : (
          results.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-bold text-gray-800">{r.productName}<span className="text-xs text-gray-400 ml-1">({r.productCode})</span></span>
                <span className="text-xs text-gray-400">{r.barcode}</span>
              </div>
              <div className="flex gap-3 text-xs text-gray-500 mb-2">
                <span>{r.warehouse}</span><span>库位: {r.location}</span><span>批次: {r.batch}</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span>总: <b>{r.total}</b></span>
                <span className="text-green-600">可用: <b>{r.available}</b></span>
                <span className="text-orange-600">冻结: <b>{r.frozen}</b></span>
                <span className="text-blue-600">锁定: <b>{r.locked}</b></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
