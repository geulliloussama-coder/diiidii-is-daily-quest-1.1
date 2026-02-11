
export type TaskStatus = 'pending' | 'completed' | 'missed';

export interface DailyTask {
  id: string;
  title: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  status: TaskStatus;
}

export interface PunishmentState {
  isActive: boolean;
  timeLeft: number; // seconds
  redemptionTask: string;
  originTaskId: string | null;
}
