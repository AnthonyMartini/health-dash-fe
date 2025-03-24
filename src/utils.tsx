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

export type DashboardDataProps = {
  username: string;
  day_calories: number;
  day_steps: number;
  day_food: FoodItemProps[];
  day_workout_plan: WorkoutPlanProps[];
  day_macros: MacroProps;
  day_water: number;
  day_sleep: number;
};
