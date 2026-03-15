import { useEffect, useState } from "react"
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

import { useTasksStore } from "@/store/tasksStore"
import { getSuggestedTasks } from "@/utils/getSuggestedTasks"

import TaskCard from "./TaskCard"

export default function TasksSection(){

const tasks = useTasksStore(state=>state.tasks)
const addTask = useTasksStore(state=>state.addTask)
const addGroceryTask = useTasksStore(state=>state.addGroceryTask)

const [suggested,setSuggested] = useState<any[]>([])
const [requested,setRequested] = useState(false)

/* expanded template */

const [openTemplate,setOpenTemplate] = useState<string|null>(null)

/* repeat config */

const [repeatType,setRepeatType] =
useState<"none"|"daily"|"weekly">("none")

const [repeatDays,setRepeatDays] = useState<number[]>([])

/* grocery modal */

const [groceryOpen,setGroceryOpen] = useState(false)

const [product,setProduct] = useState("")
const [quantity,setQuantity] = useState("")
const [price,setPrice] = useState("")

const [items,setItems] = useState<any[]>([])

function toggleDay(day:number){

if(repeatDays.includes(day)){
setRepeatDays(repeatDays.filter(d=>d!==day))
}else{
setRepeatDays([...repeatDays,day])
}

}

function openTemplateCard(template:any){

if(template.title.includes("Grocery")){
setOpenTemplate(template.id)
return
}

setOpenTemplate(template.id)
setRepeatType("none")
setRepeatDays([])

}

function createTask(template:any){

addTask(
template.title,
template.description,
template.category,
repeatType,
repeatDays
)

setOpenTemplate(null)

/* cerrar sugerencias después de crear */

setRequested(false)
setSuggested([])

}

function suggestTasks(){

const result = getSuggestedTasks(tasks)

setSuggested(result)
setRequested(true)

}

function addItem(){

if(!product) return

setItems([
...items,
{
id:Date.now().toString(),
name:product,
quantity:Number(quantity)||1,
price:Number(price)||0,
checked:false
}
])

setProduct("")
setQuantity("")
setPrice("")

}

function saveGrocery(){

if(items.length===0) return

addGroceryTask(items)

setItems([])
setGroceryOpen(false)

/* cerrar sugerencias */

setRequested(false)
setSuggested([])

}

useEffect(()=>{

if(tasks.length===0){
setRequested(false)
setSuggested([])
}

},[tasks])

const sortedTasks=[

...tasks.filter(t=>!t.completed),

...tasks.filter(t=>t.completed)

]

return(

<View style={{flex:1}}>

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
onPress={suggestTasks}
>

<Text style={styles.buttonText}>
Suggest some tasks
</Text>

</TouchableOpacity>

</View>

)}

{requested && suggested.length>0 &&(

<View style={styles.suggestions}>

{suggested.map(template=>{

const isOpen = openTemplate===template.id

return(

<View key={template.id} style={styles.card}>

<TouchableOpacity
onPress={()=>openTemplateCard(template)}
>

<Text style={styles.cardTitle}>
{template.title}
</Text>

<Text style={styles.cardDesc}>
{template.description}
</Text>

</TouchableOpacity>

{isOpen &&(

template.title.includes("Grocery")

? (

<View style={styles.expand}>

<TouchableOpacity
style={styles.personalize}
onPress={()=>setGroceryOpen(true)}
>

<Text style={styles.personalizeText}>
Personalize Grocery List
</Text>

</TouchableOpacity>

</View>

)

: (

<View style={styles.expand}>

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
style={styles.add}
onPress={()=>createTask(template)}
>

<Text style={{color:"white"}}>
Add Task
</Text>

</TouchableOpacity>

</View>

)

)}

</View>

)

})}

</View>

)}

<FlatList
data={sortedTasks}
keyExtractor={item=>item.id}
renderItem={({item})=>(<TaskCard task={item}/>)}
contentContainerStyle={styles.list}
/>

<Modal
visible={groceryOpen}
animationType="slide"
transparent
>

<View style={styles.modalBg}>

<View style={styles.modal}>

<Text style={styles.modalTitle}>
Grocery List
</Text>

<TextInput
placeholder="Product"
value={product}
onChangeText={setProduct}
style={styles.input}
/>

<TextInput
placeholder="Quantity"
value={quantity}
onChangeText={setQuantity}
keyboardType="numeric"
style={styles.input}
/>

<TextInput
placeholder="Price"
value={price}
onChangeText={setPrice}
keyboardType="numeric"
style={styles.input}
/>

<TouchableOpacity
style={styles.addItem}
onPress={addItem}
>

<Text style={{color:"white"}}>
Add product
</Text>

</TouchableOpacity>

{items.map(i=>(

<View key={i.id} style={styles.itemRow}>

<Text style={{flex:1}}>
{i.name}
</Text>

<Text>
{i.quantity}
</Text>

<Text>
${i.price}
</Text>

</View>

))}

<TouchableOpacity
style={styles.save}
onPress={saveGrocery}
>

<Text style={{color:"white"}}>
Save Grocery List
</Text>

</TouchableOpacity>

</View>

</View>

</Modal>

</View>

)

}

const styles=StyleSheet.create({

header:{
alignItems:"center",
paddingTop:60
},

title:{
fontSize:22,
fontWeight:"700"
},

description:{
color:"#777",
marginBottom:14
},

button:{
backgroundColor:"#6366F1",
padding:10,
borderRadius:10
},

buttonText:{
color:"white",
fontWeight:"600"
},

suggestions:{
paddingHorizontal:20
},

card:{
backgroundColor:"white",
padding:14,
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

expand:{
marginTop:10
},

label:{
fontWeight:"600",
marginBottom:6
},

row:{
flexDirection:"row",
gap:8
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

add:{
backgroundColor:"#2563EB",
padding:12,
borderRadius:10,
marginTop:10,
alignItems:"center"
},

personalize:{
backgroundColor:"#2563EB",
padding:14,
borderRadius:12,
marginTop:10,
alignItems:"center"
},

personalizeText:{
color:"#fff",
fontWeight:"700"
},

list:{
paddingBottom:120
},

modalBg:{
flex:1,
backgroundColor:"rgba(0,0,0,0.4)",
justifyContent:"center",
padding:20
},

modal:{
backgroundColor:"white",
padding:20,
borderRadius:16
},

modalTitle:{
fontSize:20,
fontWeight:"700",
marginBottom:10
},

input:{
borderWidth:1,
borderColor:"#ddd",
padding:10,
borderRadius:10,
marginTop:8
},

addItem:{
backgroundColor:"#2563EB",
padding:10,
borderRadius:10,
marginTop:10,
alignItems:"center"
},

itemRow:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:6
},

save:{
backgroundColor:"#16A34A",
padding:12,
borderRadius:10,
marginTop:12,
alignItems:"center"
}

})