import { useRef } from "react"

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

import { useTasksStore } from "@/store/tasksStore"

import { taskCategoryUI } from "@/utils/taskCategoryUI"



export default function TaskCard({ task }: any){

const toggleTask =
useTasksStore(state=>state.toggleTask)

const deleteTask =
useTasksStore(state=>state.deleteTask)



const scale = useRef(new Animated.Value(1)).current



function complete(){

Animated.sequence([
Animated.timing(scale,{
toValue:0.95,
duration:120,
useNativeDriver:true
}),
Animated.timing(scale,{
toValue:1,
duration:120,
useNativeDriver:true
})
]).start()

toggleTask(task.id)

}



function removeTask(){
deleteTask(task.id)
}



const categoryUI =
taskCategoryUI[task.category] ?? {
icon:"•",
color:"#999"
}



return(

<Animated.View
style={{
transform:[{scale}]
}}
>

<View
style={[
styles.card,
task.completed && styles.completed
]}
>



{/* CHECKBOX */}

<TouchableOpacity
onPress={complete}
style={[
styles.checkbox,
task.completed && styles.checkboxDone
]}
>

{task.completed && (
<Text style={styles.check}>✓</Text>
)}

</TouchableOpacity>



{/* ICONO CATEGORIA */}

<View
style={[
styles.iconContainer,
{ backgroundColor: categoryUI.color }
]}
>

<Text style={styles.iconText}>
{categoryUI.icon}
</Text>

</View>



{/* TEXTO */}

<View style={{flex:1}}>

<Text
style={[
styles.title,
task.completed && styles.titleDone
]}
>
{task.title}
</Text>


<Text style={styles.description}>
{task.description}
</Text>


</View>



{/* BASURERO */}

<TouchableOpacity
onPress={removeTask}
style={styles.delete}
>

<Text style={styles.trash}>
🗑
</Text>

</TouchableOpacity>



</View>

</Animated.View>

)

}



const styles = StyleSheet.create({

card:{
backgroundColor:"white",
padding:16,
borderRadius:16,
marginHorizontal:20,
marginBottom:12,
flexDirection:"row",
alignItems:"flex-start"
},

completed:{
backgroundColor:"#E7F8EE"
},

checkbox:{
width:22,
height:22,
borderRadius:6,
borderWidth:2,
borderColor:"#6366F1",
marginRight:10,
alignItems:"center",
justifyContent:"center"
},

checkboxDone:{
backgroundColor:"#6366F1"
},

check:{
color:"white",
fontSize:14,
fontWeight:"700"
},

iconContainer:{
width:28,
height:28,
borderRadius:8,
alignItems:"center",
justifyContent:"center",
marginRight:10
},

iconText:{
color:"white",
fontSize:14
},

title:{
fontSize:16,
fontWeight:"600"
},

titleDone:{
textDecorationLine:"line-through",
color:"#777"
},

description:{
fontSize:13,
color:"#666",
marginTop:4,
lineHeight:18
},

delete:{
marginLeft:10,
padding:4
},

trash:{
fontSize:16
}

})
