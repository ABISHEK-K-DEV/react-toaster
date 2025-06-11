import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeStart?: (e: TouchEvent | MouseEvent) => void;
  onSwipeMove?: (progress: number, e: TouchEvent | MouseEvent) => void;
  onSwipeEnd?: (dismissed: boolean, e: TouchEvent | MouseEvent) => void;
}

interface SwipeConfig {
  threshold: number;
  velocity: number;
  enabled: boolean;
}

export const useSwipeGesture = (
  config: SwipeConfig,
  handlers: SwipeHandlers
) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const startTime = useRef(0);
  const isDragging = useRef(false);

  const handleStart = useCallback((e: TouchEvent | MouseEvent) => {
    if (!config.enabled) return;

    try {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      startX.current = clientX;
      startY.current = clientY;
      currentX.current = clientX;
      startTime.current = Date.now();
      isDragging.current = true;

      handlers.onSwipeStart?.(e);
    } catch (error) {
      // Handle potential touch event errors
      isDragging.current = false;
    }
  }, [config.enabled, handlers]);

  const handleMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDragging.current || !config.enabled) return;

    try {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const deltaX = clientX - startX.current;
      const deltaY = clientY - startY.current;

      // Prevent vertical scrolling interference
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isDragging.current = false;
        return;
      }

      currentX.current = clientX;
      const progress = Math.abs(deltaX) / config.threshold;

      handlers.onSwipeMove?.(Math.min(progress, 1), e);

      // Prevent default to avoid scrolling
      e.preventDefault();
    } catch (error) {
      isDragging.current = false;
    }
  }, [config, handlers]);

  const handleEnd = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDragging.current || !config.enabled) return;

    const deltaX = currentX.current - startX.current;
    const deltaTime = Date.now() - startTime.current;
    const velocity = Math.abs(deltaX) / deltaTime;

    const dismissed = Math.abs(deltaX) >= config.threshold || velocity >= config.velocity;

    handlers.onSwipeEnd?.(dismissed, e);

    isDragging.current = false;
  }, [config, handlers]);

  const touchHandlers = {
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
  };

  const mouseHandlers = {
    onMouseDown: handleStart,
    onMouseMove: handleMove,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
  };

  return { touchHandlers, mouseHandlers };
};
