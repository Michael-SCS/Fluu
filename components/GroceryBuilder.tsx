import { useState } from "react"
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"

type Item = {
id:string
name:string
quantity:number
price:number
checked:boolean
}

export default function GroceryBuilder({onFinish}:any){

const [name,setName] = useState("")
const [quantity,setQuantity] = useState("")
const [price,setPrice] = useState("")
const [items,setItems] = useState<Item[]>([])

function addItem(){

if(!name.trim()) return

const newItem:Item = {
id:Date.now().toString(),
name,
quantity:Number(quantity)||1,
price:Number(price)||0,
checked:false
}

setItems([...items,newItem])

setName("")
setQuantity("")
setPrice("")
}

function toggle(id:string){

setItems(items.map(i=>
i.id===id
? {...i,checked:!i.checked}
: i
))

}

const total = items.reduce(
(sum,i)=>sum+(i.price*i.quantity),
0
)

return(

<View style={styles.container}>

<Text style={styles.title}>
🛒 Grocery List
</Text>

{/* INPUTS */}

<View style={styles.form}>

<TextInput
placeholder="Product"
value={name}
onChangeText={setName}
style={styles.input}
/>

<TextInput
placeholder="Qty"
value={quantity}
onChangeText={setQuantity}
keyboardType="numeric"
style={styles.smallInput}
/>

<TextInput
placeholder="$"
value={price}
onChangeText={setPrice}
keyboardType="numeric"
style={styles.smallInput}
/>

</View>

<TouchableOpacity
style={styles.addButton}
onPress={addItem}
>

<Text style={styles.addText}>
Add product
</Text>

</TouchableOpacity>

{/* LIST */}

<FlatList
data={items}
keyExtractor={i=>i.id}
style={{marginTop:20}}
renderItem={({item})=>(

<TouchableOpacity
style={styles.item}
onPress={()=>toggle(item.id)}
>

<View style={[
styles.checkbox,
item.checked && styles.checked
]}/>

<Text style={styles.itemName}>
{item.name}
</Text>

<Text>
{item.quantity}
</Text>

<Text>
${item.price}
</Text>

</TouchableOpacity>

)}
/>

{/* TOTAL */}

<Text style={styles.total}>
Total: ${total}
</Text>

{/* SAVE */}

<TouchableOpacity
style={styles.saveButton}
onPress={()=>onFinish(items)}
>

<Text style={styles.saveText}>
Save Grocery List
</Text>

</TouchableOpacity>

</View>

)

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8F8F6",
padding:24
},

title:{
fontSize:28,
fontWeight:"800",
marginBottom:20
},

form:{
flexDirection:"row",
gap:8
},

input:{
flex:1,
backgroundColor:"white",
padding:12,
borderRadius:12
},

smallInput:{
width:60,
backgroundColor:"white",
padding:12,
borderRadius:12
},

addButton:{
backgroundColor:"#7C3AED",
padding:14,
borderRadius:12,
marginTop:10,
alignItems:"center"
},

addText:{
color:"white",
fontWeight:"700"
},

item:{
flexDirection:"row",
alignItems:"center",
gap:10,
paddingVertical:10
},

checkbox:{
width:20,
height:20,
borderRadius:6,
borderWidth:2,
borderColor:"#7C3AED"
},

checked:{
backgroundColor:"#7C3AED"
},

itemName:{
flex:1
},

total:{
marginTop:20,
fontWeight:"700",
fontSize:18
},

saveButton:{
backgroundColor:"#22C55E",
padding:16,
borderRadius:14,
marginTop:20,
alignItems:"center"
},

saveText:{
color:"white",
fontWeight:"700",
fontSize:16
}

})