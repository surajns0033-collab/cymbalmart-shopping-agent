import React from 'react';
import { PrepTask } from '../types';
import { Clock, Check, Calendar, Plus, ShoppingBag, Sparkles, Utensils } from 'lucide-react';

interface PrepTimelineViewProps {
  tasks: PrepTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask?: (task: Omit<PrepTask, 'id' | 'isCompleted'>) => void;
}

export const PrepTimelineView: React.FC<PrepTimelineViewProps> = ({
  tasks,
  onToggleTask
}) => {
  const timeframeHeaders: Record<string, { label: string; sub: string; badge: string }> = {
    '3_days_before': { label: '3 Days Before Event', sub: 'Non-perishables, dry goods, decor & liquor shopping', badge: 'bg-blue-100 text-blue-800' },
    '1_day_before': { label: '1 Day Before Event', sub: 'Fresh meats/produce shopping, marinating, batch chilling', badge: 'bg-purple-100 text-purple-800' },
    'day_of_morning': { label: 'Day of Event (Morning)', sub: 'Ice pickup, slow cooking, station staging', badge: 'bg-amber-100 text-amber-800' },
    '1_hour_before': { label: '1 Hour Before Guests Arrive', sub: 'Guacamole/dips, lighting candles, music playlist, drink pitcher', badge: 'bg-rose-100 text-rose-800' },
    'during_party': { label: 'During Event', sub: 'Ice refills, warm food replenishment, trash checks', badge: 'bg-emerald-100 text-emerald-800' }
  };

  const timeframes = ['3_days_before', '1_day_before', 'day_of_morning', '1_hour_before', 'during_party'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-bold text-stone-900">Host Prep & Countdown Schedule</h2>
            <p className="text-xs text-stone-500">
              Stress-free timeline to keep shopping, cooking, and party staging organized
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-4">
        {timeframes.map((tf) => {
          const tfTasks = (tasks || []).filter((t) => t.timeframe === tf);
          if (tfTasks.length === 0) return null;

          const info = timeframeHeaders[tf] || { label: tf, sub: '', badge: 'bg-stone-100 text-stone-800' };

          return (
            <div key={tf} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              
              {/* Header */}
              <div className="px-5 py-3.5 bg-stone-50/80 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{info.label}</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${info.badge}`}>
                      {tfTasks.filter(t => t.isCompleted).length}/{tfTasks.length} Done
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{info.sub}</p>
                </div>
              </div>

              {/* Tasks List */}
              <div className="divide-y divide-stone-100">
                {tfTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="p-4 flex items-start gap-3 hover:bg-stone-50/50 cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                        task.isCompleted
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-stone-300 hover:border-amber-500 bg-white text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-medium leading-relaxed block ${
                          task.isCompleted ? 'line-through text-stone-400' : 'text-stone-800'
                        }`}
                      >
                        {task.task}
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md shrink-0">
                      {task.category.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
