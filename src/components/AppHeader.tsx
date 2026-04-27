import { useNavigate } from 'react-router-dom';

export interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: { label: string; onClick: () => void };
  showWarehouse?: boolean;
  warehouseName?: string;
}

function AppHeader({
  title,
  onBack,
  rightAction,
  showWarehouse = false,
  warehouseName,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-primary" style={{ minHeight: 48 }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ minHeight: 48 }}>
        {/* 左侧返回按钮 */}
        <button
          onClick={handleBack}
          className="flex items-center justify-center text-white rounded active:opacity-70"
          style={{ width: 44, height: 44, fontSize: 20 }}
          aria-label="返回"
        >
          &#8249;
        </button>

        {/* 中间标题 */}
        <div className="flex-1 text-center min-w-0">
          <h1
            className="text-white font-medium truncate px-2"
            style={{ fontSize: 16, lineHeight: '22px' }}
          >
            {title}
          </h1>
          {showWarehouse && warehouseName && (
            <p
              className="text-white/75 truncate px-2"
              style={{ fontSize: 12, lineHeight: '18px' }}
            >
              {warehouseName}
            </p>
          )}
        </div>

        {/* 右侧操作 */}
        {rightAction ? (
          <button
            onClick={rightAction.onClick}
            className="text-white text-sm px-2 rounded active:opacity-70 whitespace-nowrap"
            style={{ minHeight: 44, minWidth: 44, fontSize: 14 }}
          >
            {rightAction.label}
          </button>
        ) : (
          <div style={{ width: 44 }} />
        )}
      </div>
    </header>
  );
}

export default AppHeader;
export { AppHeader };
