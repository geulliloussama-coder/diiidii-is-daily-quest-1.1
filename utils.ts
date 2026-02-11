
export const getCurrentTimeString = () => {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + 
         now.getMinutes().toString().padStart(2, '0');
};

export const isTimeAfter = (timeStr: string, compareStr: string) => {
  return timeStr >= compareStr;
};

export const getTimeRemainingSeconds = (endTimeStr: string) => {
  const now = new Date();
  const [hours, minutes] = endTimeStr.split(':').map(Number);
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / 1000));
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
