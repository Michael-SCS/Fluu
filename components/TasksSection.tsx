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
import { useRouter } from "expo-router"
import TaskCard from "./TaskCard"

export default function TasksSection(){

const router = useRouter()

const tasks = useTasksStore(state=>state.tasks)
const addTask = useTasksStore(state=>state.addTask)

const [suggested,setSuggested] = useState<any[]>([])
const [open,setOpen] = useState(false)
const [selectedTemplate,setSelectedTemplate] = useState<any>(null)

function toggleSuggestions(){

if(open){
setOpen(false)
setSelectedTemplate(null)
return
}

const result = getSuggestedTasks(tasks)
setSuggested(result)
setOpen(true)

}

function createTask(template:any){

addTask(
template.title,
template.description,
template.category
)

setOpen(false)
setSelectedTemplate(null)

}

const sortedTasks=[
...tasks.filter(t=>!t.completed),
...tasks.filter(t=>t.completed)
]

return(

<View style={{flex:1}}>

{/* EMPTY STATE */}

{tasks.length===0 &&(

<View style={styles.header}>

<Text style={styles.title}>
No tasks yet
</Text>

<Text style={styles.description}>
Stay organized and productive
</Text>

<TouchableOpacity
style={styles.button}
onPress={toggleSuggestions}
>

<Text style={styles.buttonText}>
Suggest some tasks
</Text>

</TouchableOpacity>

</View>

)}

{/* SUGGESTED TASKS */}

{open &&(

<View style={styles.dropdownContent}>

{suggested.map((task)=>{

const isOpen = selectedTemplate?.id===task.id
const isGrocery = task.title.includes("Grocery")

return(

<View key={task.id} style={styles.card}>

<TouchableOpacity
onPress={()=>{

if(isOpen){
setSelectedTemplate(null)
}else{
setSelectedTemplate(task)
}

}}
>

<Text style={styles.cardTitle}>
{task.title}
</Text>

<Text style={styles.cardDesc}>
{task.description}
</Text>

</TouchableOpacity>

{/* EXPANDED SECTION */}

{isOpen && (

isGrocery

? (

<TouchableOpacity
style={styles.personalize}
onPress={()=>router.push("/add-task")}
>

<Text style={styles.personalizeText}>
Personalize
</Text>

</TouchableOpacity>

)

: (

<TouchableOpacity
style={styles.add}
onPress={()=>createTask(task)}
>

<Text style={{color:"white"}}>
Add Task
</Text>

</TouchableOpacity>

)

)}

</View>

)

})}

</View>

)}

{/* TASK LIST */}

<FlatList
data={sortedTasks}
keyExtractor={(item)=>item.id}
renderItem={({item})=>(
<TaskCard task={item}/>
)}
contentContainerStyle={styles.list}
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

dropdownContent:{
paddingHorizontal:20
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
},

add:{
backgroundColor:"#2563EB",
padding:12,
borderRadius:10,
marginTop:10,
alignItems:"center"
},

personalize:{
backgroundColor:"#7C3AED",
padding:12,
borderRadius:10,
marginTop:10,
alignItems:"center"
},

personalizeText:{
color:"#fff",
fontWeight:"700"
},

list:{
paddingBottom:120
}

})