import { memo } from 'react';

export interface DocumentCardDoc {
  docNo: string;
  typeName: string;
  status: string;
  sourceNo?: string;
  supplier?: string;
  expectedDate?: string;
}

export interface DocumentCardProps {
  doc: DocumentCardDoc;
  onClick?: () => void;
}

function DocumentCard({ doc, onClick }: DocumentCardProps) {
  const { docNo, typeName, status, sourceNo, supplier, expectedDate } = doc;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-[#e5e7eb] shadow-sm transition-colors
        ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}
      style={{ padding: '10px 12px', minHeight: 64 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* 第一行：单据号 + 类型标签 */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900 truncate" style={{ fontSize: 15 }}>
          {docNo}
        </span>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span
            className="rounded px-1.5 py-0.5 whitespace-nowrap"
            style={{
              backgroundColor: '#eef2ff',
              color: '#3949ab',
              fontSize: 11,
            }}
          >
            {typeName}
          </span>
          <span
            className="rounded px-1.5 py-0.5 bg-gray-100 text-gray-500 whitespace-nowrap"
            style={{ fontSize: 11 }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* 第二行：来源 / 供应商 / 预期日期 */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-0.5 mt-1.5" style={{ fontSize: 12 }}>
        {sourceNo && (
          <span className="text-gray-400">
            来源单号: {sourceNo}
          </span>
        )}
        {supplier && (
          <span className="text-gray-400">
            供应商: {supplier}
          </span>
        )}
        {expectedDate && (
          <span className="text-gray-400">
            预期: {expectedDate}
          </span>
        )}
      </div>
    </div>
  );
}

const MemoizedDocumentCard = memo(DocumentCard);
export default MemoizedDocumentCard;
export { DocumentCard };
