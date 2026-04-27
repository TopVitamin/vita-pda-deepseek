export interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = '加载中...' }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ minHeight: 200, padding: '32px 16px' }}
    >
      {/* CSS spinner */}
      <div className="relative" style={{ width: 40, height: 40 }}>
        <div
          className="absolute inset-0 rounded-full border-[3px] border-gray-200"
          style={{ borderTopColor: '#2563eb', animation: 'spin 0.8s linear infinite' }}
        />
      </div>

      <p
        className="text-gray-400 mt-4 text-center"
        style={{ fontSize: 15, lineHeight: '22px' }}
      >
        {message}
      </p>

      {/* Inline keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingState;
export { LoadingState };
