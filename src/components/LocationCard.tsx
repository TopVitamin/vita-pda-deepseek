import { memo } from 'react';

export interface LocationCardProps {
  locationCode: string;
  status?: string;
  selected?: boolean;
  onClick?: () => void;
}

function LocationCard({
  locationCode,
  status,
  selected = false,
  onClick,
}: LocationCardProps) {
  const borderClass = selected
    ? 'border-2 border-primary bg-blue-50/30'
    : 'border border-[#e5e7eb] bg-white';

  return (
    <div
      onClick={onClick}
      className={`rounded-lg flex items-center ${borderClass} transition-colors
        ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}
      style={{ minHeight: 44, paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* 位置图标 */}
      <span
        className="shrink-0 mr-3"
        style={{ fontSize: 22, lineHeight: '28px' }}
      >
        📍
      </span>

      {/* 库位编码 */}
      <span
        className="font-medium text-gray-900 flex-1 truncate"
        style={{ fontSize: 16, lineHeight: '24px' }}
      >
        {locationCode}
      </span>

      {/* 状态 */}
      {status && (
        <span
          className="shrink-0 ml-2 text-gray-400"
          style={{ fontSize: 12, lineHeight: '18px' }}
        >
          {status}
        </span>
      )}

      {/* 右箭头 */}
      {onClick && (
        <span className="text-gray-300 ml-1" style={{ fontSize: 16 }}>
          ›
        </span>
      )}
    </div>
  );
}

const MemoizedLocationCard = memo(LocationCard);
export default MemoizedLocationCard;
export { LocationCard };
