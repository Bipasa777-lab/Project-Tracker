import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import PriorityBadge from '../shared/PriorityBadge';
import DueBadge from '../shared/DueBadge';
import Avatar from '../shared/Avatar';
import type { Task, User } from '../../types';

// Mock data generator for the Velocity chart
const VELOCITY_DATA = [
  { day: 'Mon', new: 12, completed: 8 },
  { day: 'Tue', new: 15, completed: 12 },
  { day: 'Wed', new: 5,  completed: 18 },
  { day: 'Thu', new: 8,  completed: 25 },
  { day: 'Fri', new: 22, completed: 15 },
  { day: 'Sat', new: 4,  completed: 5 },
  { day: 'Sun', new: 2,  completed: 8 },
];

export default function DashboardView() {
  const allTasks = useStore((s) => s.tasks);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const in48Hours = new Date(now);
  in48Hours.setDate(in48Hours.getDate() + 2);

  // 1. Core Stats
  const stats = useMemo(() => {
    let completed = 0, inProgress = 0, overdue = 0;
    allTasks.forEach(t => {
      if (t.status === 'done') completed++;
      else if (t.status === 'inprogress' || t.status === 'inreview') inProgress++;
      if (t.status !== 'done' && t.dueDate < now) overdue++;
    });
    return { total: allTasks.length, completed, inProgress, overdue };
  }, [allTasks, now]);

  // 2. Critical & Upcoming Tasks (Due soon or Overdue, not done)
  const criticalTasks = useMemo(() => {
    return allTasks
      .filter(t => t.status !== 'done' && t.dueDate <= in48Hours)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);
  }, [allTasks, in48Hours]);

  // 3. Recently Completed Tasks
  const completedTasks = useMemo(() => {
    return allTasks
      .filter(t => t.status === 'done')
      // Simulate recent sorting by just grabbing the last ones arbitrarily, 
      // or sorting by dueDate nearest to today
      .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())
      .slice(0, 5);
  }, [allTasks]);

  // 4. Team Workload
  const teamWorkload = useMemo(() => {
    const map = new Map<string, { user: User, pending: number, completed: number }>();
    allTasks.forEach(t => {
      if (!map.has(t.assignee.id)) map.set(t.assignee.id, { user: t.assignee, pending: 0, completed: 0 });
      const stats = map.get(t.assignee.id)!;
      if (t.status === 'done') stats.completed++;
      else stats.pending++;
    });
    return Array.from(map.values()).sort((a, b) => b.pending - a.pending);
  }, [allTasks]);

  return (
    <div className="flex-1 h-full overflow-auto p-4 sm:p-6 lg:p-8 bg-bg-1">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header section */}
        <div className="flex flex-col gap-1.5 border-b border-border-1 pb-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-sm text-slate-400">Here's what's happening in your workspace today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="Total Tasks" value={stats.total} />
          <StatCard title="Completed" value={stats.completed} highlight="text-green-400" />
          <StatCard title="In Progress" value={stats.inProgress} highlight="text-blue-400" />
          <StatCard title="Overdue" value={stats.overdue} highlight="text-red-400" />
        </div>

        {/* Top Grid Area (Velocity + Workload) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Velocity Bar Chart */}
          <div className="lg:col-span-2 bg-bg-2 border border-border-1 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-200">Velocity (Simulated)</h2>
              <div className="flex items-center gap-4 text-[11px] font-medium">
                <div className="flex items-center gap-1.5 text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500/80"></div> New</div>
                <div className="flex items-center gap-1.5 text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div> Completed</div>
              </div>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-2 mt-4 min-h-[220px]">
              {VELOCITY_DATA.map((data, i) => {
                const maxVal = Math.max(...VELOCITY_DATA.map(d => Math.max(d.new, d.completed)));
                const hNew = (data.new / maxVal) * 100;
                const hComp = (data.completed / maxVal) * 100;
                return (
                  <div key={i} className="flex flex-col items-center flex-1 gap-3 h-full justify-end group cursor-pointer">
                    <div className="flex items-end gap-1 sm:gap-2 w-full justify-center h-[180px]">
                      {/* New Bar */}
                      <div className="w-4 sm:w-8 bg-indigo-500/80 rounded-t-sm transition-all group-hover:bg-indigo-400 relative" style={{ height: `${hNew}%` }}>
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">{data.new}</span>
                      </div>
                      {/* Completed Bar */}
                      <div className="w-4 sm:w-8 bg-emerald-500/80 rounded-t-sm transition-all group-hover:bg-emerald-400 relative" style={{ height: `${hComp}%` }}>
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">{data.completed}</span>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">{data.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Workload */}
          <div className="bg-bg-2 border border-border-1 rounded-2xl p-6 flex flex-col gap-4 shadow-sm h-[320px]">
             <h2 className="text-lg font-semibold text-slate-200">Team Workload</h2>
             <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
               {teamWorkload.map(({ user, pending, completed }) => (
                 <div key={user.id} className="flex items-center gap-3 bg-bg-3 border border-border-1 rounded-xl p-3">
                   <Avatar user={user} size="sm" />
                   <div className="flex flex-col flex-1">
                     <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                     <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-medium text-amber-500/90 bg-amber-500/10 px-1.5 py-0.5 rounded">{pending} Pending</span>
                       <span className="text-[10px] font-medium text-emerald-500/90 bg-emerald-500/10 px-1.5 py-0.5 rounded">{completed} Done</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Bottom Grid Area (Critical vs Completed) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          
          {/* Critical / Upcoming Tasks */}
          <div className="bg-bg-2 border border-border-1 rounded-2xl p-6 flex flex-col gap-4 shadow-sm min-h-[300px]">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                 <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 Critical & Upcoming
               </h2>
               <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">{criticalTasks.length} Tasks</span>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
              {criticalTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-slate-500">No upcoming tasks! 🎉</div>
              ) : criticalTasks.map(task => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Recently Completed Tasks */}
          <div className="bg-bg-2 border border-border-1 rounded-2xl p-6 flex flex-col gap-4 shadow-sm min-h-[300px]">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                 <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 Recently Completed
               </h2>
               <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">{stats.completed} Total</span>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
              {completedTasks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-slate-500">No completed tasks yet.</div>
              ) : completedTasks.map(task => (
                <TaskListItem key={task.id} task={task} isCompleted />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Reusable mini-components inside Dashboard
function StatCard({ title, value, highlight = 'text-white' }: { title: string, value: number, highlight?: string }) {
  return (
    <div className="bg-bg-2 border border-border-1 rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5 transition-all hover:bg-bg-3 border-t-2 hover:border-t-accent shadow-sm">
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
      <span className={`text-2xl sm:text-3xl font-bold ${highlight}`}>{value}</span>
    </div>
  );
}

function TaskListItem({ task, isCompleted }: { task: Task, isCompleted?: boolean }) {
  return (
    <div className={`bg-bg-3 border border-border-1 p-3 rounded-xl flex flex-col gap-2.5 transition-colors hover:border-border-2 ${isCompleted ? 'opacity-70' : ''}`}>
      <span className={`text-sm font-medium leading-tight line-clamp-2 ${isCompleted ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'}`}>
        {task.title}
      </span>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           {!isCompleted && <PriorityBadge priority={task.priority} />}
           <DueBadge date={task.dueDate} />
        </div>
        <div className="flex items-center gap-2">
           {isCompleted && (
             <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               Done
             </span>
           )}
           <Avatar user={task.assignee} size="sm" />
        </div>
      </div>
    </div>
  );
}
