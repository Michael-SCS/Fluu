import FloatingAddButton from "@/components/FloatingAddButton";
import FocusSection from "@/components/FocusSection";
import HabitsSection from "@/components/HabitsSection";
import TasksSection from "@/components/TasksSection";
import { useHabitStore } from "@/store/habitStore";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

const today = new Date();

const dateString = today.toLocaleDateString("en-US", {
weekday: "long",
month: "short",
day: "numeric",
});

const TAB_ICONS = ["✓", "◎", "⏱"];
const TAB_LABELS = ["Tasks", "Habits", "Focus"];

export default function TodayScreen(){

const pagerRef = useRef<PagerView>(null)

const [page,setPage] = useState(1)

const indicatorAnim = useRef(new Animated.Value(1)).current

const resetDailyProgress =
useHabitStore(state=>state.resetDailyProgress)



useEffect(()=>{
resetDailyProgress()
},[])



function goToPage(index:number){

pagerRef.current?.setPage(index)

setPage(index)

Animated.spring(indicatorAnim,{
toValue:index,
useNativeDriver:false,
tension:60,
friction:10
}).start()

}



function onPageSelected(e:any){

const pos = e.nativeEvent.position

setPage(pos)

Animated.spring(indicatorAnim,{
toValue:pos,
useNativeDriver:false,
tension:60,
friction:10
}).start()

}



const indicatorLeft = indicatorAnim.interpolate({
inputRange:[0,1,2],
outputRange:["0%","33.33%","66.66%"]
})



return(

<SafeAreaView style={styles.container}>

<StatusBar
style="dark"
backgroundColor="#F8F8F6"
translucent={false}
/>



{/* HEADER */}

<View style={styles.headerContainer}>

<Text style={styles.overline}>
MY DAY
</Text>

<Text style={styles.header}>
Today
</Text>

<Text style={styles.date}>
{dateString}
</Text>

</View>



{/* TABS */}

<View style={styles.tabsWrapper}>

<View style={styles.tabsContainer}>

<Animated.View
style={[
styles.tabIndicator,
{left:indicatorLeft}
]}
/>



{TAB_LABELS.map((label,index)=>{

const isActive = page === index

return(

<TouchableOpacity
key={label}
style={styles.tabButton}
onPress={()=>goToPage(index)}
activeOpacity={0.7}
>

<Text style={[
styles.tabIcon,
isActive && styles.tabIconActive
]}>
{TAB_ICONS[index]}
</Text>

<Text style={[
styles.tabText,
isActive && styles.activeText
]}>
{label}
</Text>

</TouchableOpacity>

)

})}

</View>

</View>



{/* CONTENT */}

<PagerView
ref={pagerRef}
style={styles.pager}
initialPage={1}
onPageSelected={onPageSelected}
>

<TasksSection key="1"/>
<HabitsSection key="2"/>
<FocusSection key="3"/>

</PagerView>



<FloatingAddButton/>

</SafeAreaView>

)

}



const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8F8F6"
},



/* HEADER */

headerContainer:{
paddingHorizontal:28,
paddingTop:16,
marginBottom:18
},

overline:{
fontSize:11,
fontWeight:"700",
letterSpacing:2,
color:"#A78BFA",
marginBottom:4
},

header:{
fontSize:40,
fontWeight:"800",
color:"#0F0F14",
letterSpacing:-1.2
},

date:{
marginTop:6,
fontSize:14,
color:"#8A8A8F",
fontWeight:"500"
},



/* TABS */

tabsWrapper:{
paddingHorizontal:20,
marginBottom:14
},

tabsContainer:{
flexDirection:"row",
backgroundColor:"#EFEFEF",
borderRadius:16,
padding:4,
position:"relative"
},

tabIndicator:{
position:"absolute",
top:4,
bottom:4,
width:"33.33%",
backgroundColor:"#FFFFFF",
borderRadius:12,
shadowColor:"#000",
shadowOpacity:0.08,
shadowRadius:6,
shadowOffset:{width:0,height:2},
elevation:2
},

tabButton:{
flex:1,
paddingVertical:9,
alignItems:"center",
zIndex:1
},

tabIcon:{
fontSize:13,
color:"#9CA3AF"
},

tabIconActive:{
color:"#7C3AED"
},

tabText:{
fontSize:12,
fontWeight:"600",
color:"#9CA3AF"
},

activeText:{
color:"#0F0F14"
},



/* PAGER */

pager:{
flex:1
}

})
