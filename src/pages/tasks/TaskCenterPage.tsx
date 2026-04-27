import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TaskItem } from '../../types';

const mockTasks: TaskItem[] = [
  { taskId: '1', taskNo: 'RCV-20260427-001', type: 'receive', typeName: '收货', docNo: 'PO20260427001', status: 'pending', statusName: '待作业', planQty: 120, doneQty: 0, priority: 'high' },
  { taskId: '2', taskNo: 'RCV-20260427-002', type: 'receive', typeName: '收货', docNo: 'PO20260427002', status: 'in_progress', statusName: '作业中', planQty: 80, doneQty: 35, priority: 'normal' },
  { taskId: '3', taskNo: 'QC-20260427-001', type: 'qc', typeName: '质检', docNo: 'PO20260426003', status: 'pending', statusName: '待作业', planQty: 200, doneQty: 0, priority: 'high' },
  { taskId: '4', taskNo: 'PTW-20260427-001', type: 'putaway', typeName: '上架', docNo: 'PO20260426001', status: 'pending', statusName: '待作业', planQty: 350, doneQty: 0, deadline: '2026-04-27 18:00', priority: 'high' },
  { taskId: '5', taskNo: 'PK-20260427-001', type: 'picking', typeName: '拣货', docNo: 'SO20260427001', status: 'in_progress', statusName: '作业中', planQty: 150, doneQty: 60, deadline: '2026-04-27 17:00', priority: 'high' },
  { taskId: '6', taskNo: 'PK-20260427-002', type: 'picking', typeName: '拣货', docNo: 'SO20260427002', status: 'pending', statusName: '待作业', planQty: 90, doneQty: 0, priority: 'normal' },
  { taskId: '7', taskNo: 'SORT-20260427-001', type: 'sorting', typeName: '分拣', docNo: 'WAVE20260427001', status: 'pending', statusName: '待作业', planQty: 300, doneQty: 0, priority: 'normal' },
  { taskId: '8', taskNo: 'RCK-20260427-001', type: 'recheck', typeName: '复核', docNo: 'SO20260427003', status: 'pending', statusName: '待作业', planQty: 45, doneQty: 0, priority: 'normal' },
  { taskId: '9', taskNo: 'BOX-20260427-001', type: 'packing', typeName: '装箱', docNo: 'SO20260427004', status: 'pending', statusName: '待作业', planQty: 60, doneQty: 0, priority: 'normal' },
  { taskId: '10', taskNo: 'WGH-20260427-001', type: 'weighing', typeName: '称重', docNo: 'BOX-20260427-001', status: 'pending', statusName: '待作业', planQty: 12, doneQty: 0, priority: 'low' },
  { taskId: '11', taskNo: 'SHIP-20260427-001', type: 'ship', typeName: '发运', docNo: 'SO20260426001', status: 'pending', statusName: '待作业', planQty: 24, doneQty: 0, deadline: '2026-04-27 19:00', priority: 'high' },
  { taskId: '12', taskNo: 'MV-20260427-001', type: 'move', typeName: '移库', docNo: 'MV20260427001', status: 'pending', statusName: '待作业', planQty: 50, doneQty: 0, priority: 'low' },
  { taskId: '13', taskNo: 'RPL-20260427-001', type: 'replenish', typeName: '补货', docNo: 'RPL20260427001', status: 'pending', statusName: '待作业', planQty: 200, doneQty: 0, priority: 'high' },
  { taskId: '14', taskNo: 'CNT-20260427-001', type: 'counting', typeName: '盘点', docNo: 'CNT20260427001', status: 'in_progress', statusName: '作业中', planQty: 500, doneQty: 120, deadline: '2026-04-28 12:00', priority: 'normal' },
  { taskId: '15', taskNo: 'PK-20260426-003', type: 'picking', typeName: '拣货', docNo: 'SO20260426003', status: 'completed', statusName: '已完成', planQty: 200, doneQty: 200, priority: 'normal' },
  { taskId: '16', taskNo: 'RCV-20260426-004', type: 'receive', typeName: '收货', docNo: 'PO20260426004', status: 'exception', statusName: '异常', planQty: 100, doneQty: 60, priority: 'high' },
  { taskId: '17', taskNo: 'PK-20260426-005', type: 'picking', typeName: '拣货', docNo: 'SO20260426005', status: 'cancelled', statusName: '已取消', planQty: 30, doneQty: 0, priority: 'low' },
];

const typeFilterOptions = [
  { value: '', label: '全部类型' },
  { value: 'receive', label: '收货' },
  { value: 'qc', label: '质检' },
  { value: 'putaway', label: '上架' },
  { value: 'picking', label: '拣货' },
  { value: 'sorting', label: '分拣' },
  { value: 'recheck', label: '复核' },
  { value: 'packing', label: '装箱' },
  { value: 'weighing', label: '称重' },
  { value: 'ship', label: '发运' },
  { value: 'move', label: '移库' },
  { value: 'replenish', label: '补货' },
  { value: 'counting', label: '盘点' },
];

const statusFilterOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待作业' },
  { value: 'in_progress', label: '作业中' },
  { value: 'partial', label: '部分完成' },
  { value: 'completed', label: '已完成' },
  { value: 'exception', label: '异常' },
  { value: 'cancelled', label: '已取消' },
];

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    partial: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    exception: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-400 line-through',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const getPriorityBadge = (priority: string) => {
  if (priority === 'high') return <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 ml-1" />;
  return null;
};

export default function TaskCenterPage() {
  const navigate = useNavigate();
  const [tasks] = useState<TaskItem[]>(mockTasks);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = tasks.filter((t) => {
    if (typeFilter && t.type !== typeFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-600 px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">任务中心</span>
        </div>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 h-9 px-3 text-sm rounded-lg bg-white/20 text-white border border-white/30 outline-none [&>option]:text-gray-800">
            {typeFilterOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 h-9 px-3 text-sm rounded-lg bg-white/20 text-white border border-white/30 outline-none [&>option]:text-gray-800">
            {statusFilterOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 px-3 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 text-base">暂无任务</p>
          </div>
        ) : (
          filtered.map((task) => (
            <div key={task.taskId} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-gray-800">{task.taskNo}</span>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded mr-2">{task.typeName}</span>
                    关联单号: {task.docNo}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.statusName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>应作业: <b className="text-gray-800">{task.planQty}</b></span>
                  <span>已作业: <b className="text-blue-600">{task.doneQty}</b></span>
                  {task.planQty > 0 && (
                    <span>进度: <b className="text-gray-800">{Math.round((task.doneQty / task.planQty) * 100)}%</b></span>
                  )}
                </div>
                {task.deadline && (
                  <span className="text-xs text-gray-400">截止: {task.deadline}</span>
                )}
              </div>
              {task.planQty > 0 && (
                <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'exception' ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.round((task.doneQty / task.planQty) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
