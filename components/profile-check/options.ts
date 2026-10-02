/** Answer options for the free profile check. Shared by the form, the pass and the API. */

export const LEVELS = [
  { id: "ug", label: "Bachelor's", pass: "Bachelor's" },
  { id: "pg", label: "Master's", pass: "Master's" },
  { id: "mba", label: "MBA", pass: "MBA" },
  { id: "mbbs", label: "MBBS", pass: "MBBS" },
  { id: "diploma", label: "Diploma or PG diploma", pass: "Diploma" },
  { id: "phd", label: "PhD", pass: "PhD" },
] as const;

export const QUALIFICATIONS = [
  { id: "12th", label: "12th / Intermediate", pass: "12th" },
  { id: "bachelors", label: "Bachelor's degree", pass: "Degree" },
  { id: "masters", label: "Master's degree", pass: "Master's" },
  { id: "diploma", label: "Diploma", pass: "Diploma" },
] as const;

export const ENGLISH_STATUS = [
  { id: "not-taken", label: "Not taken yet" },
  { id: "booked", label: "Test booked" },
  { id: "taken", label: "Taken, I have a score" },
] as const;

export const ENGLISH_TESTS = [
  { id: "ielts", label: "IELTS", min: 0, max: 9, step: 0.5 },
  { id: "pte", label: "PTE", min: 10, max: 90, step: 1 },
  { id: "toefl", label: "TOEFL", min: 0, max: 120, step: 0.5 },
  { id: "duolingo", label: "Duolingo", min: 10, max: 160, step: 5 },
] as const;

export const BUDGETS = [
  { id: "under-15", label: "Under ₹15 lakh", pass: "< ₹15 L" },
  { id: "15-25", label: "₹15 to 25 lakh", pass: "₹15 to 25 L" },
  { id: "25-40", label: "₹25 to 40 lakh", pass: "₹25 to 40 L" },
  { id: "40-60", label: "₹40 to 60 lakh", pass: "₹40 to 60 L" },
  { id: "over-60", label: "Over ₹60 lakh", pass: "> ₹60 L" },
  { id: "not-sure", label: "Not sure yet", pass: "Not sure" },
] as const;

export type DestinationOption = { slug: string; name: string; code: string };

export const NOT_SURE: DestinationOption = { slug: "not-sure", name: "Not sure yet", code: "???" };

export type Answers = {
  country: string;
  level: string;
  qualification: string;
  scoreType: "percent" | "cgpa";
  score: string;
  englishStatus: string;
  englishTest: string;
  englishScore: string;
  budget: string;
  branch: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

export const EMPTY_ANSWERS: Answers = {
  country: "",
  level: "",
  qualification: "",
  scoreType: "percent",
  score: "",
  englishStatus: "",
  englishTest: "",
  englishScore: "",
  budget: "",
  branch: "",
  name: "",
  phone: "",
  email: "",
  consent: false,
};

export function labelOf<T extends { id: string; label: string }>(list: readonly T[], id: string) {
  return list.find((x) => x.id === id)?.label ?? "";
}
