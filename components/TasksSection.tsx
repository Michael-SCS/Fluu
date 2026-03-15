import { useState } from "react"

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

import { useTasksStore } from "@/store/tasksStore"

import { getSuggestedTasks } from "@/utils/getSuggestedTasks"

import TaskCard from "./TaskCard"



export default function TasksSection(){

const tasks = useTasksStore(state=>state.tasks)
const addTask = useTasksStore(state=>state.addTask)

const [suggested,setSuggested] = useState<any[]>([])
const [open,setOpen] = useState(false)



function suggestTasks(){

const result = getSuggestedTasks(tasks)

setSuggested(result)

setOpen(true)

}



function toggleDropdown(){

setOpen(!open)

}



function createTask(template:any){

addTask(
template.title,
template.description,
template.category
)


}



const sortedTasks = [

...tasks.filter(t=>!t.completed),

...tasks.filter(t=>t.completed)

]



return(

<View style={{flex:1}}>



{tasks.length === 0 && (

<View style={styles.header}>

<Text style={styles.title}>
No tasks yet
</Text>

<Text style={styles.description}>
Stay organized and productive
</Text>

<TouchableOpacity
style={styles.button}
onPress={suggestTasks}
>

<Text style={styles.buttonText}>
Suggest some tasks
</Text>

</TouchableOpacity>

</View>

)}



{suggested.length > 0 && (

<View style={styles.dropdown}>

<TouchableOpacity
style={styles.dropdownHeader}
onPress={toggleDropdown}
>

<Text style={styles.dropdownTitle}>
Suggested for you
</Text>

<Text style={styles.arrow}>
{open ? "▲" : "▼"}
</Text>

</TouchableOpacity>



{open && (

<View style={styles.dropdownContent}>

{suggested.map(task => (

<TouchableOpacity
key={task.id}
style={styles.card}
onPress={()=>createTask(task)}
>

<Text style={styles.cardTitle}>
{task.title}
</Text>

<Text style={styles.cardDesc}>
{task.description}
</Text>

</TouchableOpacity>

))}

</View>

)}

</View>

)}



<FlatList
data={sortedTasks}
keyExtractor={(item)=>item.id}
renderItem={({item})=>(
<TaskCard task={item}/>
)}
/>



</View>

)

}



const styles = StyleSheet.create({

header:{
alignItems:"center",
paddingTop:60,
paddingBottom:20
},

title:{
fontSize:22,
fontWeight:"700",
marginBottom:6
},

description:{
fontSize:14,
color:"#777",
marginBottom:14
},

button:{
backgroundColor:"#6366F1",
paddingVertical:10,
paddingHorizontal:18,
borderRadius:10
},

buttonText:{
color:"white",
fontWeight:"600"
},

dropdown:{
paddingHorizontal:20,
marginBottom:10
},

dropdownHeader:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:8
},

dropdownTitle:{
fontSize:16,
fontWeight:"600"
},

arrow:{
fontSize:12,
color:"#777"
},

dropdownContent:{
marginTop:6
},

card:{
backgroundColor:"white",
padding:14,
borderRadius:10,
marginBottom:10
},

cardTitle:{
fontWeight:"600"
},

cardDesc:{
fontSize:13,
color:"#777",
marginTop:4
}

})
