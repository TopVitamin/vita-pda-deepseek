import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TaskItem } from '../../types';

const exceptionTasks: TaskItem[] = [
  { taskId: '1', taskNo: 'RCV-20260426-004', type: 'receive', typeName: '收货', docNo: 'PO20260426004', status: 'exception', statusName: '异常', planQty: 100, doneQty: 60, priority: 'high' },
  { taskId: '2', taskNo: 'QC-20260426-001', type: 'qc', typeName: '质检', docNo: 'PO20260426005', status: 'exception', statusName: '异常', planQty: 150, doneQty: 80, priority: 'high' },
  { taskId: '3', taskNo: 'PK-20260425-001', type: 'picking', typeName: '拣货', docNo: 'SO20260425001', status: 'exception', statusName: '异常', planQty: 60, doneQty: 25, priority: 'normal' },
];

export default function ExceptionTaskPage() {
  const navigate = useNavigate();
  const [tasks] = useState<TaskItem[]>(exceptionTasks);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-600 px-4 pt-3 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/home')} className="text-white text-xl">←</button>
          <span className="text-white text-lg font-bold">异常任务</span>
        </div>
        <p className="text-blue-100 text-sm mt-2">共 {tasks.length} 个异常任务待处理</p>
      </div>
      <div className="flex-1 px-3 py-3 space-y-2">
        {tasks.map((task) => (
          <div key={task.taskId} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-base font-bold text-gray-800">{task.taskNo}</span>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded mr-2">{task.typeName}</span>
                  关联单号: {task.docNo}
                </p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">异常</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>应作业: <b>{task.planQty}</b></span>
              <span>已作业: <b>{task.doneQty}</b></span>
              <span>差异: <b className="text-red-600">{task.planQty - task.doneQty}</b></span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/exception/detail')} className="flex-1 py-2 bg-red-600 text-white text-sm rounded-lg active:bg-red-700">
                查看异常详情
              </button>
              <button className="flex-1 py-2 border border-red-300 text-red-600 text-sm rounded-lg active:bg-red-50">
                提交处理
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
