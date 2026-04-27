import { useState, useCallback } from 'react';

export interface BottomActionBarProps {
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  dangerLabel?: string;
  onDanger?: () => void;
}

function BottomActionBar({
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryLoading = false,
  secondaryLabel,
  onSecondary,
  dangerLabel,
  onDanger,
}: BottomActionBarProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = primaryLoading || internalLoading;

  const handlePrimary = useCallback(() => {
    if (loading || primaryDisabled) return;
    setInternalLoading(true);
    try {
      onPrimary?.();
    } finally {
      // Release loading after a short delay in case the handler is sync
      setTimeout(() => setInternalLoading(false), 500);
    }
  }, [loading, primaryDisabled, onPrimary]);

  const hasSecondaryOrDanger = !!(secondaryLabel || dangerLabel);
  const hasOnlyPrimary = primaryLabel && !hasSecondaryOrDanger;

  // Spinner component
  const Spinner = () => (
    <svg
      className="animate-spin mr-2"
      style={{ width: 18, height: 18 }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
        className="opacity-75"
      />
    </svg>
  );

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="flex items-stretch gap-3"
        style={{ padding: '10px 14px', minHeight: 56 }}
      >
        {hasOnlyPrimary && (
          <button
            onClick={handlePrimary}
            disabled={primaryDisabled || loading}
            className={`flex-1 flex items-center justify-center rounded-lg text-white font-medium select-none
              ${
                primaryDisabled || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary active:bg-primary-dark'
              }`}
            style={{ minHeight: 48, fontSize: 16 }}
          >
            {loading && <Spinner />}
            {primaryLabel}
          </button>
        )}

        {!hasOnlyPrimary && (
          <>
            {/* 主按钮 */}
            {primaryLabel && (
              <button
                onClick={handlePrimary}
                disabled={primaryDisabled || loading}
                className={`flex-1 flex items-center justify-center rounded-lg text-white font-medium select-none
                  ${
                    primaryDisabled || loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary active:bg-primary-dark'
                  }`}
                style={{ minHeight: 48, fontSize: 16 }}
              >
                {loading && <Spinner />}
                {primaryLabel}
              </button>
            )}

            {/* 次要按钮 */}
            {secondaryLabel && (
              <button
                onClick={onSecondary}
                disabled={loading}
                className={`flex-1 flex items-center justify-center rounded-lg border-2 border-[#e5e7eb] bg-white text-gray-700 font-medium select-none active:bg-gray-50
                  ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                style={{ minHeight: 48, fontSize: 16 }}
              >
                {secondaryLabel}
              </button>
            )}

            {/* 危险按钮 */}
            {dangerLabel && (
              <button
                onClick={onDanger}
                disabled={loading}
                className={`flex-1 flex items-center justify-center rounded-lg border-2 border-danger text-danger font-medium select-none bg-white active:bg-red-50
                  ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                style={{ minHeight: 48, fontSize: 16 }}
              >
                {dangerLabel}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BottomActionBar;
export { BottomActionBar };
