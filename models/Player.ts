import { DateTime } from 'luxon';

export interface Player {
  name: string;
  goalkeeper: boolean;
  captain: boolean;
  number: number;
  goals: Array<DateTime>; // Number of goals = number of entries.
  assists: Array<DateTime>; // Number of assists = number of entries.
  penaltyMinutes: Array<{ time: DateTime; minutes: number }>; // Penalties can have different amount, so need a complex object.
}
