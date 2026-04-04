import { Filter, ChevronDown, Check, Search, X } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
  label?: string;
  colorClass?: string;
}

export function FilterDropdown({ options, activeOption, onSelect, label = "Filter by", colorClass = "accent-blue" }: Props) {
  const [search, setSearch] = useState('')
  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="mb-8">
      <DropdownMenu onOpenChange={(open) => !open && setSearch('')}>
        <DropdownMenuTrigger asChild>
          <button className={`group flex items-center gap-2.5 px-6 py-3.5 bg-card hover:bg-secondary/80 border border-border/50 rounded-2xl text-sm font-bold text-foreground transition-all shadow-lg shadow-black/5 focus:outline-none focus:ring-4 focus:ring-${colorClass}/10 cursor-pointer active:scale-95`}>
            <Filter className={`w-4 h-4 text-muted-foreground group-hover:text-${colorClass} transition-colors`} />
            <span className="text-muted-foreground font-medium">{label}:</span>
            <span className={`text-${colorClass} truncate max-w-[150px] tracking-tight`}>{activeOption}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-1 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={`w-64 rounded-3xl bg-card/90 backdrop-blur-2xl border border-border/40 shadow-2xl p-2 z-[200] animate-in fade-in zoom-in-95 duration-200`}>
          <div className="p-2 mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search filters..." 
                className="w-full bg-secondary/50 border border-border/30 rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue/30 placeholder:text-muted-foreground/50"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-border/30 rounded-md">
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <DropdownMenuItem 
                  key={opt}
                  onClick={() => onSelect(opt)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all outline-none mb-1
                    ${activeOption === opt 
                      ? `bg-${colorClass} text-white shadow-md shadow-${colorClass}/20` 
                      : `text-foreground hover:bg-secondary hover:translate-x-1`}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${activeOption === opt ? 'border-white/40 bg-white/20' : 'border-border/30 bg-secondary'}`}>
                    {activeOption === opt && <Check className="w-3 h-3" />}
                  </div>
                  <span className="flex-1 truncate">{opt}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground italic">No matches found</div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
