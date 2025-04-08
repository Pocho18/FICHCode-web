export type MenuType = null | "settings" | "archive" | "search" | "user"
export type HistoryType = {
    title: string,
    updatedAt?: number,
    createdAt?: number,
    content: string,
    id: string
}
export type TabType = {
    title: HistoryType['title'],
    id: HistoryType['id']
}

export type ExecutionAction = 'start' | 'stop' | 'output';

export interface ExecutionEventDetail {
  action: ExecutionAction;
  data?: string;
  error?: string;
}

export interface ExecutionEvent extends CustomEvent {
  detail: ExecutionEventDetail;
}

declare global {
  interface WindowEventMap {
    'fichcode-execution': ExecutionEvent;
  }
}