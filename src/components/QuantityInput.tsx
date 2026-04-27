import { useState, useCallback } from 'react';

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
}

function QuantityInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  disabled = false,
  label,
}: QuantityInputProps) {
  const [editValue, setEditValue] = useState<string | null>(null);

  const isMin = value <= min;
  const isMax = max !== undefined && value >= max;

  const emitChange = useCallback(
    (newValue: number) => {
      let clamped = newValue;
      if (clamped < min) {
        clamped = min;
      }
      if (max !== undefined && clamped > max) {
        clamped = max;
      }
      if (clamped !== value) {
        onChange(clamped);
      } else if (clamped === value && clamped === min && min > 0) {
        // Allow re-emitting if we want to go from min back up — no-op if same value
      }
    },
    [value, min, max, onChange],
  );

  const handleDecrement = () => {
    if (disabled || isMin) return;
    emitChange(value - step);
  };

  const handleIncrement = () => {
    if (disabled || isMax) return;
    emitChange(value + step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setEditValue('');
      return;
    }
    // Only allow digits
    if (/^\d*$/.test(raw)) {
      setEditValue(raw);
    }
  };

  const handleInputBlur = () => {
    if (editValue !== null) {
      const parsed = parseInt(editValue, 10);
      if (!isNaN(parsed)) {
        emitChange(parsed);
      }
      setEditValue(null);
    }
  };

  const handleInputFocus = () => {
    setEditValue(String(value));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  const displayValue = editValue !== null ? editValue : String(value);

  return (
    <div className="w-full" style={{ minHeight: 56 }}>
      {label && (
        <p className="text-gray-600 mb-1 px-1" style={{ fontSize: 13 }}>
          {label}
        </p>
      )}
      <div className="flex items-center justify-center" style={{ minHeight: 56 }}>
        {/* 减少按钮 */}
        <button
          onClick={handleDecrement}
          disabled={disabled || isMin}
          className={`flex items-center justify-center rounded-lg border-2 select-none shrink-0
            ${disabled || isMin
              ? 'border-[#e5e7eb] text-gray-300 bg-gray-50'
              : 'border-primary text-primary bg-white active:bg-primary/10'
            }`}
          style={{ width: 48, height: 48, fontSize: 28, lineHeight: '28px' }}
          aria-label="减少数量"
        >
          −
        </button>

        {/* 数量显示/编辑 */}
        <div className="flex flex-col items-center mx-4 min-w-0">
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            className="text-center font-bold text-gray-900 bg-transparent outline-none w-20 border-b-2 border-transparent focus:border-primary transition-colors"
            style={{ fontSize: 24, minHeight: 44, lineHeight: '32px' }}
            autoComplete="off"
          />
          {max !== undefined && (
            <span className="text-gray-400" style={{ fontSize: 11, lineHeight: '16px' }}>
              最多{max}
            </span>
          )}
        </div>

        {/* 增加按钮 */}
        <button
          onClick={handleIncrement}
          disabled={disabled || isMax}
          className={`flex items-center justify-center rounded-lg border-2 select-none shrink-0
            ${disabled || isMax
              ? 'border-[#e5e7eb] text-gray-300 bg-gray-50'
              : 'border-primary text-primary bg-white active:bg-primary/10'
            }`}
          style={{ width: 48, height: 48, fontSize: 28, lineHeight: '28px' }}
          aria-label="增加数量"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantityInput;
export { QuantityInput };
