import { create } from "zustand"

export type Task = {
id:string
title:string
description:string
category:string
completed:boolean
}

type TasksStore = {
tasks:Task[]

addTask:(title:string, description:string, category:string)=>void

toggleTask:(id:string)=>void

deleteTask:(id:string)=>void
}

export const useTasksStore = create<TasksStore>((set)=>({

tasks:[],

addTask:(title,description,category)=>
set((state)=>({

tasks:[
...state.tasks,
{
id:Date.now().toString(),
title,
description,
category,
completed:false
}
]

})),

toggleTask:(id)=>
set((state)=>({

tasks: state.tasks.map(task=>{

if(task.id !== id) return task

return{
...task,
completed:!task.completed
}

})

})),

deleteTask:(id)=>
set((state)=>({

tasks: state.tasks.filter(task=>task.id !== id)

}))

}))
