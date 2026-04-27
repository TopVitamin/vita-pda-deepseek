import { useState, useRef, useEffect, useCallback } from 'react';

export interface ScanInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onScan: (value: string) => void;
  autoFocus?: boolean;
  error?: string;
  success?: boolean;
  icon?: string;
}

function ScanInput({
  placeholder,
  value,
  onChange,
  onScan,
  autoFocus = true,
  error,
  success = false,
  icon = '📦',
}: ScanInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim()) {
        e.preventDefault();
        onScan(value.trim());
      }
    },
    [value, onScan],
  );

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const borderColor = error
    ? 'border-danger'
    : showSuccess
    ? 'border-success'
    : isFocused
    ? 'border-primary'
    : 'border-[#e5e7eb]';

  return (
    <div className="w-full">
      <div
        className={`flex items-center bg-white rounded-lg border-2 ${borderColor} transition-colors duration-200`}
        style={{ minHeight: 50 }}
      >
        {/* 左侧图标 */}
        <span
          className="flex items-center justify-center text-xl shrink-0"
          style={{ width: 48, height: 50, fontSize: 20 }}
        >
          {icon}
        </span>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 py-2 pr-2"
          style={{ fontSize: 16, minHeight: 48 }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* 清除按钮 */}
        {value && (
          <button
            onClick={handleClear}
            className="flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0 mr-1"
            style={{ width: 40, height: 40, fontSize: 18 }}
            aria-label="清除"
          >
            ✕
          </button>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-danger mt-1.5 px-1" style={{ fontSize: 13, lineHeight: '18px' }}>
          {error}
        </p>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <p className="text-success mt-1.5 px-1" style={{ fontSize: 13, lineHeight: '18px' }}>
          扫描成功
        </p>
      )}
    </div>
  );
}

export default ScanInput;
export { ScanInput };
