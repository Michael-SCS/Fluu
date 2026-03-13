import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import { useFocusStore } from "@/store/focusStore";

export default function CreateFocusModal({ visible, onClose }: any) {

  const addActivity =
    useFocusStore((state) => state.addActivity);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [studyTime, setStudyTime] = useState("25");

  const [studySessions, setStudySessions] = useState("4");

  const [breakTime, setBreakTime] = useState("5");

  const [breakSessions, setBreakSessions] = useState("4");




  const createFocus = () => {

  addActivity({

    id: Date.now().toString(),

    title,

    description,

    duration: Number(studyTime),

    breakTime: Number(breakTime),

    sessions: Number(studySessions),

    usageCount: 0,

    custom: true

  });

    onClose();

  };


  return (

    <Modal visible={visible} animationType="slide">

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>
          Create Focus Mode
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Focus name"
          value={title}
          onChangeText={setTitle}
        />


        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />


        <Text style={styles.label}>
          Study Time (minutes)
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={studyTime}
          onChangeText={setStudyTime}
        />


        <Text style={styles.label}>
          Study Sessions
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={studySessions}
          onChangeText={setStudySessions}
        />


        <Text style={styles.label}>
          Break Time (minutes)
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={breakTime}
          onChangeText={setBreakTime}
        />


        <Text style={styles.label}>
          Break Sessions
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={breakSessions}
          onChangeText={setBreakSessions}
        />


        <TouchableOpacity
          style={styles.button}
          onPress={createFocus}
        >

          <Text style={styles.buttonText}>
            Create Focus
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          onPress={onClose}
          style={styles.cancel}
        >

          <Text>
            Cancel
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </Modal>

  );
}

const styles = StyleSheet.create({

  container:{
    padding:30
  },

  title:{
    fontSize:28,
    fontWeight:"bold",
    marginBottom:20
  },

  label:{
    marginTop:10,
    marginBottom:6,
    fontWeight:"600"
  },

  input:{
    borderWidth:1,
    borderColor:"#ddd",
    borderRadius:10,
    padding:14,
    marginBottom:10
  },

  button:{
    backgroundColor:"#000",
    padding:16,
    borderRadius:10,
    alignItems:"center",
    marginTop:20
  },

  buttonText:{
    color:"white",
    fontWeight:"600"
  },

  cancel:{
    alignItems:"center",
    marginTop:20
  }

});