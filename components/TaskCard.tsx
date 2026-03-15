import { useTasksStore } from "@/store/tasksStore"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function TaskCard({task}:any){

const toggleTask = useTasksStore(s=>s.toggleTask)
const deleteTask = useTasksStore(s=>s.deleteTask)
const toggleItem = useTasksStore(s=>s.toggleItem)

if(task.type==="grocery"){

const total = task.items?.reduce(
(sum:number,i:any)=>sum+i.quantity*i.price,
0
)

return(

<View style={styles.card}>

<Text style={styles.title}>
🛒 Grocery List
</Text>

{task.items?.map((item:any)=>(

<TouchableOpacity
key={item.id}
style={styles.item}
onPress={()=>toggleItem(task.id,item.id)}
>

<View style={[
styles.checkbox,
item.checked && styles.checked
]}/>

<Text style={{flex:1}}>
{item.name}
</Text>

<Text>
{item.quantity}
</Text>

<Text>
${item.price}
</Text>

</TouchableOpacity>

))}

<Text style={styles.total}>
Total: ${total}
</Text>

</View>

)

}

return(

<View style={[
styles.card,
task.completed && styles.completedCard
]}>

<TouchableOpacity
style={styles.row}
onPress={()=>toggleTask(task.id)}
>

<View style={[
styles.checkbox,
task.completed && styles.checked
]}/>

<View style={{flex:1}}>

<Text style={[
styles.title,
task.completed && styles.completedText
]}>
{task.title}
</Text>

{!!task.description &&(

<Text style={styles.description}>
{task.description}
</Text>

)}

</View>

</TouchableOpacity>

<TouchableOpacity
onPress={()=>deleteTask(task.id)}
>

<Text style={styles.delete}>
🗑
</Text>

</TouchableOpacity>

</View>

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
alignItems:"center"
},

completedCard:{
backgroundColor:"#DCFCE7"
},

row:{
flexDirection:"row",
alignItems:"center",
flex:1
},

checkbox:{
width:22,
height:22,
borderRadius:7,
borderWidth:2,
borderColor:"#22C55E",
marginRight:10
},

checked:{
backgroundColor:"#22C55E"
},

title:{
fontSize:16,
fontWeight:"600"
},

description:{
fontSize:12,
color:"#777",
marginTop:2
},

completedText:{
textDecorationLine:"line-through"
},

delete:{
fontSize:16
},

item:{
flexDirection:"row",
alignItems:"center",
marginTop:6
},

total:{
marginTop:10,
fontWeight:"700"
}

})