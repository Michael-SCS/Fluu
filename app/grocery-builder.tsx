import GroceryBuilder from "@/components/GroceryBuilder"
import { useTasksStore } from "@/store/tasksStore"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function GroceryBuilderScreen(){

const router = useRouter()

const addGroceryTask =
useTasksStore(state=>state.addGroceryTask)

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