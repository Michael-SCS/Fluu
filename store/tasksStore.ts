import { create } from "zustand"

export type GroceryItem = {
id:string
name:string
quantity:number
price:number
checked:boolean
}

export type Task = {
id:string
title:string
description:string
category:string

type:"normal"|"grocery"

repeatType?:"none"|"daily"|"weekly"
repeatDays?:number[]

completed:boolean

createdAt:string
lastCompleted?:string

items?:GroceryItem[]
}

type TasksStore = {

tasks:Task[]

addTask:(
title:string,
description:string,
category:string,
repeatType?:"none"|"daily"|"weekly",
repeatDays?:number[]
)=>void

addGroceryTask:(items:GroceryItem[])=>void

toggleTask:(id:string)=>void

toggleItem:(taskId:string,itemId:string)=>void

deleteTask:(id:string)=>void

refreshDailyTasks:()=>void
}

function today(){
return new Date().toISOString().split("T")[0]
}

function weekday(){
return new Date().getDay()
}

export const useTasksStore = create<TasksStore>((set,get)=>({

tasks:[],

addTask:(title,description,category,repeatType="none",repeatDays=[])=>{

const state=get()

const exists = state.tasks.some(t=>
t.title===title && t.createdAt===today()
)

if(exists) return

set({
tasks:[
...state.tasks,
{
id:Date.now().toString(),
title,
description,
category,
type:"normal",
repeatType,
repeatDays,
completed:false,
createdAt:today()
}
]
})

},

addGroceryTask:(items)=>{

set(state=>({

tasks:[
...state.tasks,
{
id:Date.now().toString(),
title:"🛒 Grocery List",
description:"",
category:"Daily life",
type:"grocery",
completed:false,
createdAt:today(),
items
}
]

}))

},

toggleTask:(id)=>{

set(state=>({

tasks:state.tasks.map(t=>{

if(t.id!==id) return t

return{
...t,
completed:!t.completed,
lastCompleted:today()
}

})

}))

},

toggleItem:(taskId,itemId)=>{

set(state=>({

tasks:state.tasks.map(task=>{

if(task.id!==taskId) return task

return{
...task,
items:task.items?.map(i=>
i.id===itemId
? {...i,checked:!i.checked}
:i
)
}

})

}))

},

deleteTask:(id)=>{

set(state=>({
tasks:state.tasks.filter(t=>t.id!==id)
}))

},

refreshDailyTasks:()=>{

const day=weekday()

set(state=>({

tasks:state.tasks.map(task=>{

if(task.repeatType==="daily"){
return {...task,completed:false}
}

if(task.repeatType==="weekly" && task.repeatDays?.includes(day)){
return {...task,completed:false}
}

return task

})

}))

}

}))