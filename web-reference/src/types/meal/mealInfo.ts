export interface MealInfo {
  date: string;
  menuCategory: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  meals: string[];
}

export interface WeeklyMealResponse {
  status: string;
  data: MealInfo[];
  timestamp: string;
}
