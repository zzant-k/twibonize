import React from 'react';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  displayValue?: string | number;
  onChange: (value: number) => void;
  onReset?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  displayValue,
  onChange,
  onReset,
  disabled = false,
  className = '',
}) => {
  const formattedVal = displayValue !== undefined ? displayValue : `${value}${unit}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <label className="font-medium text-apple-text select-none">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-apple-secondary text-[11px] tabular-nums font-medium">
            {formattedVal}
          </span>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              className="text-[10px] text-apple-secondary hover:text-apple-blue transition-colors px-1 py-0.5 rounded hover:bg-apple-surface disabled:opacity-40"
              title="Reset ke nilai awal"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>
    </div>
  );
};
