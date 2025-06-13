import { useRef, useCallback } from 'react';
import { SwipeConfig } from '../types';

interface SwipeHandlers {
  onSwipeStart: () => void;
  onSwipeMove: (progress: number, event: TouchEvent | MouseEvent) => void;
  onSwipeEnd: (dismissed: boolean) => void;
}

export const useSwipeGesture = (
  config: SwipeConfig,
  handlers: SwipeHandlers
) => {
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const startTime = useRef<number>(0);

  const handleStart = useCallback((clientX: number) => {
    if (!config.enabled) return;

    startX.current = clientX;
    currentX.current = clientX;
    isDragging.current = true;
    startTime.current = Date.now();
    handlers.onSwipeStart();
  }, [config.enabled, handlers]);

  const handleMove = useCallback((clientX: number, event: TouchEvent | MouseEvent) => {
    if (!isDragging.current || !config.enabled) return;

    currentX.current = clientX;
    const deltaX = clientX - startX.current;
    const progress = Math.abs(deltaX) / config.threshold;

    handlers.onSwipeMove(progress, event);
  }, [config.enabled, config.threshold, handlers]);

  const handleEnd = useCallback(() => {
    if (!isDragging.current || !config.enabled) return;

    const deltaX = currentX.current - startX.current;
    const deltaTime = Date.now() - startTime.current;
    const velocity = Math.abs(deltaX) / deltaTime;

    const shouldDismiss =
      Math.abs(deltaX) > config.threshold ||
      velocity > config.velocity;

    isDragging.current = false;
    handlers.onSwipeEnd(shouldDismiss);
  }, [config.enabled, config.threshold, config.velocity, handlers]);

  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX);
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.nativeEvent);
      }
    },
    onTouchEnd: handleEnd,
  };

  const mouseHandlers = {
    onMouseDown: (e: React.MouseEvent) => {
      handleStart(e.clientX);
    },
    onMouseMove: (e: React.MouseEvent) => {
      handleMove(e.clientX, e.nativeEvent);
    },
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
  };

  return { touchHandlers, mouseHandlers };
};
