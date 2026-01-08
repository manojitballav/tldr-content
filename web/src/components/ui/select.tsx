'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder = 'Select...', className }: SelectProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full appearance-none bg-card border border-border rounded-lg',
          'px-4 py-2.5 pr-10 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          'cursor-pointer hover:bg-card-hover transition-colors'
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

interface MultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ values, onChange, options, placeholder = 'Select...', className }: MultiSelectProps) {
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex flex-wrap gap-1.5 min-h-[42px] bg-card border border-border rounded-lg',
          'px-3 py-2 cursor-pointer'
        )}
      >
        {values.length === 0 ? (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        ) : (
          values.map((value) => (
            <span
              key={value}
              className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded flex items-center gap-1"
            >
              {options.find((o) => o.value === value)?.label || value}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleValue(value);
                }}
                className="hover:text-white"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto hidden group-focus-within:block">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleValue(option.value)}
            className={cn(
              'w-full px-4 py-2 text-left text-sm hover:bg-card-hover',
              values.includes(option.value) && 'bg-accent/10 text-accent'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
