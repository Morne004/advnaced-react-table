import { useState, Dispatch, SetStateAction, useCallback } from 'react';

function safelyParseJSON<T>(json: string | null, defaultValue: T): T {
    if (!json) return defaultValue;
    try {
        return JSON.parse(json) as T;
    } catch (error) {
        console.warn('Error parsing JSON from localStorage:', error);
        return defaultValue;
    }
}

/**
 * A custom hook that provides a `useState`-like interface but persists the state to `localStorage`.
 * @param key - The key to use in localStorage.
 * @param initialValue - The initial value to use if no value is found in localStorage.
 * @returns A stateful value and a function to update it.
 */
export const usePersistentState = <T,>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      const initial = initialValue instanceof Function ? initialValue() : initialValue;
      return item ? safelyParseJSON<T>(item, initial) : initial;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
    try {
      setStoredValue(prev => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};