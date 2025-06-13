import { Toast, ToastQueue, ToastPriority } from '../types';

export class SmartQueue {
  private toasts: Toast[] = [];
  private config: ToastQueue;

  constructor(config: ToastQueue) {
    this.config = config;
  }

  add(toast: Toast): Toast[] {
    // Handle priority queuing
    if (this.config.strategy === 'priority') {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const insertIndex = this.toasts.findIndex(
        t => priorityOrder[t.config.priority] > priorityOrder[toast.config.priority]
      );
      
      if (insertIndex === -1) {
        this.toasts.push(toast);
      } else {
        this.toasts.splice(insertIndex, 0, toast);
      }
    } else if (this.config.strategy === 'lifo') {
      this.toasts.unshift(toast);
    } else {
      this.toasts.push(toast);
    }

    // Handle grouping
    if (this.config.grouping && toast.config.groupId) {
      const groupCount = this.toasts.filter(t => t.config.groupId === toast.config.groupId).length;
      if (groupCount > this.config.maxPerGroup) {
        const oldestInGroup = this.toasts.find(t => t.config.groupId === toast.config.groupId);
        if (oldestInGroup) {
          this.remove(oldestInGroup.id);
        }
      }
    }

    // Enforce max toasts limit
    while (this.toasts.length > this.config.maxToasts) {
      if (this.config.strategy === 'lifo') {
        this.toasts.pop();
      } else {
        this.toasts.shift();
      }
    }

    return [...this.toasts];
  }

  remove(id: string): Toast[] {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    return [...this.toasts];
  }

  removeGroup(groupId: string): Toast[] {
    this.toasts = this.toasts.filter(toast => toast.config.groupId !== groupId);
    return [...this.toasts];
  }

  update(id: string, updates: Partial<Toast>): Toast[] {
    this.toasts = this.toasts.map(toast =>
      toast.id === id ? { ...toast, ...updates } : toast
    );
    return [...this.toasts];
  }

  clear(): Toast[] {
    this.toasts = [];
    return [];
  }

  getAll(): Toast[] {
    return [...this.toasts];
  }

  setConfig(newConfig: Partial<ToastQueue>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
