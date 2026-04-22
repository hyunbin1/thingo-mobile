import { useEffect, useState } from 'react';

/**
 * 디바운싱을 적용합니다. value와 delay를 입력하면 value가 delay 시간 이후에 return됩니다.
 * @param value 디바운싱할 대상 값.
 * @param delay 디바운싱 지연 시간 (ms).
 * @returns 디바운싱이 적용된 값.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  /**
   * value가 변경되면 새롭게 타이머를 카운트합니다.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    /**
     * cleanup 함수: 다음 effect가 실행되기 전이나 컴포넌트가 unmount될 때
     * 현재 진행 중인 타이머를 취소합니다.
     */
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
