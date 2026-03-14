import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"

import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"

import DateTimePicker from "@react-native-community/datetimepicker"

import { habitTemplates } from "@/data/habitTemplates"
import { useHabitStore } from "@/store/habitStore"



export default function HabitConfigScreen() {

const router = useRouter()

const { id } = useLocalSearchParams()

const template = habitTemplates.find(h => h.id === id)

const addHabit = useHabitStore(s => s.addHabit)



const [date,setDate] = useState(new Date())

const [goal,setGoal] = useState(8)

const [repeat,setRepeat] = useState<"once"|"daily"|"weekly"|"monthly"|"yearly">("daily")

const [showCalendar,setShowCalendar] = useState(false)

const [weekDays,setWeekDays] = useState<number[]>([])



function toggleDay(day:number){

if(weekDays.includes(day)){
setWeekDays(weekDays.filter(d=>d!==day))
}else{
setWeekDays([...weekDays,day])
}

}



function saveHabit(){

if(!template) return

addHabit({

id: Date.now().toString(),

title: template.name,

startDate: date.toISOString(),

goal,

progress:0,

streak:0,

repeat,

weekDays,

completedDates:[]

})

router.back()

}



return(

<View style={styles.container}>

<Text style={styles.title}>{template?.name}</Text>



{/* START DATE */}

<Text style={styles.label}>Start date</Text>

<TouchableOpacity
style={styles.card}
onPress={()=>setShowCalendar(true)}
>

<Text>
{date.toDateString()}
</Text>

</TouchableOpacity>



{showCalendar && (

<DateTimePicker
value={date}
mode="date"
display="default"
onChange={(e,selected)=>{
setShowCalendar(false)
if(selected) setDate(selected)
}}
/>

)}



{/* GOAL */}

<View style={styles.goalRow}>

<Text style={styles.label}>
How many glasses of water?
</Text>

<TouchableOpacity
onPress={()=>Alert.alert(
"Water recommendation",
`The general recommendation is around 8 glasses per day (about 2 liters).

This varies depending on weight, activity and climate.

General daily fluid intake:

Women: 2 – 2.7 L
Men: 2.5 – 3.7 L

Exercise/Heat: up to 3–3.5 L`
)}
>

<Text style={styles.info}>
!
</Text>

</TouchableOpacity>

</View>



<View style={styles.goalSelector}>

<TouchableOpacity onPress={()=>setGoal(goal-1)}>
<Text style={styles.goalButton}>-</Text>
</TouchableOpacity>

<Text style={styles.goalValue}>
{goal}
</Text>

<TouchableOpacity onPress={()=>setGoal(goal+1)}>
<Text style={styles.goalButton}>+</Text>
</TouchableOpacity>

</View>



{/* REPEAT */}

<Text style={styles.label}>
Repeat
</Text>

<View style={styles.repeatRow}>

{["once","daily","weekly","monthly","yearly"].map(r=>(
<TouchableOpacity
key={r}
style={[
styles.repeatButton,
repeat===r && styles.repeatActive
]}
onPress={()=>setRepeat(r as any)}
>

<Text>{r}</Text>

</TouchableOpacity>
))}

</View>



{/* WEEKDAYS */}

{repeat==="weekly" && (

<View style={styles.weekRow}>

{["S","M","T","W","T","F","S"].map((d,i)=>(

<TouchableOpacity
key={i}
style={[
styles.day,
weekDays.includes(i) && styles.dayActive
]}
onPress={()=>toggleDay(i)}
>

<Text>{d}</Text>

</TouchableOpacity>

))}

</View>

)}



{/* SAVE */}

<TouchableOpacity
style={styles.save}
onPress={saveHabit}
>

<Text style={{color:"white"}}>
Create Habit
</Text>

</TouchableOpacity>

</View>

)

}



const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F7F8FA",
padding:20
},

title:{
fontSize:28,
fontWeight:"700",
marginBottom:20
},

label:{
fontSize:14,
color:"#666",
marginBottom:6
},

card:{
backgroundColor:"white",
padding:14,
borderRadius:10,
marginBottom:20
},

goalRow:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

info:{
backgroundColor:"#eee",
padding:6,
borderRadius:20,
width:24,
textAlign:"center"
},

goalSelector:{
flexDirection:"row",
alignItems:"center",
justifyContent:"center",
marginVertical:20
},

goalButton:{
fontSize:24,
padding:10
},

goalValue:{
fontSize:20,
fontWeight:"600"
},

repeatRow:{
flexDirection:"row",
flexWrap:"wrap",
marginBottom:20
},

repeatButton:{
padding:10,
backgroundColor:"#eee",
borderRadius:8,
marginRight:8,
marginBottom:8
},

repeatActive:{
backgroundColor:"#6366F1"
},

weekRow:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:20
},

day:{
padding:10,
backgroundColor:"#eee",
borderRadius:8,
width:40,
alignItems:"center"
},

dayActive:{
backgroundColor:"#6366F1"
},

save:{
backgroundColor:"#6366F1",
padding:16,
borderRadius:12,
alignItems:"center",
marginTop:30
}

})