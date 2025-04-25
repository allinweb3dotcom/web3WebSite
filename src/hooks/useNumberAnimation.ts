import { useState, useEffect, useRef } from 'react';

interface AnimationState {
  value: number;
  prevValue: number;
  isAnimating: boolean;
}

export const useNumberAnimation = (targetValue: number, duration: number = 1000) => {
  const [state, setState] = useState<AnimationState>({
    value: targetValue,
    prevValue: targetValue,
    isAnimating: false,
  });

  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (targetValue === state.value) return;

    setState(prev => ({
      value: prev.value,
      prevValue: prev.value,
      isAnimating: true,
    }));

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = state.prevValue + (targetValue - state.prevValue) * progress;

      setState(prev => ({
        ...prev,
        value: currentValue,
        isAnimating: progress < 1,
      }));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetValue, duration]);

  return {
    value: state.value,
    isAnimating: state.isAnimating,
  };
};