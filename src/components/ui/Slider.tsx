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
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <label className="font-medium text-gray-200 select-none">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-blue-400 text-[11px] tabular-nums font-semibold px-2 py-0.5 rounded bg-[#222222] border border-[#333333]">
            {formattedVal}
          </span>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              className="text-[11px] font-medium text-gray-400 hover:text-white transition-colors px-1.5 py-0.5 rounded hover:bg-[#222222] disabled:opacity-40 focus:outline-none"
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
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${percentage}%, #333333 ${percentage}%, #333333 100%)`,
          }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>
    </div>
  );
};
