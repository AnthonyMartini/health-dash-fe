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
  set_count: number;
  sets: SetProps[];
  weight: number;
};

export type WorkoutPlanProps = {
  exercises: ExerciseProps[];
  workout_title: string;
  status: boolean;
};

export type DashboardDataProps = {
  day_calories: number;
  day_steps: number;
  day_food: FoodItemProps[];
  day_workout_plan: WorkoutPlanProps[];
  day_macros: MacroProps;
  day_water: number;
  day_sleep: number;
  day_weight: number;
  day_calories_diff: number;
  day_steps_diff: number;
  day_sleep_diff: number;
  day_water_diff: number;
  previous_day: string;
};
