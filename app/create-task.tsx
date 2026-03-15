import { useRouter } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { taskTemplates } from "@/data/taskTemplates"
import { useTasksStore } from "@/store/tasksStore"

export default function CreateTaskScreen(){

const router = useRouter()
const addTask = useTasksStore(state=>state.addTask)

const categories = [...new Set(taskTemplates.map(t=>t.category))]

function createTask(template:any){

addTask(
template.title,
template.description,
template.category
)

router.back()

}




return(

<ScrollView style={styles.container}>

<Text style={styles.title}>
Create Task
</Text>



{categories.map(category=>{

const items = taskTemplates.filter(t=>t.category === category)

return(

<View key={category} style={styles.category}>

<Text style={styles.categoryTitle}>
{category}
</Text>

{items.map(task=>(
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

)

})}



<TouchableOpacity
style={styles.custom}
onPress={()=>router.push("/add-task")}
>

<Text style={styles.customText}>
+ Create a custom task
</Text>

</TouchableOpacity>

</ScrollView>

)

}



const styles = StyleSheet.create({

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

category:{
marginBottom:24
},

categoryTitle:{
fontSize:18,
fontWeight:"600",
marginBottom:10
},

card:{
backgroundColor:"white",
padding:16,
borderRadius:12,
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

custom:{
backgroundColor:"#6366F1",
padding:16,
borderRadius:12,
alignItems:"center",
marginBottom:40
},

customText:{
color:"white",
fontWeight:"600"
}

})
