import { memo } from 'react';
import type { TaskItem } from '../types';
import StatusTag from './StatusTag';

export interface TaskCardProps {
  task: TaskItem;
  onClick?: () => void;
}

function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    taskNo,
    typeName,
    statusName,
    planQty,
    doneQty,
    deadline,
    priority,
  } = task;

  const progressPct = planQty > 0 ? Math.round((doneQty / planQty) * 100) : 0;
  const isHighPriority = priority === 'high';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border border-[#e5e7eb] active:bg-gray-50 transition-colors
        ${isHighPriority ? 'border-l-[3px] border-l-warning' : 'border-l border-l-[#e5e7eb]'}
        ${onClick ? 'cursor-pointer' : ''}`}
      style={{ minHeight: 72, padding: '10px 12px' }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* 第一行：任务号 + 状态 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-gray-900 truncate" style={{ fontSize: 15 }}>
            {taskNo}
          </span>
          <span
            className="text-xs rounded px-1.5 py-0.5 whitespace-nowrap"
            style={{
              backgroundColor: '#eef2ff',
              color: '#3949ab',
              fontSize: 11,
            }}
          >
            {typeName}
          </span>
          {isHighPriority && (
            <span
              className="text-warning whitespace-nowrap"
              style={{ fontSize: 11 }}
            >
              急
            </span>
          )}
        </div>
        <div className="shrink-0">
          <StatusTag status={task.status} size="sm" />
        </div>
      </div>

      {/* 第二行：进度 */}
      <div className="flex items-center gap-2 mt-2" style={{ fontSize: 13 }}>
        <span className="text-gray-500 whitespace-nowrap">
          {doneQty}/{planQty}
        </span>
        {/* 进度条 */}
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-0">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progressPct >= 100 ? 'bg-success' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
        <span
          className={`whitespace-nowrap font-medium ${
            progressPct >= 100 ? 'text-success' : 'text-gray-600'
          }`}
        >
          {progressPct}%
        </span>
      </div>

      {/* 第三行：截止日期 */}
      {deadline && (
        <div className="mt-1.5" style={{ fontSize: 12 }}>
          <span className="text-gray-400">截止: {deadline}</span>
        </div>
      )}
    </div>
  );
}

const MemoizedTaskCard = memo(TaskCard);
export default MemoizedTaskCard;
export { TaskCard };
