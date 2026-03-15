import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { favoriteTasks } from "@/data/favoriteTasks"
import { useTasksStore } from "@/store/tasksStore"



type Props = {
  hideTitle?: boolean
}



type FavoriteTask = {
  id: string
  title: string
  description: string
  category: string
}



export default function FavoriteTasksDropdown({ hideTitle }: Props){

  const addTask =
  useTasksStore(state => state.addTask)



  function createTask(template: FavoriteTask){

    addTask(
      template.title,
      template.description,
      template.category
    )

  }



  return(

    <View style={styles.container}>

      {!hideTitle && (
        <Text style={styles.title}>
          Recommended tasks
        </Text>
      )}

      {favoriteTasks.map((task: FavoriteTask) => (

        <TouchableOpacity
          key={task.id}
          style={styles.card}
          onPress={() => createTask(task)}
        >

          <Text style={styles.name}>
            {task.title}
          </Text>

          <Text style={styles.description}>
            {task.description}
          </Text>

        </TouchableOpacity>

      ))}

    </View>

  )

}



const styles = StyleSheet.create({

container:{
paddingHorizontal:20
},

title:{
fontSize:16,
fontWeight:"600",
marginBottom:10
},

card:{
backgroundColor:"white",
padding:14,
borderRadius:10,
marginBottom:10
},

name:{
fontSize:14,
fontWeight:"600"
},

description:{
fontSize:12,
color:"#777",
marginTop:4
}

})
