import { useState } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

import { taskTemplates } from "@/data/taskTemplates"
import { useTasksStore } from "@/store/tasksStore"

import GroceryBuilder from "@/components/GroceryBuilder"

export default function AddTask(){

const router = useRouter()

const addTask = useTasksStore(state=>state.addTask)
const addGroceryTask = useTasksStore(state=>state.addGroceryTask)

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [showCustom,setShowCustom] = useState(false)

/* template expand */

const [openTemplate,setOpenTemplate] = useState<string|null>(null)

/* repeat */

const [repeatType,setRepeatType] =
useState<"none"|"daily"|"weekly">("none")

const [repeatDays,setRepeatDays] = useState<number[]>([])

/* grocery */

const [groceryTemplate,setGroceryTemplate] = useState(false)

/* grocery builder */

if(groceryTemplate){

return(

<SafeAreaView style={{flex:1}}>

<GroceryBuilder
onFinish={(items:any)=>{

addGroceryTask(items)

router.back()

}}
/>

</SafeAreaView>

)

}

/* toggle weekly day */

function toggleDay(day:number){

if(repeatDays.includes(day)){
setRepeatDays(repeatDays.filter(d=>d!==day))
}else{
setRepeatDays([...repeatDays,day])
}

}

/* create template task */

function createTemplateTask(template:any){

addTask(
template.title,
template.description,
template.category,
repeatType,
repeatDays
)

router.back()

}

/* custom task */

function createCustomTask(){

if(!title.trim()) return

addTask(
title,
description,
"Custom",
repeatType,
repeatDays
)

router.back()

}

/* templates grouped */

const groupedTemplates = taskTemplates.reduce((acc:any,template)=>{

if(!acc[template.category]){
acc[template.category] = []
}

acc[template.category].push(template)

return acc

},{})

return(

<SafeAreaView style={styles.container}>

<ScrollView contentContainerStyle={styles.body}>

<Text style={styles.title}>
Add Task
</Text>

{/* CREATE CUSTOM */}

<TouchableOpacity
style={styles.customButton}
onPress={()=>setShowCustom(!showCustom)}
>

<Text style={styles.customButtonText}>
✏️ Create your own task
</Text>

</TouchableOpacity>

{showCustom &&(

<View style={styles.form}>

<Text style={styles.label}>
Title *
</Text>

<TextInput
placeholder="Write your task..."
value={title}
onChangeText={setTitle}
style={styles.input}
/>

<Text style={styles.label}>
Description
</Text>

<TextInput
placeholder="Optional description"
value={description}
onChangeText={setDescription}
style={styles.input}
/>

<Text style={styles.label}>
Repeat
</Text>

<View style={styles.row}>

<TouchableOpacity
style={[styles.btn,repeatType==="none"&&styles.active]}
onPress={()=>setRepeatType("none")}
>
<Text>Once</Text>
</TouchableOpacity>

<TouchableOpacity
style={[styles.btn,repeatType==="daily"&&styles.active]}
onPress={()=>setRepeatType("daily")}
>
<Text>Daily</Text>
</TouchableOpacity>

<TouchableOpacity
style={[styles.btn,repeatType==="weekly"&&styles.active]}
onPress={()=>setRepeatType("weekly")}
>
<Text>Specific days</Text>
</TouchableOpacity>

</View>

{repeatType==="weekly" &&(

<View style={styles.days}>

{["S","M","T","W","T","F","S"].map((d,i)=>{

const active = repeatDays.includes(i)

return(

<TouchableOpacity
key={i}
style={[styles.day,active&&styles.dayActive]}
onPress={()=>toggleDay(i)}
>

<Text style={active&&{color:"#fff"}}>
{d}
</Text>

</TouchableOpacity>

)

})}

</View>

)}

<TouchableOpacity
style={styles.createButton}
onPress={createCustomTask}
>

<Text style={styles.createText}>
Create Task
</Text>

</TouchableOpacity>

</View>

)}

{/* TEMPLATES */}

<Text style={styles.templatesTitle}>
Templates
</Text>

{Object.entries(groupedTemplates).map(([category,templates]:any)=>(

<View key={category}>

<Text style={styles.category}>
{category}
</Text>

{templates.map((template:any)=>{

const open = openTemplate===template.id

return(

<View key={template.id} style={styles.templateCard}>

<TouchableOpacity
onPress={()=>{

if(template.title.includes("Grocery")){
setGroceryTemplate(true)
return
}

setOpenTemplate(
open ? null : template.id
)

setRepeatType("none")
setRepeatDays([])

}}
>

<Text style={styles.templateTitle}>
{template.title}
</Text>

<Text style={styles.templateDesc}>
{template.description}
</Text>

</TouchableOpacity>

{open &&(

<View style={{marginTop:10}}>

<Text style={styles.label}>
Repeat
</Text>

<View style={styles.row}>

<TouchableOpacity
style={[styles.btn,repeatType==="none"&&styles.active]}
onPress={()=>setRepeatType("none")}
>
<Text>Once</Text>
</TouchableOpacity>

<TouchableOpacity
style={[styles.btn,repeatType==="daily"&&styles.active]}
onPress={()=>setRepeatType("daily")}
>
<Text>Daily</Text>
</TouchableOpacity>

<TouchableOpacity
style={[styles.btn,repeatType==="weekly"&&styles.active]}
onPress={()=>setRepeatType("weekly")}
>
<Text>Specific days</Text>
</TouchableOpacity>

</View>

{repeatType==="weekly" &&(

<View style={styles.days}>

{["S","M","T","W","T","F","S"].map((d,i)=>{

const active = repeatDays.includes(i)

return(

<TouchableOpacity
key={i}
style={[styles.day,active&&styles.dayActive]}
onPress={()=>toggleDay(i)}
>

<Text style={active&&{color:"#fff"}}>
{d}
</Text>

</TouchableOpacity>

)

})}

</View>

)}

<TouchableOpacity
style={styles.createButton}
onPress={()=>createTemplateTask(template)}
>

<Text style={styles.createText}>
Add Task
</Text>

</TouchableOpacity>

</View>

)}

</View>

)

})}

</View>

))}

</ScrollView>

</SafeAreaView>

)

}

const styles = StyleSheet.create({

container:{flex:1,backgroundColor:"#FAFAF8"},

body:{padding:24},

title:{fontSize:32,fontWeight:"800",marginBottom:20},

customButton:{
backgroundColor:"#1C1A17",
padding:16,
borderRadius:16,
marginBottom:20
},

customButtonText:{
color:"#fff",
textAlign:"center",
fontWeight:"700"
},

form:{marginBottom:20},

label:{
fontWeight:"700",
marginTop:10,
marginBottom:6
},

input:{
backgroundColor:"#fff",
padding:14,
borderRadius:12
},

row:{
flexDirection:"row",
gap:10
},

btn:{
backgroundColor:"#eee",
padding:10,
borderRadius:20
},

active:{
backgroundColor:"#2563EB"
},

days:{
flexDirection:"row",
gap:6,
marginTop:8
},

day:{
padding:8,
backgroundColor:"#eee",
borderRadius:8
},

dayActive:{
backgroundColor:"#2563EB"
},

createButton:{
backgroundColor:"#2563EB",
padding:14,
borderRadius:12,
marginTop:10
},

createText:{
color:"#fff",
textAlign:"center",
fontWeight:"700"
},

templatesTitle:{
fontSize:20,
fontWeight:"800",
marginTop:20
},

category:{
marginTop:16,
fontWeight:"700"
},

templateCard:{
backgroundColor:"#fff",
padding:16,
borderRadius:16,
marginTop:8
},

templateTitle:{
fontWeight:"700",
fontSize:16
},

templateDesc:{
fontSize:12,
color:"#777",
marginTop:4
}

})