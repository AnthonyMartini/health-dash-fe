import React, { ReactElement, useState, useEffect, useRef } from "react";
import { IoFootsteps } from "react-icons/io5";
import { IoIosWater } from "react-icons/io";
import { GiNightSleep } from "react-icons/gi";
import { FaFire, FaCalendarAlt } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import { RiDrinks2Fill } from "react-icons/ri";
import SideBar from "../components/SideBar";
import { CiTrash } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useUser } from "../GlobalContext.tsx";
import { apiService } from "../utils/APIService";

import { FoodItemProps, WorkoutPlanProps, DashboardDataProps } from "../utils";
interface DashboardProps {
  Page?: string;
}
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//removes unwanted properties from data to send to api
const filterData = (data: any): DashboardDataProps => {
  console.log("Filter Data input", data.day_workout_plan);
  return {
    day_calories: data.day_calories ?? 0,
    day_steps: data.day_steps ?? 0,
    day_food: Array.isArray(data.day_food) ? data.day_food : [],
    day_workout_plan: Array.isArray(data.day_workout_plan)
      ? data.day_workout_plan
      : [],
    day_macros: {
      protein: data.day_macros?.protein ?? 0,
      carb: data.day_macros?.carb ?? 0,
      fat: data.day_macros?.fat ?? 0,
    },
    day_water: data.day_water ?? 0,
    day_sleep: data.day_sleep ?? 0,
    day_weight: data.day_weight ?? 0,
    day_calories_diff: data.day_calories_diff ?? 0,
    day_sleep_diff: data.day_sleep_diff ?? 0,
    day_steps_diff: data.day_steps_diff ?? 0,
    day_water_diff: data.day_water_diff ?? 0,
    previous_day: data.previous_day ?? "previous day",
  };
};
//If workout is not in health data but is in weekly plan, we pull it from weekly plan
const filterWorkout = (dataArray: any[]): WorkoutPlanProps[] => {
  return dataArray.map((data) => ({
    workout_title: data.workoutcard_title,
    status: false,
    exercises: Array.isArray(data.workoutcard_content?.exercises)
      ? data.workoutcard_content.exercises.map((exercise: any) => ({
          title: exercise.title,
          set_count: exercise.sets,
          sets: Array.from({ length: exercise.sets }, (_, i) => ({
            set: i + 1,
            weight: 0,
            reps: 0,
          })), // Initialize sets with one empty set
        })) // Initialize weight to 0
      : [],
  }));
};

function getPreviousDayLabel(previousDate: string): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const easternYesterday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(yesterday);

  return previousDate === easternYesterday ? "yesterday" : previousDate;
}
interface CircularProgressBarProps {
  radius: number; // Radius of the circle
  strokeWidth: number; // Width of the progress stroke
  percentage: number; // Progress percentage (0-100)
  color: string; // Color of the progress stroke (Tailwind class, e.g., 'stroke-blue-500')
  trackColor: string; // Color of the background track (Tailwind class, e.g., 'stroke-gray-200')
  center: { x: number; y: number }; // Center coordinates { x, y }
}

const CircularProgressBar = ({
  radius, // Radius of the circle
  strokeWidth, // Width of the progress stroke
  percentage, // Progress percentage (0-100)
  color, // Color of the progress stroke (Tailwind class, e.g., 'stroke-blue-500')
  trackColor, // Color of the background track (Tailwind class, e.g., 'stroke-gray-200')
  center, // Center coordinates { x, y }
}: CircularProgressBarProps) => {
  // Ensure percentage is within 0-100
  const validPercentage = Math.max(0, Math.min(100, percentage));

  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;
  // Calculate the stroke offset based on the percentage
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <>
      {/* Background Track */}
      <circle
        className={trackColor}
        strokeWidth={strokeWidth}
        stroke="currentColor" // Use Tailwind class for color
        fill="transparent"
        r={radius}
        cx={center.x}
        cy={center.y}
      />
      {/* Progress Fill */}
      <circle
        className={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round" // Makes the ends of the progress line rounded
        stroke="currentColor" // Use Tailwind class for color
        fill="transparent"
        r={radius}
        cx={center.x}
        cy={center.y}
        // Rotate by -90 degrees to start the progress from the top
        transform={`rotate(-90 ${center.x} ${center.y})`}
        style={{ transition: "stroke-dashoffset 0.35s ease-in-out" }} // Smooth transition
      />
    </>
  );
};

interface ConcentricProgressBarProps {
  barsData: Array<{
    amount: number; // Current value
    target: number; // Target value
    color?: string; // Optional color for the bar (Tailwind class)
    trackColor?: string; // Optional track color (Tailwind class)
  }>;
  size?: number; // Size of the SVG canvas (default 200)
  strokeWidth?: number; // Width of the progress stroke (default 10)
}

// Component to render multiple concentric progress bars
const ConcentricProgressBars = ({
  barsData,
  size = 200,
  strokeWidth = 10,
}: ConcentricProgressBarProps) => {
  // Calculate the center of the SVG canvas
  const center = { x: size / 2, y: size / 2 };
  // Calculate the maximum possible radius leaving space for the outermost stroke
  const maxRadius = size / 2 - strokeWidth / 2;
  // Calculate the gap between circles based on the number of bars
  // Ensure there's a minimum gap, e.g., half the stroke width
  const totalStrokeSpace = strokeWidth * barsData.length;
  const remainingRadius = maxRadius - totalStrokeSpace / 2; // Adjust space calculation
  const radiusStep =
    barsData.length > 1 ? remainingRadius / barsData.length : 0; // Step between radii

  // Define Tailwind color classes for the bars (add more if needed)
  // Fallback colors if not provided in barsData
  const defaultColors = [
    "stroke-blue-500",
    "stroke-green-500",
    "stroke-yellow-500",
    "stroke-red-500",
    "stroke-purple-500",
    "stroke-pink-500",
  ];
  const defaultTrackColor = "stroke-gray-200"; // Default track color

  return (
    <div className="flex items-center justify-center p-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {barsData.map((bar, index) => {
          // Calculate the radius for the current bar
          // Start from the largest radius for the outermost bar
          const radius = maxRadius - index * (strokeWidth + radiusStep * 0.5); // Adjust spacing calculation

          // Calculate the percentage, handle target being 0
          const percentage =
            bar.target > 0 ? (bar.amount / bar.target) * 100 : 0;

          // Get color for the bar, cycle through defaults if not provided
          const color =
            bar.color || defaultColors[index % defaultColors.length];
          const trackColor = bar.trackColor || defaultTrackColor;

          // Basic validation for radius
          if (radius <= 0) {
            console.warn(
              `Calculated radius for bar ${index} is too small or negative. Check size, strokeWidth, and number of bars.`
            );
            return null; // Don't render if radius is invalid
          }

          return (
            <CircularProgressBar
              key={index}
              radius={radius}
              strokeWidth={strokeWidth}
              percentage={percentage}
              color={color}
              trackColor={trackColor}
              center={center}
            />
          );
        })}
        {/* Optional: Add text in the center */}
        {/* <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-lg font-semibold fill-gray-700">
          Progress
        </text> */}
      </svg>
    </div>
  );
};

//Define Card Array
interface MetricCardProps {
  metric: string;
  units: string;
  value: number;
  icon: ReactElement;
  trend: number;
  previous_day: string;
  setMetric: (metric: string) => void;
  isToday: boolean;
}
const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  value,
  icon,
  trend,
  units,
  setMetric,
  previous_day = null,
  isToday = true,
}) => {
  return (
    <div
      onClick={() => isToday && setMetric(metric)}
      className={`w-[145px] sm:w-[180px] xl:w-[220px] h-[110px] sm:h-[130px] bg-white p-3 flex flex-col rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.1)] 
                 ${
                   isToday
                     ? "hover:shadow-md hover:scale-[1.03] transition-all duration-200 cursor-pointer"
                     : "opacity-80"
                 }`}
    >
      <div className="w-full h-[30px] text-lg flex text-[#5C6670]">
        <span className="flex-1 text-[16px] sm:text-[18px]">{metric}</span>
        <div className="hidden sm:block">{icon}</div>
      </div>
      <div className="w-full flex-1 items-end flex gap-1">
        <span className="text-3xl sm:text-4xl font-bold">{value}</span>
        {units && <span className="text-slate-500 font-bold">{units}</span>}
      </div>
      <div
        className={`w-full h-[30px] text-[10px] sm:text-[12px] font-bold flex items-center ${
          trend > 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {trend > 0 ? "↑ " : "↓ "}
        {Math.abs(trend)}% from {getPreviousDayLabel(previous_day ?? "")}
      </div>
    </div>
  );
};

interface ContentCardProps {
  content: ReactElement;
  title: string;
  actionText?: string;
  action?: () => void;
  isToday: boolean;
}
const ContentCard: React.FC<ContentCardProps> = ({
  content,
  title,
  actionText,
  action,
  isToday = true,
}) => {
  return (
    <div
      className={`w-[310px] sm:w-[380px] xl:w-[460px] min-h-[310px] sm:min-h-[380px] xl:min-h-[460px] bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)] rounded-xl p-2 flex flex-col
        ${
          isToday
            ? "hover:shadow-md hover:scale-[1.01] transition-all duration-200"
            : "opacity-80"
        }`}
    >
      <div
        className={`flex items-center justify-between ${
          isToday ? "cursor-pointer" : ""
        }`}
        onClick={isToday ? action : undefined}
      >
        <span className="text-[#5C6670] text-[16px] sm:text-lg font-semibold">
          {title}
        </span>
        {actionText && isToday && (
          <span
            className="text-red-500 text-[13px] sm:text-md hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              action?.();
            }}
          >
            {actionText}
          </span>
        )}
      </div>

      <div
        className="w-full flex-1 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = () => {
  const { user } = useUser(); // grab user data from context
  const [logMetric, setLogMetric] = useState("");
  const [logMetricValue, setLogMetricValue] = useState(0.0);
  const [logConsumption, setLogConsumption] = useState(false);
  const [logConsumptionValue, setLogConsumptionValue] = useState({
    title: "",
    macros: { protein: 0.0, carb: 0.0, fat: 0.0 },
    calories: 0.0,
  });
  const [logPlan, setLogPlan] = useState<WorkoutPlanProps>({
    workout_title: "",
    exercises: [],
    status: false,
  });
  const [editLogPLan, setEditLogPlan] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardDataProps>(filterData({}));
  const [weightEmbedUrl, setWeightEmbedUrl] = useState("");
  const [macrosEmbedUrl, setMacrosEmbedUrl] = useState("");

  function getTotalMacros(arr: FoodItemProps[]): {
    protein: number;
    carb: number;
    fat: number;
  } {
    const total = { protein: 0, carb: 0, fat: 0, calories: 0 };
    arr.forEach((item) => {
      total.protein += item.macros.protein;
      total.fat += item.macros.fat;
      total.carb += item.macros.carb;
      total.calories += item.calories;
    });
    setProgressData([
      {
        target: 100,
        amount: total.protein,
        color: "stroke-[#FFA500]",
        blobcolor: "bg-[#FFA500]",
        trackColor: "stroke-[#fadfaf]",
        label: "Prot",
      }, // Bar 1 (outermost)
      {
        target: 200,
        amount: total.carb,
        color: "stroke-[#007AFF]",
        blobcolor: "bg-[#007AFF]",
        trackColor: "stroke-[#b8daff]",
        label: "Carbs",
      }, // Bar 2
      {
        target: 50,
        amount: total.fat,
        color: "stroke-[#AF52DE]",
        blobcolor: "bg-[#AF52DE]",
        trackColor: "stroke-[#cda6e0]",
        label: "Fat",
      }, // Bar 3
      {
        target: 2200,
        amount: total.calories,
        color: "stroke-[#37ed37]",
        blobcolor: "bg-[#37ed37]",
        trackColor: "stroke-[#c8fac8]",
        label: "Cal",
      },
    ]);
    return total;
  }

  const [progressData, setProgressData] = useState([
    // Match colors from the image provided (Orange, Blue, Purple, Indigo)
    {
      target: 100,
      amount: 0,
      color: "stroke-[#FFA500]",
      blobcolor: "bg-[#FFA500]",
      trackColor: "stroke-[#fadfaf]",
      label: "Prot",
    }, // Bar 1 (outermost)
    {
      target: 200,
      amount: 0,
      color: "stroke-[#007AFF]",
      blobcolor: "bg-[#007AFF]",
      trackColor: "stroke-[#b8daff]",
      label: "Carbs",
    }, // Bar 2
    {
      target: 50,
      amount: 0,
      color: "stroke-[#AF52DE]",
      blobcolor: "bg-[#AF52DE]",
      trackColor: "stroke-[#cda6e0]",
      label: "Fat",
    }, // Bar 3
    {
      target: 2200,
      amount: 0,
      color: "stroke-[#37ed37]",
      blobcolor: "bg-[#37ed37]",
      trackColor: "stroke-[#c8fac8]",
      label: "Cal",
    }, // Bar 4 (innermost)
  ]);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/New_York",
      });

      // Step 1: Get today's health data
      let filteredData;
      try {
        const result = await apiService.request("GET_HEALTH_DATA", {
          queryParams: { date: today },
        });
        console.log("Fetched today's workouts:", result.data.day_workout_plan);
        filteredData = filterData(result.data);
        getTotalMacros(result.data.day_food || []);
      } catch {
        filteredData = filterData({});
      }

      // Set the base data
      setData(filteredData);

      // Step 2: Then get weekly plan, after we have filteredData
      try {
        const result2 = await apiService.request("GET_WEEKLY_PLAN", {
          queryParams: {},
        });

        const dayofweek = days[new Date().getDay()];
        const workouts = filterWorkout(result2.data[dayofweek]);

        const missingWorkouts = workouts.filter(
          (workout) =>
            !filteredData.day_workout_plan.find(
              (existing) => existing.workout_title === workout.workout_title
            )
        );

        console.log("Missing workouts:", missingWorkouts);

        setData({
          ...filteredData,
          day_workout_plan: [
            ...filteredData.day_workout_plan,
            ...missingWorkouts,
          ],
        });

        console.log("WEEKLY PLAN", workouts);
      } catch (err) {
        console.error("Failed to fetch weekly plan", err);
      }
    }

    async function fetchEmbedUrls() {
      try {
        const response = await apiService.request("QUICKSIGHT");
        setWeightEmbedUrl(response.weightEmbedUrl);
        setMacrosEmbedUrl(response.macrosEmbedUrl);
      } catch (err) {
        console.error("Failed to load QuickSight iframe URLs:", err);
      }
    }

    fetchEmbedUrls();
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);

    try {
      // Format date to match API expected format (YYYY-MM-DD)
      const formattedDate = date.toLocaleDateString("en-CA", {
        timeZone: "America/New_York",
      });

      // Fetch health data for the selected date
      const result = await apiService.request("GET_HEALTH_DATA", {
        queryParams: { date: formattedDate },
      });

      // If no data is returned, create an empty data object
      const emptyData = {
        day_calories: 0,
        day_steps: 0,
        day_food: [],
        day_workout_plan: [],
        day_macros: {
          protein: 0,
          carb: 0,
          fat: 0,
        },
        day_foood: [],
        day_water: 0,
        day_sleep: 0,
        day_weight: 0,
        day_calories_diff: 0,
        day_sleep_diff: 0,
        day_steps_diff: 0,
        day_water_diff: 0,
        previous_day: "previous day",
      };

      // Update the dashboard data with the fetched data or empty data if undefined
      const filteredData = result?.data
        ? filterData(result.data)
        : filterData(emptyData);
      setData(filteredData);
      getTotalMacros(filteredData.day_food || []);

      // Fetch and update weekly plan if needed
      try {
        const result2 = await apiService.request("GET_WEEKLY_PLAN", {
          queryParams: {},
        });

        const dayofweek = days[date.getDay()];
        const workouts = result2?.data?.[dayofweek]
          ? filterWorkout(result2.data[dayofweek])
          : [];

        const missingWorkouts = workouts.filter(
          (workout) =>
            !filteredData.day_workout_plan.find(
              (existing) => existing.workout_title === workout.workout_title
            )
        );

        setData({
          ...filteredData,
          day_workout_plan: [
            ...filteredData.day_workout_plan,
            ...missingWorkouts,
          ],
        });
      } catch (err) {
        console.error("Failed to fetch weekly plan", err);
        // If weekly plan fetch fails, just keep the current workout plan data
      }
    } catch (error) {
      console.error("Error fetching data for selected date:", error);
      // Set all data to 0 if there's an error
      setData(
        filterData({
          day_calories: 0,
          day_steps: 0,
          day_food: [],
          day_workout_plan: [],
          day_macros: {
            protein: 0,
            carb: 0,
            fat: 0,
          },
          day_water: 0,
          day_sleep: 0,
          day_weight: 0,
          day_calories_diff: 0,
          day_sleep_diff: 0,
          day_steps_diff: 0,
          day_water_diff: 0,
          previous_day: "previous day",
        })
      );
    }
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isFuture = date > today;

      days.push(
        <div
          key={`day-${i}`}
          className={`w-8 h-8 flex items-center justify-center rounded-full
            ${
              isFuture
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
            }
            ${isToday ? "bg-blue-100" : ""}
            ${isSelected ? "bg-blue-500 text-white" : ""}
          `}
          onClick={() => !isFuture && handleDateSelect(date)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  //Update LogWorkout object when user changes weight or reps
  function updateLogWorkout(
    exerciseIndex: number,
    setIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
    field: "weight" | "reps"
  ) {
    let value = Number(e.target.value);

    // Normalize invalid values to 0
    if (field === "reps" && (value < 0 || value > 100)) {
      value = 0;
    } else if (field === "weight" && (value < 0 || value > 1000)) {
      value = 0;
    }
    setLogPlan({
      ...logPlan,
      exercises: logPlan.exercises.map((exEdit, idx) => {
        if (idx === exerciseIndex) {
          return {
            ...exEdit,
            sets: exEdit.sets.map((setEdit, setIdx) => {
              if (setIdx === setIndex) {
                if (field === "reps") {
                  return {
                    ...setEdit,
                    reps: value,
                  };
                } else {
                  return {
                    ...setEdit,
                    weight: value,
                  };
                }
              } else {
                return setEdit;
              }
            }),
          };
        } else {
          return {
            ...exEdit,
          };
        }
      }),
    });
  }

  async function updateDB(update: DashboardDataProps) {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });

    // Create a clean update object with only non-zero and non-empty values
    const cleanUpdate: any = {};

    // Only include non-zero numeric values
    if (update.day_calories > 0) cleanUpdate.day_calories = update.day_calories;
    if (update.day_steps > 0) cleanUpdate.day_steps = update.day_steps;
    if (update.day_sleep > 0) cleanUpdate.day_sleep = update.day_sleep;
    if (update.day_water > 0) cleanUpdate.day_water = update.day_water;
    if (update.day_weight > 0) cleanUpdate.day_weight = update.day_weight;

    // Only include non-empty arrays
    if (update.day_food && update.day_food.length > 0) {
      cleanUpdate.day_food = update.day_food;
    }
    if (update.day_workout_plan && update.day_workout_plan.length > 0) {
      cleanUpdate.day_workout_plan = update.day_workout_plan;
    }

    // Only include macros if any of them are non-zero
    if (update.day_macros) {
      const macros = update.day_macros;
      if (macros.protein > 0 || macros.carb > 0 || macros.fat > 0) {
        cleanUpdate.day_macros = {
          protein: macros.protein || 0,
          carb: macros.carb || 0,
          fat: macros.fat || 0,
        };
      }
    }

    console.log("clean update", cleanUpdate);
    await apiService.request("UPDATE_HEALTH_DATA", {
      queryParams: { date: today },
      body: cleanUpdate,
    });
  }

  const Consumption: FoodItemProps[] | undefined = data?.day_food;

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="h-full w-full flex md:flex-row flex-col ">
      <SideBar SelectedPage="Dashboard" />
      <div className="h-full flex-1 p-4 overflow-clip bg-gray-50/90 overflow-y-scroll">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold h-[40px] pb-2">
              Welcome Back, {user?.first_name}
            </h1>
            <h3 className="text-base font-semibold text-[#5C6670] h-[40px]">
              Here is your health overview for{" "}
              {isToday ? "today" : selectedDate.toLocaleDateString()}:
            </h3>
          </div>
          <div className="relative" ref={calendarRef}>
            <div className="relative">
              <FaCalendarAlt
                className="w-7 h-7 p-1 cursor-pointer hover:bg-gray-300 rounded-full text-gray-600"
                onClick={() => setShowCalendar(!showCalendar)}
              />
            </div>
            {showCalendar && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white shadow-[0_2px_6px_rgba(13,26,38,0.15)] rounded-lg p-4 z-50"
                style={{ position: "fixed", top: "100px", right: "20px" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() =>
                      setSelectedDate(
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth() - 1,
                          1
                        )
                      )
                    }
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ←
                  </button>
                  <span className="font-semibold">
                    {selectedDate.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedDate(
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth() + 1,
                          1
                        )
                      )
                    }
                    className="text-gray-600 hover:text-gray-800"
                  >
                    →
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="w-8 h-8 flex items-center justify-center"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays()}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-row gap-[20px] w-full justify-center flex-wrap">
            <MetricCard
              metric="Calories Burnt"
              value={data?.day_calories ?? 0}
              icon={<FaFire fill="#fc7703" />}
              trend={data?.day_calories_diff ?? 0}
              previous_day={data.previous_day}
              units=""
              setMetric={() => setLogMetric("Calories")}
              isToday={isToday}
            />
            <MetricCard
              metric="Steps"
              value={data?.day_steps ?? 0}
              icon={<IoFootsteps />}
              trend={data?.day_steps_diff ?? 0}
              units=""
              previous_day={data.previous_day}
              setMetric={() => setLogMetric("Steps")}
              isToday={isToday}
            />
            <MetricCard
              metric="Sleep Duration"
              value={data?.day_sleep ?? 0}
              icon={<GiNightSleep fill="#c603fc" />}
              trend={data?.day_sleep_diff ?? 0}
              previous_day={data.previous_day}
              units="h"
              setMetric={() => setLogMetric("Sleep")}
              isToday={isToday}
            />
            <MetricCard
              metric="Water Intake"
              value={data?.day_water ?? 0}
              icon={<IoIosWater fill="#5555FF" />}
              trend={data?.day_water_diff ?? 0}
              previous_day={data.previous_day}
              units="L"
              setMetric={() => setLogMetric("Water")}
              isToday={isToday}
            />
          </div>
          <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap">
            <ContentCard
              title="Weight"
              action={() => setLogMetric("Weight")}
              content={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="border-2 border-gray-200 w-[365px] h-[320px] overflow-hidden rounded-lg">
                    {weightEmbedUrl ? (
                      <iframe
                        title="Weight Visual"
                        src={weightEmbedUrl}
                        className="w-full h-full border-none"
                        style={{}}
                      />
                    ) : (
                      <div className="text-center text-sm text-gray-400">
                        Loading weight visual...
                      </div>
                    )}
                  </div>
                </div>
              }
              isToday={isToday}
            />
            <ContentCard
              title="Macros"
              content={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="border-2 border-gray-200 w-[365px] h-[320px] overflow-hidden rounded-lg">
                    <ConcentricProgressBars
                      barsData={progressData}
                      size={200} // Overall size of the SVG container
                      strokeWidth={12} // Width of each progress bar stroke
                    />
                    <div className="mt-6 grid grid-cols-2 gap-x-2 gap-y-2 w-full max-w-xs">
                      {progressData.map((bar, index) => (
                        // Each item in the grid
                        <div
                          key={index}
                          className="text-sm text-gray-600 text-center p-2 rounded-lg bg-white shadow-sm"
                        >
                          {/* Optional: Add a color indicator dot */}
                          <span
                            className={`inline-block w-3 h-3 rounded-full mr-2 ${bar.blobcolor}`}
                          ></span>
                          {/* Display label and progress */}
                          <span className="font-small">
                            {bar.label || `Bar ${index + 1}`}:
                          </span>{" "}
                          {bar.amount.toFixed(0)} / {bar.target}
                        </div>
                      ))}
                    </div>
                    {macrosEmbedUrl ? (
                      <iframe
                        title="Macros Visual"
                        src={macrosEmbedUrl}
                        className="w-full h-full border-none hidden"
                        style={{ minHeight: "300px" }}
                      />
                    ) : (
                      <div className="text-center text-sm text-gray-400">
                        Loading macros visual...
                      </div>
                    )}
                  </div>
                </div>
              }
              isToday={isToday}
            />
          </div>
          <div className="flex flex-row gap-[20px] w-full p-2 justify-center flex-wrap">
            <ContentCard
              title={`${isToday ? "Today's" : selectedDate.toLocaleDateString()}'s Consumption`}
              action={() => setLogConsumption(true)}
              actionText={isToday ? "Add Consumption" : undefined}
              content={
                <div className="w-full flex-1 rounded-lg gap-2 flex flex-col p-2">
                  {Consumption?.map((item, index) => (
                    <div
                      key={`item-${index}`}
                      className="w-full h-[50px] text-[11px] sm:text-[14px] flex items-center shadow-lg p-2 gap-1 bg-[#f7f7f7] rounded-lg"
                    >
                      {item.title === "food" ? (
                        <FaBowlFood fill="#964B00" />
                      ) : (
                        <RiDrinks2Fill fill="blue" />
                      )}
                      <div className="flex-1">
                        <span className="font-semibold">{item.title}</span>
                        <div className="flex font-bold gap-2">
                          <span className="text-[#FFA500]">
                            {item.macros.protein}g protein
                          </span>
                          <span className="text-[#007AFF]">
                            {item.macros.carb}g carbs
                          </span>
                          <span className="text-[#AF52DE]">
                            {item.macros.fat}g fat
                          </span>
                        </div>
                      </div>
                      <span className="font-bold">{item.calories} kCal</span>
                      {isToday && (
                        <CiTrash
                          size={20}
                          color="red"
                          className="cursor-pointer"
                          onClick={() => {
                            setData((prev) => {
                              const updatedData: DashboardDataProps = {
                                ...prev,
                                day_food: prev.day_food.filter(
                                  (_, idx) =>
                                    idx !==
                                    prev.day_food.findIndex(
                                      (rem) => rem.title === item.title
                                    )
                                ),
                              };
                              updateDB(updatedData);
                              return updatedData;
                            });
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              }
              isToday={isToday}
            />
            <ContentCard
              title={`${isToday ? "Today's" : selectedDate.toLocaleDateString()}'s Workout Plan`}
              action={() => navigate("/workout-plan")}
              content={
                <div
                  className={`w-full flex-1 rounded-[20px] gap-2 flex flex-col p-2 ${data.day_workout_plan?.length ? "bg-[rgba(239,240,240,0.3)]" : ""}`}
                >
                  {data.day_workout_plan?.length ? (
                    data.day_workout_plan.map((workout, index) => (
                      <div
                        key={`item-${index}`}
                        className="w-full flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2.5 h-[40px]">
                          <div className="w-4 h-4 bg-[#FF9500] rounded-full" />
                          <div className="flex-1">
                            <span className="text-[16px] leading-[19px] tracking-[0.01em] font-semibold text-[#5C6670]">
                              {workout.workout_title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`text-[16px] leading-[19px] tracking-[0.01em] ${workout.status ? "text-[#FF9500]" : "text-[#FF9500]"}`}
                            >
                              {workout.status ? "Completed" : "In-Progress"}
                            </span>
                            {isToday && (
                              <span
                                className="text-[16px] leading-[19px] tracking-[0.01em] text-[#DF1111] hover:underline hover:cursor-pointer"
                                onClick={() => {
                                  setEditLogPlan(true);
                                  setLogPlan(workout);
                                }}
                              >
                                Log Plan
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2.5 pl-5">
                          {workout.exercises?.map((item, idx) => {
                            const colorCombinations = [
                              { bg: "bg-[#E6EEFE]", text: "text-[#007AFF]" }, // Blue
                              { bg: "bg-[#D6F5DB]", text: "text-[#34C759]" }, // Green
                              { bg: "bg-[#FCF2E9]", text: "text-[#FF9500]" }, // Orange
                            ];
                            const colors =
                              colorCombinations[idx % colorCombinations.length];

                            return (
                              <div
                                key={`exercise-${idx}`}
                                className={`flex justify-between items-center px-2.5 py-2.5 rounded-[10px] w-full ${colors.bg}`}
                              >
                                <span
                                  className={`text-[16px] leading-[19px] tracking-[0.01em] font-semibold ${colors.text}`}
                                >
                                  {item.title}
                                </span>
                                <span
                                  className={`text-[16px] leading-[19px] tracking-[0.01em] ${colors.text}`}
                                >
                                  {item.set_count} sets
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-4">
                      No workout plans for{" "}
                      {isToday ? "today" : selectedDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
              }
              isToday={isToday}
            />
          </div>
        </div>
      </div>
      {logMetric != "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[300px] h-[200px] text-center relative ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() => setLogMetric("")}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-bold">Log Today's {logMetric}</h2>

              <input
                type="number"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Number from 0 - ${
                  logMetric === "Calories"
                    ? "10000"
                    : logMetric === "Steps"
                      ? "30000"
                      : logMetric === "Weight"
                        ? "400"
                        : "15"
                }`}
                value={logMetricValue ? logMetricValue : ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (
                    value >= 0 &&
                    value <=
                      (logMetric === "Calories"
                        ? 10000
                        : logMetric === "Steps"
                          ? 30000
                          : logMetric === "Weight"
                            ? 400
                            : 15)
                  ) {
                    setLogMetricValue(value);
                  } else {
                    setLogMetricValue(0.0);
                  }
                }}
              />
              <button
                title="Submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[200px]"
                onClick={() => {
                  //update data with new values and call API
                  setData((prev) => {
                    const updatedData: DashboardDataProps = {
                      ...prev,

                      day_calories:
                        logMetric === "Calories"
                          ? logMetricValue
                          : prev.day_calories,
                      day_sleep:
                        logMetric === "Sleep" ? logMetricValue : prev.day_sleep,
                      day_steps:
                        logMetric === "Steps" ? logMetricValue : prev.day_steps,
                      day_water:
                        logMetric === "Water" ? logMetricValue : prev.day_water,
                      day_weight:
                        logMetric === "Weight"
                          ? logMetricValue
                          : prev.day_weight,
                    };

                    // Call API immediately after updating state
                    updateDB(updatedData);
                    setLogMetricValue(0);
                    setLogMetric("");

                    return updatedData; // Ensure the new state is returned
                  });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {logConsumption && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[300px] h-[270px] text-center relative ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() => setLogConsumption(false)}
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-bold">Log Consumption</h2>
              <div className="flex flex-col text-left w-full font-bold text-gray-700">
                <label className="text-sm">Name</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  onChange={(e) => {
                    setLogConsumptionValue((prev) => {
                      const updatedData = {
                        ...prev,
                        title: e.target.value,
                      };
                      return updatedData;
                    });
                  }}
                />
              </div>

              <div className="rounded-lg  w-full flex space-x-4 text-left font-bold ">
                <div className="flex flex-col w-[80px] text-[#FFA500]">
                  <label className="text-sm">Protein</label>
                  <input
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          macros: {
                            protein: Number(e.target.value),
                            carb: prev.macros.carb,
                            fat: prev.macros.fat,
                          },
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col w-[80px] text-[#007AFF]">
                  <label className="text-sm">Carbs</label>
                  <input
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          macros: {
                            carb: Number(e.target.value),
                            protein: prev.macros.protein,
                            fat: prev.macros.fat,
                          },
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col w-[80px] text-[#AF52DE]">
                  <label className="text-sm">Fat</label>
                  <input
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          macros: {
                            fat: Number(e.target.value),
                            carb: prev.macros.carb,
                            protein: prev.macros.protein,
                          },
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col w-[80px] text-gray-700">
                  <label className="text-sm">Calories</label>
                  <input
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    onChange={(e) => {
                      setLogConsumptionValue((prev) => {
                        const updatedData = {
                          ...prev,
                          calories: Number(e.target.value),
                        };
                        return updatedData;
                      });
                    }}
                  />
                </div>
              </div>

              <button
                title="Submit"
                onClick={() => {
                  setData((prev) => {
                    const updatedData: DashboardDataProps = {
                      ...prev,

                      day_food: [...prev.day_food, logConsumptionValue],
                    };

                    // Call API immediately after updating state
                    updateDB(updatedData);
                    setLogConsumption(false);
                    setLogConsumptionValue({
                      title: "",
                      macros: { protein: 0.0, carb: 0.0, fat: 0.0 },
                      calories: 0.0,
                    });
                    getTotalMacros(updatedData.day_food || []);

                    return updatedData; // Ensure the new state is returned
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[200px]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {logPlan.workout_title != "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg w-[450px] max-h-[600px] text-center relative  ">
            <div className="flex justify-end h-[30px] items-start">
              <button
                title="Close"
                onClick={() =>
                  setLogPlan({
                    workout_title: "",
                    exercises: [],
                    status: false,
                  })
                }
                className=" text-red-500  hover:underline hover:cursor-pointer "
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-2xl font-bold">
                {editLogPLan ? "Log" : "View"} "{logPlan.workout_title}"
              </h2>
              <div className="flex flex-col text-sm font-bold gap-2 text-[12px] sm:text-[14px] w-full max-h-[400px] overflow-y-auto">
                {logPlan.exercises?.map((item, exerciseIndex) => (
                  <div className="text-[#FFA500] bg-[#FCF2E9] rounded-lg p-2">
                    <div
                      key={`item-${exerciseIndex}`}
                      className=" h-[25px]  flex items-center justify-between "
                    >
                      <span className="w-[150px] text-left">{item.title}</span>

                      <span className="w-[50px]">
                        {item.set_count}{" "}
                        {logPlan.workout_title === "cardio" //Wrong
                          ? "minutes"
                          : "sets"}
                      </span>
                    </div>
                    <div className=" pl-4 text-left gap-2 flex flex-col">
                      {item.sets.map((set, setIndex) => (
                        <div className="flex flex-row gap-2 items-center h-[40px]  justify-between px-2 rounded-lg bg-[#fffbf9]">
                          <span>Set {set.set}:</span>
                          <div>
                            <span className="w-[50px]">Weight: </span>
                            <input
                              disabled={!editLogPLan}
                              value={set.weight ? set.weight : ""}
                              onChange={(e) => {
                                updateLogWorkout(
                                  exerciseIndex,
                                  setIndex,
                                  e,
                                  "weight"
                                );
                                console.log(logPlan);
                              }}
                              type="number"
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 p-2 rounded-md focus:outline-none  w-[65px] h-[30px] bg-white text-black"
                              placeholder="###"
                            />
                          </div>
                          <div>
                            <span className="w-[50px]">Reps: </span>
                            <input
                              disabled={!editLogPLan}
                              value={set.reps ? set.reps : ""}
                              onChange={(e) => {
                                updateLogWorkout(
                                  exerciseIndex,
                                  setIndex,
                                  e,
                                  "reps"
                                );
                                console.log(logPlan);
                              }}
                              type="number"
                              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 p-2 rounded-md focus:outline-none  bg-white text-black w-[65px] h-[30px]"
                              placeholder="###"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <label className="flex items-center space-x-2">
                  <input
                    disabled={!editLogPLan}
                    type="checkbox"
                    checked={logPlan.status}
                    onChange={(e) => {
                      setLogPlan((prev) => ({
                        ...prev,
                        status: e.target.checked,
                      }));
                    }}
                    className="accent-blue-600"
                  />
                  <span>Workout Completed</span>
                </label>
              </div>
              <button
                title="Close"
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[200px] ${
                  editLogPLan ? "" : "hidden"
                }`}
                onClick={() => {
                  console.log("Log PLan", logPlan);
                  const missingWorkouts = data.day_workout_plan.filter(
                    (workout) => workout.workout_title !== logPlan.workout_title
                  );
                  console.log();
                  setData((prev) => {
                    const updatedData: DashboardDataProps = {
                      ...prev,

                      day_workout_plan: [...missingWorkouts, logPlan],
                    };

                    // Call API immediately after updating state
                    updateDB(updatedData);
                    setLogPlan({
                      workout_title: "",
                      exercises: [],
                      status: false,
                    });

                    return updatedData; // Ensure the new state is returned
                  });
                }}
              >
                Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
