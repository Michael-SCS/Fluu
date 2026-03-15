import { useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { useFocusStore } from "@/store/focusStore"

type Props = {
id:string
title:string
description?:string
duration:number
breakTime:number
sessions:number
usageCount:number
}

export default function FocusCard({
id,
title,
description,
duration,
breakTime,
sessions,
usageCount
}:Props){

const router = useRouter()

const increaseUsage =
useFocusStore(state=>state.increaseUsage)



function calculateTotal(){

const total =
(duration * sessions) +
(breakTime * (sessions - 1))

return total

}



function formatMinutes(minutes:number){

const hours = Math.floor(minutes / 60)

const mins = minutes % 60

if(hours > 0){

return `${hours}h ${mins}m`

}

return `${mins}m`

}



function startFocus(){

increaseUsage(id)

router.push(`/focus-timer?id=${id}`)

}



const total = calculateTotal()



return(

<TouchableOpacity
style={styles.card}
onPress={startFocus}
activeOpacity={0.8}
>

<Text style={styles.title}>
{title}
</Text>

{description && (
<Text style={styles.description}>
{description}
</Text>
)}



<View style={styles.infoRow}>

<View style={styles.infoItem}>
<Text style={styles.icon}>⏱</Text>
<Text style={styles.infoText}>{duration}m</Text>
</View>

<View style={styles.infoItem}>
<Text style={styles.icon}>☕</Text>
<Text style={styles.infoText}>{breakTime}m</Text>
</View>

<View style={styles.infoItem}>
<Text style={styles.icon}>🔁</Text>
<Text style={styles.infoText}>{sessions}</Text>
</View>

</View>



<View style={styles.totalRow}>
<Text style={styles.totalIcon}>⏳</Text>
<Text style={styles.totalText}>
Total {formatMinutes(total)}
</Text>
</View>

</TouchableOpacity>

)

}



const styles = StyleSheet.create({

card:{
backgroundColor:"white",
padding:18,
borderRadius:16,
marginBottom:14
},

title:{
fontSize:16,
fontWeight:"600"
},

description:{
marginTop:4,
color:"#777"
},

infoRow:{
flexDirection:"row",
marginTop:12
},

infoItem:{
flexDirection:"row",
alignItems:"center",
marginRight:18
},

icon:{
fontSize:14,
marginRight:4
},

infoText:{
fontSize:13,
color:"#555"
},

totalRow:{
flexDirection:"row",
alignItems:"center",
marginTop:10
},

totalIcon:{
marginRight:6
},

totalText:{
fontWeight:"600",
color:"#6366F1"
}

})
