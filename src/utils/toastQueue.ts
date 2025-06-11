import { Toast, ToastQueue, ToastPriority } from '../types';

const PRIORITY_VALUES: Record<ToastPriority, number> = {
  low: 0,
  normal: 1,
  high: 2,
  urgent: 3,
};

export class SmartQueue {
  private queue: Toast[] = [];
  private config: ToastQueue;

  constructor(config: ToastQueue) {
    this.config = config;
  }

  add(toast: Toast): Toast[] {
    // Check if we need to group toasts
    if (this.config.grouping && toast.config.groupId) {
      this.handleGrouping(toast);
    } else {
      this.queue.push(toast);
    }

    // Sort by priority and timestamp
    if (this.config.strategy === 'priority') {
      this.sortByPriority();
    }

    // Enforce max toasts limit
    this.enforceLimit();

    return [...this.queue];
  }

  remove(id: string): Toast[] {
    this.queue = this.queue.filter(toast => toast.id !== id);
    return [...this.queue];
  }

  removeGroup(groupId: string): Toast[] {
    this.queue = this.queue.filter(toast => toast.config.groupId !== groupId);
    return [...this.queue];
  }

  update(id: string, updates: Partial<Toast>): Toast[] {
    this.queue = this.queue.map(toast =>
      toast.id === id ? { ...toast, ...updates } : toast
    );
    return [...this.queue];
  }

  clear(): Toast[] {
    this.queue = [];
    return [];
  }

  getAll(): Toast[] {
    return [...this.queue];
  }

  setConfig(config: Partial<ToastQueue>): void {
    this.config = { ...this.config, ...config };
  }

  private handleGrouping(newToast: Toast): void {
    const groupToasts = this.queue.filter(
      toast => toast.config.groupId === newToast.config.groupId
    );

    if (groupToasts.length >= this.config.maxPerGroup) {
      // Remove oldest in group if using FIFO, or newest if using LIFO
      const toRemove = this.config.strategy === 'lifo' 
        ? groupToasts[groupToasts.length - 1]
        : groupToasts[0];
      
      this.queue = this.queue.filter(toast => toast.id !== toRemove.id);
    }

    // Stack toasts if stackable - use a counter approach instead of JSX
    if (newToast.config.stackable && groupToasts.length > 0) {
      const existingToast = groupToasts[0];
      // Instead of JSX, we'll update the content to show count
      if (typeof existingToast.content === 'string' && typeof newToast.content === 'string') {
        existingToast.content = `${existingToast.content} (+${groupToasts.length + 1})`;
      }
      // Increment a stack count property
      (existingToast as any).stackCount = ((existingToast as any).stackCount || 1) + 1;
      return;
    }

    this.queue.push(newToast);
  }

  private sortByPriority(): void {
    this.queue.sort((a, b) => {
      const priorityDiff = PRIORITY_VALUES[b.config.priority] - PRIORITY_VALUES[a.config.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by timestamp
      return b.timestamp - a.timestamp;
    });
  }

  private enforceLimit(): void {
    if (this.queue.length > this.config.maxToasts) {
      const excess = this.queue.length - this.config.maxToasts;
      
      if (this.config.strategy === 'lifo') {
        // Remove newest (last added)
        this.queue = this.queue.slice(0, -excess);
      } else {
        // Remove oldest (first added)
        this.queue = this.queue.slice(excess);
      }
    }
  }
}
