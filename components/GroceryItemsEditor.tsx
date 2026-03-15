import { useState } from "react"

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

export default function GroceryBuilder({onFinish}:any){

const [items,setItems] = useState<any[]>([])

const [name,setName] = useState("")
const [qty,setQty] = useState("")
const [price,setPrice] = useState("")

function add(){

if(!name.trim()) return

setItems([
...items,
{
id: Date.now().toString(),
name,
quantity: Number(qty || 1),
price: Number(price || 0),
checked:false
}
])

setName("")
setQty("")
setPrice("")

}

const total = items.reduce(
(sum,i)=>sum + (i.quantity * i.price),
0
)

return(

<View style={styles.container}>

<Text style={styles.title}>
Add products
</Text>

{items.map(item=>(
<View key={item.id} style={styles.itemRow}>

<Text style={styles.itemName}>
{item.name}
</Text>

<Text>
{item.quantity}
</Text>

<Text>
${item.price}
</Text>

</View>
))}

<TextInput
placeholder="Product"
value={name}
onChangeText={setName}
style={styles.input}
/>

<TextInput
placeholder="Quantity"
value={qty}
onChangeText={setQty}
keyboardType="numeric"
style={styles.input}
/>

<TextInput
placeholder="Unit price"
value={price}
onChangeText={setPrice}
keyboardType="numeric"
style={styles.input}
/>

<TouchableOpacity
style={styles.addButton}
onPress={add}
>

<Text style={{color:"white"}}>
Add product
</Text>

</TouchableOpacity>

<Text style={styles.total}>
Total: ${total}
</Text>

<TouchableOpacity
style={styles.finish}
onPress={()=>onFinish(items)}
>

<Text style={{color:"white"}}>
Add Grocery List
</Text>

</TouchableOpacity>

</View>

)

}

const styles = StyleSheet.create({

container:{
backgroundColor:"#F8F8F6",
padding:20
},

title:{
fontSize:18,
fontWeight:"700",
marginBottom:10
},

itemRow:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:6
},

itemName:{
fontWeight:"600"
},

input:{
backgroundColor:"#F3F4F6",
padding:10,
borderRadius:10,
marginTop:6
},

addButton:{
backgroundColor:"#2563EB",
padding:12,
borderRadius:10,
marginTop:10,
alignItems:"center"
},

finish:{
backgroundColor:"#10B981",
padding:14,
borderRadius:10,
marginTop:14,
alignItems:"center"
},

total:{
marginTop:10,
fontWeight:"700"
}

})