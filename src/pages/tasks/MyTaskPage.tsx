import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TaskItem } from '../../types';

const myTasks: TaskItem[] = [
  { taskId: '1', taskNo: 'PK-20260427-001', type: 'picking', typeName: '拣货', docNo: 'SO20260427001', status: 'in_progress', statusName: '作业中', planQty: 150, doneQty: 60, deadline: '2026-04-27 17:00', priority: 'high' },
  { taskId: '2', taskNo: 'RCV-20260427-002', type: 'receive', typeName: '收货', docNo: 'PO20260427002', status: 'in_progress', statusName: '作业中', planQty: 80, doneQty: 35, priority: 'normal' },
  { taskId: '3', taskNo: 'CNT-20260427-001', type: 'counting', typeName: '盘点', docNo: 'CNT20260427001', status: 'in_progress', statusName: '作业中', planQty: 500, doneQty: 120, deadline: '2026-04-28 12:00', priority: 'normal' },
  { taskId: '4', taskNo: 'RPL-20260427-001', type: 'replenish', typeName: '补货', docNo: 'RPL20260427001', status: 'pending', statusName: '待作业', planQty: 200, doneQty: 0, priority: 'high' },
  { taskId: '5', taskNo: 'PK-20260427-002', type: 'picking', typeName: '拣货', docNo: 'SO20260427002', status: 'pending', statusName: '待作业', planQty: 90, doneQty: 0, priority: 'normal' },
];

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    partial: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    exception: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

export default function MyTaskPage() {
  const navigate = useNavigate();
  const [tasks] = useState<TaskItem[]>(myTasks);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-600 px-4 pt-3 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">我的任务</span>
        </div>
        <p className="text-blue-100 text-sm mt-2">共 {tasks.length} 个任务</p>
      </div>
      <div className="flex-1 px-3 py-3 space-y-2">
        {tasks.map((task) => (
          <div key={task.taskId} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold text-gray-800">{task.taskNo}</span>
                  {task.priority === 'high' && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">急</span>}
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
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>应作业: <b>{task.planQty}</b></span>
              <span>已作业: <b className="text-blue-600">{task.doneQty}</b></span>
              <span>进度: <b>{Math.round((task.doneQty / task.planQty) * 100)}%</b></span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((task.doneQty / task.planQty) * 100)}%` }} />
            </div>
            {task.deadline && <p className="text-xs text-gray-400 mt-2">截止: {task.deadline}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
