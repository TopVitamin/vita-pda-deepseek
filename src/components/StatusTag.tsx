export type StatusTagStatus =
  | 'pending'
  | 'in_progress'
  | 'partial'
  | 'completed'
  | 'exception'
  | 'cancelled'
  | 'open'
  | 'closed';

export interface StatusTagProps {
  status: StatusTagStatus | string;
  size?: 'sm' | 'md';
}

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
  pending: {
    label: '待作业',
    classes: 'bg-[#f3f4f6] text-[#6b7280]',
  },
  in_progress: {
    label: '作业中',
    classes: 'bg-primary text-white',
  },
  partial: {
    label: '部分完成',
    classes: 'bg-warning/15 text-warning',
  },
  completed: {
    label: '已完成',
    classes: 'bg-success text-white',
  },
  exception: {
    label: '异常',
    classes: 'bg-danger text-white',
  },
  cancelled: {
    label: '已取消',
    classes: 'bg-[#f3f4f6] text-[#9ca3af] line-through',
  },
  open: {
    label: '未封箱',
    classes: 'bg-primary text-white',
  },
  closed: {
    label: '已封箱',
    classes: 'bg-success text-white',
  },
};

function StatusTag({ status, size = 'md' }: StatusTagProps) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    classes: 'bg-[#f3f4f6] text-[#6b7280]',
  };

  const sizeClasses =
    size === 'sm'
      ? { paddingX: 'px-1.5', paddingY: 'py-0.5', fontSize: 12 }
      : { paddingX: 'px-2.5', paddingY: 'py-1', fontSize: 13 };

  return (
    <span
      className={`inline-block rounded-full font-medium whitespace-nowrap ${config.classes}`}
      style={{
        paddingLeft: sizeClasses.paddingX === 'px-1.5' ? 6 : 10,
        paddingRight: sizeClasses.paddingX === 'px-1.5' ? 6 : 10,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: sizeClasses.fontSize,
        lineHeight: '18px',
      }}
    >
      {config.label}
    </span>
  );
}

export default StatusTag;
export { StatusTag };
