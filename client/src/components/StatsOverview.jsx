import React from 'react';
import { Users, Star, Briefcase, Heart, UserCheck } from 'lucide-react';

export default function StatsOverview({ stats, activeFilter, onSelectFilter }) {
  const total = stats?.total || 0;
  const favorites = stats?.favorites || 0;
  const work = stats?.categories?.Work || 0;
  const family = stats?.categories?.Family || 0;
  const friends = stats?.categories?.Friends || 0;

  const cards = [
    {
      id: 'All',
      label: 'Total Contacts',
      value: total,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'Favorites',
      label: 'Starred Favorites',
      value: favorites,
      icon: Star,
      color: 'amber',
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      id: 'Work',
      label: 'Work & Professional',
      value: work,
      icon: Briefcase,
      color: 'indigo',
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      id: 'Family',
      label: 'Family Members',
      value: family,
      icon: Heart,
      color: 'rose',
      bgColor: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      id: 'Friends',
      label: 'Friends & Personal',
      value: friends,
      icon: UserCheck,
      color: 'emerald',
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
              isSelected
                ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.bgColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900">{card.value}</span>
              <span className="text-xs text-slate-400">contacts</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
