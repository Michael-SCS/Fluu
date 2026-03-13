import FloatingAddButton from "@/components/FloatingAddButton";
import FocusCard from "@/components/FocusCard";
import HabitCard from "@/components/HabitCard";
import TaskCard from "@/components/TaskCard";
import { useHabitStore } from "@/store/habitStore";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PagerView from "react-native-pager-view";

const today = new Date();

const dateString = today.toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
});


// --------------------------------------------------
// 🔹 FUNCIÓN QUE DECIDE SI UN HÁBITO SE MUESTRA HOY
// --------------------------------------------------

function shouldShowHabitToday(habit: any) {

  const today = new Date();
  const startDate = new Date(habit.startDate);

  // Si el hábito empieza en el futuro no se muestra
  if (today < startDate) return false;

  const weekday = today
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  // Si es diario
  if (habit.repeatType === "daily") return true;

  // Si es solo una vez
  if (habit.repeatType === "once") {
    return today.toDateString() === startDate.toDateString();
  }

  // Si es semanal
  if (habit.repeatType === "weekly") {
    return habit.repeatConfig?.includes(weekday);
  }

  // Por defecto mostrar
  return true;
}



export default function TodayScreen() {

  const pagerRef = useRef<PagerView>(null);

  const [page, setPage] = useState(1);


  const goToPage = (index: number) => {
    pagerRef.current?.setPage(index);
    setPage(index);
  };

// --------------------------------------------------
// FUNCIÓN QUE DECIDE SI EL HÁBITO SE MUESTRA HOY
// --------------------------------------------------

function shouldShowHabitToday(habit: any) {

  const today = new Date();
  const startDate = new Date(habit.startDate);

  // Si empieza en el futuro no se muestra
  if (today < startDate) return false;

  const weekday = today
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  if (habit.repeatType === "daily") return true;

  if (habit.repeatType === "once") {
    return today.toDateString() === startDate.toDateString();
  }

  if (habit.repeatType === "weekly") {
    return habit.repeatConfig?.includes(weekday);
  }

  return true;
}
  // --------------------------------------------------
  // 🔹 FILTRAR SOLO LOS HÁBITOS QUE TOCAN HOY
  // --------------------------------------------------

  const habits = useHabitStore((state) => state.habits);



  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Today</Text>
        <Text style={styles.date}>{dateString}</Text>
      </View>


      {/* TABS */}

      <View style={styles.tabs}>

        <TouchableOpacity onPress={() => goToPage(0)}>
          <Text style={[styles.tab, page === 0 && styles.activeTab]}>
            Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goToPage(1)}>
          <Text style={[styles.tab, page === 1 && styles.activeTab]}>
            Habits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goToPage(2)}>
          <Text style={[styles.tab, page === 2 && styles.activeTab]}>
            Focus
          </Text>
        </TouchableOpacity>

      </View>



      {/* SLIDE PAGES */}

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={1}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >


        {/* TASKS */}

        <ScrollView key="1" style={styles.page}>

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>Tasks</Text>

            <TaskCard title="Study React" subtitle="Programming" />

            <TaskCard title="Go to the gym" />

            <TaskCard title="Review code" />

          </View>

        </ScrollView>



        {/* HABITS */}

        <ScrollView key="2" style={styles.page}>

          <View style={styles.section}>




            {/* 🔹 Mostrar solo los hábitos que corresponden hoy */}

            {habits.map((habit, index) => (

              <HabitCard
                key={index}
                icon={habit.icon}
                name={habit.name}
                done={habit.doneToday}
                streak={habit.streak}
              />

            ))}

          </View>

        </ScrollView>



        {/* FOCUS */}

        <ScrollView key="3" style={styles.page}>

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>Focus</Text>

            <FocusCard title="Read" duration={25} />

            <FocusCard title="Learn Spanish" duration={30} />

          </View>

        </ScrollView>

      </PagerView>



      {/* BOTÓN FLOTANTE */}

      <FloatingAddButton />

    </View>
  );
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: "#F7F8FA",
  },

  headerContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  header: {
    fontSize: 34,
    fontWeight: "bold",
  },

  date: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  tab: {
    fontSize: 16,
    color: "#888",
  },

  activeTab: {
    color: "#000",
    fontWeight: "bold",
  },

  pager: {
    flex: 1,
  },

  page: {
    flex: 1,
  },

  section: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },

});