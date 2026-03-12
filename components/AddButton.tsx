import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function AddButton() {

  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>

      {open && (
        <View style={styles.menu}>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.text}>Add Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push("/add-habit")}
          >
            <Text style={styles.text}>Add Habit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.text}>Start Focus</Text>
          </TouchableOpacity>

        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },

  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#000",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8
  },

  plus: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },

  menu: {
    marginBottom: 14,
    alignItems: "center",
  },

  item: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },

  text: {
    fontSize: 15,
    fontWeight: "500",
  }

});