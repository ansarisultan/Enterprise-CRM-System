import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../ui/Input';

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or company..."
          className="glass-input pl-10 pr-4 py-2.5 text-sm"
        />
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/5 rounded-xl px-3 py-2.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-800/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>
    </div>
  );
}
