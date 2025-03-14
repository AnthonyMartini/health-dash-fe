export type MacroProps = {
  carb: number;
  fat: number;
  protein: number;
};

export type FoodItemProps = {
  title: string;
  macros: MacroProps;
  calories: number;
};

export type SetProps = {
  weight: number;
  set: number;
  reps: number;
};

export type ExerciseProps = {
  title: string;
  sets: SetProps[];
  set_count: number;
};

export type WorkoutPlanProps = {
  exercises: ExerciseProps[];
  workout_title: string;
  status: boolean;
};
type ResponseData = {
  data: DashboardDataProps[];
};
export type DashboardDataProps = {
  date: string;
  day_calories: number;
  day_steps: number;
  day_food: FoodItemProps[];
  SK: string;
  day_workout_plan: WorkoutPlanProps[];
  PK: string;
  day_macros: MacroProps;
  day_water: number;
  day_sleep: number;
};

export async function fetchDashboard({
  username,
  date,
}: {
  username: string;
  date: string;
}): Promise<DashboardDataProps | null> {
  try {
    const response = await fetch(
      `/api/health-data/?username=${username}&date=${date}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result: ResponseData = await response.json();
    return result.data[0];
  } catch {
    return null;
  }
}
