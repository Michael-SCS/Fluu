import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";

import Svg, { Circle } from "react-native-svg";

export default function FocusTimer() {

  const { duration, breakTime, sessions } = useLocalSearchParams();

  const focusDuration = Number(duration ?? 25) * 60;
  const breakDuration = Number(breakTime ?? 5) * 60;
  const totalSessions = Number(sessions ?? 1);

  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [session, setSession] = useState(1);

  const intervalRef = useRef<any>(null);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  const currentDuration = isBreak ? breakDuration : focusDuration;

  // progreso exacto basado en tiempo real
  const progress = 1 - timeLeft / currentDuration;

  const strokeDashoffset = circumference * (1 - progress);


  useEffect(() => {

    if (!running) return;

    intervalRef.current = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          Vibration.vibrate(400);

          // TERMINÓ FOCUS
          if (!isBreak) {

            setIsBreak(true);

            return breakDuration;

          }

          // TERMINÓ BREAK

          if (session < totalSessions) {

            setSession((s) => s + 1);

            setIsBreak(false);

            return focusDuration;

          }

          // TERMINÓ TODO

          setRunning(false);

          return 0;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(intervalRef.current);

  }, [running]);


  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const time = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;


  return (

    <View style={styles.container}>

      <Text style={styles.mode}>
        {isBreak ? "Break Time" : "Focus Time"}
      </Text>

      <Text style={styles.session}>
        Session {session}/{totalSessions}
      </Text>


      <View style={styles.circleContainer}>

        <Svg width="260" height="260">

          <Circle
            stroke="#eee"
            fill="none"
            cx="130"
            cy="130"
            r={radius}
            strokeWidth="12"
          />

          <Circle
            stroke={isBreak ? "#FF3B30" : "#4CAF50"}
            fill="none"
            cx="130"
            cy="130"
            r={radius}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="130,130"
          />

        </Svg>

        <View style={styles.timerCenter}>
          <Text style={styles.time}>{time}</Text>
        </View>

      </View>


      <View style={styles.controls}>

        {!running && (

          <TouchableOpacity
            style={styles.start}
            onPress={() => setRunning(true)}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>

        )}

        {running && (

          <TouchableOpacity
            style={styles.pause}
            onPress={() => setRunning(false)}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>

        )}

        <TouchableOpacity
          style={styles.reset}
          onPress={() => {

            setRunning(false);
            setSession(1);
            setIsBreak(false);
            setTimeLeft(focusDuration);

          }}
        >

          <Text style={styles.buttonText}>Reset</Text>

        </TouchableOpacity>

      </View>

    </View>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },

  mode: {
    fontSize: 26,
    fontWeight: "700"
  },

  session: {
    color: "#777",
    marginBottom: 40
  },

  circleContainer: {
    justifyContent: "center",
    alignItems: "center"
  },

  timerCenter: {
    position: "absolute"
  },

  time: {
    fontSize: 44,
    fontWeight: "bold"
  },

  controls: {
    flexDirection: "row",
    marginTop: 40
  },

  start: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 10
  },

  pause: {
    backgroundColor: "#FF9800",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 10
  },

  reset: {
    backgroundColor: "#444",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 10
  },

  buttonText: {
    color: "white",
    fontWeight: "600"
  }

});