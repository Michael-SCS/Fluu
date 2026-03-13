export type RepeatType =
  | "once"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type UserHabit = {
  id: string;

  templateId: string;
  name: string;
  icon: string;
  type: string;

  startDate: string;

  repeatType: RepeatType;

  repeatConfig?: any;

  streak: number;
  doneToday: boolean;

  value?: number;
  goal?: number;
};
