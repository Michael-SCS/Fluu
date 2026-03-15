import { useRouter } from "expo-router"
import { useState } from "react"

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

import { useFocusStore } from "@/store/focusStore"

export default function CreateFocusScreen(){

const router = useRouter()

const addActivity =
useFocusStore(state=>state.addActivity)



const [title,setTitle]=useState("")
const [duration,setDuration]=useState("")
const [breakTime,setBreakTime]=useState("")
const [sessions,setSessions]=useState("")



function createFocus(){

addActivity({

id:Date.now().toString(),

title,

duration:Number(duration),

breakTime:Number(breakTime || 5),

sessions:Number(sessions || 1),

usageCount:0

})

router.replace("/")

}



return(

<View style={styles.container}>

<Text style={styles.title}>
Create Focus
</Text>



<TextInput
style={styles.input}
placeholder="Focus name"
value={title}
onChangeText={setTitle}
/>

<TextInput
style={styles.input}
placeholder="Focus time (minutes)"
keyboardType="numeric"
value={duration}
onChangeText={setDuration}
/>

<TextInput
style={styles.input}
placeholder="Break time"
keyboardType="numeric"
value={breakTime}
onChangeText={setBreakTime}
/>

<TextInput
style={styles.input}
placeholder="Sessions"
keyboardType="numeric"
value={sessions}
onChangeText={setSessions}
/>



<TouchableOpacity
style={styles.create}
onPress={createFocus}
>

<Text style={styles.createText}>
Create Focus
</Text>

</TouchableOpacity>

</View>

)

}



const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F7F8FA",
paddingTop:80,
paddingHorizontal:20
},

title:{
fontSize:28,
fontWeight:"700",
marginBottom:20
},

input:{
backgroundColor:"white",
padding:14,
borderRadius:10,
marginBottom:12
},

create:{
marginTop:10,
backgroundColor:"#000",
padding:16,
borderRadius:12,
alignItems:"center"
},

createText:{
color:"white",
fontWeight:"600"
}

})
