import { memo } from 'react';

export interface StepGuideProps {
  steps: string[];
  currentStep: number;
}

function StepGuide({ steps, currentStep }: StepGuideProps) {
  return (
    <div className="w-full bg-white border-b border-[#e5e7eb]" style={{ padding: '14px 10px' }}>
      <div className="flex items-start justify-between">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ flex: '1 1 0', minWidth: 0 }}
            >
              {/* 节点行：圆圈 + 连线 */}
              <div className="flex items-center w-full">
                {/* 左侧连线 */}
                {index > 0 && (
                  <div
                    className="flex-1"
                    style={{ height: 2, backgroundColor: isCompleted ? '#2563eb' : '#e5e7eb' }}
                  />
                )}
                {index === 0 && <div className="flex-1" />}

                {/* 圆圈 */}
                <div className="shrink-0 flex items-center justify-center">
                  {isCompleted ? (
                    <div
                      className="rounded-full flex items-center justify-center bg-primary text-white"
                      style={{ width: 26, height: 26 }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: 14, height: 14 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : isCurrent ? (
                    <div
                      className="rounded-full flex items-center justify-center bg-primary text-white"
                      style={{
                        width: 26,
                        height: 26,
                        fontSize: 12,
                        fontWeight: 600,
                        animation: 'pulse-step 2s ease-in-out infinite',
                      }}
                    >
                      {stepNum}
                    </div>
                  ) : (
                    <div
                      className="rounded-full flex items-center justify-center bg-gray-200 text-gray-500"
                      style={{ width: 26, height: 26, fontSize: 12, fontWeight: 500 }}
                    >
                      {stepNum}
                    </div>
                  )}
                </div>

                {/* 右侧连线 */}
                {index < steps.length - 1 && (
                  <div
                    className="flex-1"
                    style={{
                      height: 2,
                      backgroundColor: isCompleted ? '#2563eb' : '#e5e7eb',
                    }}
                  />
                )}
                {index === steps.length - 1 && <div className="flex-1" />}
              </div>

              {/* 步骤名 */}
              <span
                className={`text-center mt-1.5 truncate w-full ${
                  isCurrent ? 'text-primary font-medium' : 'text-gray-400'
                }`}
                style={{ fontSize: 11, lineHeight: '16px' }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse-step {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0); }
        }
      `}</style>
    </div>
  );
}

const MemoizedStepGuide = memo(StepGuide);
export default MemoizedStepGuide;
export { StepGuide };
