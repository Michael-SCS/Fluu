// --------------------------------------------------
// PANTALLA DE CONFIGURACIÓN DE HÁBITO
// Aquí el usuario define cuándo empieza y frecuencia
// --------------------------------------------------

// Hook de Expo Router para leer parámetros de la URL
import { useLocalSearchParams, useRouter } from "expo-router";

// Hook de React para manejar estado local
import { useState } from "react";

// Componentes básicos de React Native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Plantillas de hábitos predefinidas
import { habitTemplates } from "@/data/habitTemplates";

// Store global de hábitos (Zustand)
import { useHabitStore } from "@/store/habitStore";

export default function HabitConfigScreen() {

  // --------------------------------------------------
  // OBTENER PARÁMETRO DE LA URL
  // Ejemplo de ruta:
  // /habit-config/drink-water
  // --------------------------------------------------

  const { habit } = useLocalSearchParams();

  // Router para navegar entre pantallas
  const router = useRouter();

  // --------------------------------------------------
  // BUSCAR LA PLANTILLA SELECCIONADA
  // --------------------------------------------------

  const template = habitTemplates.find((h) => h.id === habit);

  // --------------------------------------------------
  // OBTENER FUNCIÓN DEL STORE
  // --------------------------------------------------

  const addHabit = useHabitStore((state) => state.addHabit);

  // --------------------------------------------------
  // ESTADO LOCAL DE CONFIGURACIÓN
  // --------------------------------------------------

  // Tipo de repetición del hábito
  const [repeatType, setRepeatType] = useState<"daily" | "weekly" | "once">("daily");

  // Fecha de inicio del hábito
  // Se guarda en formato ISO
  const startDate = new Date().toISOString();

  // --------------------------------------------------
  // FUNCIÓN PARA CREAR EL HÁBITO
  // --------------------------------------------------

  const createHabit = () => {

    // Si por alguna razón no existe la plantilla
    if (!template) return;

    // Guardamos el hábito en el store global
    addHabit({

      // ID único basado en timestamp
      id: Date.now().toString(),

      // Nombre del hábito
      name: template.name,

      // Icono del template
      icon: template.icon,

      // Fecha en la que comienza el hábito
      startDate: startDate,

      // Tipo de repetición
      repeatType: repeatType,

      // Historial de fechas completadas
      // Inicialmente vacío
      completedDates: [],

      // Streak inicial
      streak: 0,

    });

    // --------------------------------------------------
    // VOLVER A LA PANTALLA TODAY
    // --------------------------------------------------

    router.push("/");

  };

  // --------------------------------------------------
  // SI NO EXISTE LA PLANTILLA
  // --------------------------------------------------

  if (!template) {
    return (
      <View style={styles.container}>
        <Text>Habit not found</Text>
      </View>
    );
  }

  // --------------------------------------------------
  // UI DE LA PANTALLA
  // --------------------------------------------------

  return (

    <View style={styles.container}>

      {/* ---------------------------
          TÍTULO DEL HÁBITO
      ---------------------------- */}

      <Text style={styles.title}>
        {template.icon} {template.name}
      </Text>

      <Text style={styles.subtitle}>
        Choose how often you want to do this habit
      </Text>


      {/* ---------------------------
          OPCIONES DE REPETICIÓN
      ---------------------------- */}

      <TouchableOpacity
        style={styles.option}
        onPress={() => setRepeatType("daily")}
      >
        <Text>Daily</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.option}
        onPress={() => setRepeatType("weekly")}
      >
        <Text>Weekly</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.option}
        onPress={() => setRepeatType("once")}
      >
        <Text>Only once</Text>
      </TouchableOpacity>


      {/* ---------------------------
          BOTÓN CREAR HÁBITO
      ---------------------------- */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={createHabit}
      >

        <Text style={styles.saveText}>
          Create Habit
        </Text>

      </TouchableOpacity>


    </View>
  );
}


// --------------------------------------------------
// ESTILOS
// --------------------------------------------------

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "#777",
    marginBottom: 20,
  },

  option: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 10,
  },

  saveButton: {
    marginTop: 30,
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

});