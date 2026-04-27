function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const H = pad(d.getHours());
  const m = pad(d.getMinutes());
  return `${M}-${D} ${H}:${m}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  return `${Y}-${M}-${D}`;
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const H = pad(d.getHours());
  const m = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return `${H}:${m}:${s}`;
}

export function getToday(): string {
  const d = new Date();
  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  return `${Y}-${M}-${D}`;
}

const TYPE_MAP: Record<string, string> = {
  receive: '收货',
  qc: '质检',
  putaway: '上架',
  picking: '拣货',
  sorting: '分拣',
  recheck: '复核',
  packing: '装箱',
  weighing: '称重',
  ship: '发运',
  move: '移库',
  relocate: '移位',
  replenish: '补货',
  counting: '盘点',
};

export function formatTaskType(type: string): string {
  return TYPE_MAP[type] || type;
}

const STATUS_MAP: Record<string, string> = {
  pending: '待作业',
  in_progress: '作业中',
  partial: '部分完成',
  completed: '已完成',
  exception: '异常',
  cancelled: '已取消',
};

export function formatStatus(status: string): string {
  return STATUS_MAP[status] || status;
}
