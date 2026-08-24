import { addMonths } from "./dates";

export const AMC_VISITS_PER_YEAR = 4;

export type GeneratedVisit = {
  visitNumber: number;
  visitDate: string;
  status: "complete" | "pending";
};

/**
 * An AMC contract is serviced 4 times a year (every ~3 months) from the
 * contract date. A visit is automatically marked complete once its scheduled
 * date has passed.
 */
export function generateAmcVisits(contractDate: string): GeneratedVisit[] {
  const visits: GeneratedVisit[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= AMC_VISITS_PER_YEAR; i++) {
    const dateStr = addMonths(contractDate, (i - 1) * 3);
    const d = new Date(`${dateStr}T00:00:00`);
    visits.push({
      visitNumber: i,
      visitDate: dateStr,
      status: d <= today ? "complete" : "pending",
    });
  }
  return visits;
}
