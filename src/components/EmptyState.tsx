export interface EmptyStateProps {
  message?: string;
  icon?: string;
}

function EmptyState({ message = '暂无数据', icon = '📋' }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-[#f5f5f5] w-full rounded-lg"
      style={{ minHeight: 200, padding: '32px 16px' }}
    >
      <span style={{ fontSize: 48, lineHeight: '56px' }}>{icon}</span>
      <p
        className="text-gray-400 mt-3 text-center"
        style={{ fontSize: 16, lineHeight: '24px' }}
      >
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
export { EmptyState };
