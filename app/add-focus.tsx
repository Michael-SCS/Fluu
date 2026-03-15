import { useRouter } from "expo-router";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { focusTemplates } from "@/data/focusTemplates";
import { useFocusStore } from "@/store/focusStore";

export default function AddFocusScreen(){

const router = useRouter()

const addActivity =
useFocusStore(state=>state.addActivity)



function calculateTotal(duration:number,breakTime:number,sessions:number){

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



function selectTemplate(template:any){

addActivity({

id:Date.now().toString(),

title:template.title,

description:template.description,

duration:template.duration,

breakTime:template.breakTime,

sessions:template.sessions,

usageCount:0

})

router.back()

}



function createCustom(){

router.push("/create-focus")

}



return(

<SafeAreaView style={styles.safe} edges={["bottom"]}>

<View style={styles.container}>

<Text style={styles.title}>
Choose Focus Mode
</Text>



<FlatList

data={focusTemplates}

keyExtractor={(item)=>item.id}

contentContainerStyle={styles.list}

renderItem={({item})=>{

const total =
calculateTotal(
item.duration,
item.breakTime,
item.sessions
)

return(

<TouchableOpacity
style={styles.card}
onPress={()=>selectTemplate(item)}
>

<Text style={styles.name}>
{item.title}
</Text>

<Text style={styles.description}>
{item.description}
</Text>



<View style={styles.infoRow}>

<Text style={styles.info}>
{item.sessions} sessions
</Text>

<Text style={styles.info}>
{item.duration} min focus
</Text>

<Text style={styles.info}>
break {item.breakTime} min
</Text>

</View>



<Text style={styles.total}>
Total: {formatMinutes(total)}
</Text>

</TouchableOpacity>

)

}}

/>



<TouchableOpacity
style={styles.createCard}
onPress={createCustom}
>

<Text style={styles.createText}>
+ Create your own focus
</Text>

</TouchableOpacity>



</View>

</SafeAreaView>

)

}



const styles = StyleSheet.create({

safe:{
flex:1,
backgroundColor:"#F7F8FA"
},

container:{
flex:1,
paddingTop:80,
paddingHorizontal:20
},

title:{
fontSize:28,
fontWeight:"700",
marginBottom:20
},

list:{
paddingBottom:20
},

card:{
backgroundColor:"white",
padding:18,
borderRadius:14,
marginBottom:14
},

name:{
fontSize:17,
fontWeight:"600"
},

description:{
marginTop:4,
color:"#777"
},

infoRow:{
flexDirection:"row",
marginTop:10
},

info:{
marginRight:14,
fontSize:13,
color:"#555"
},

total:{
marginTop:8,
fontWeight:"600",
color:"#6366F1"
},

createCard:{
marginTop:12,
marginBottom:20,
backgroundColor:"#6366F1",
padding:18,
borderRadius:14,
alignItems:"center"
},

createText:{
color:"white",
fontWeight:"600"
}

})
