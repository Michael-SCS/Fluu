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

completed:boolean

repeatType?:"none"|"daily"|"weekly"
repeatDays?:number[]

type?:"normal"|"grocery"

items?:GroceryItem[]

createdDate:string
lastCompletedDate?:string
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

deleteTask:(id:string)=>void

toggleItem:(taskId:string,itemId:string)=>void

refreshDailyTasks:()=>void
}

function today(){

return new Date().toISOString().split("T")[0]

}

export const useTasksStore = create<TasksStore>((set,get)=>({

tasks:[],

addTask:(title,description,category,repeatType="none",repeatDays=[])=>{

const state = get()

const exists = state.tasks.some(t=>

t.title===title &&
t.createdDate===today()

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

completed:false,

repeatType,
repeatDays,

type:"normal",

createdDate:today()

}

]

})

},

addGroceryTask:(items)=>{

const state = get()

set({

tasks:[

...state.tasks,

{
id:Date.now().toString(),

title:"🛒 Grocery List",

description:"",

category:"Daily life",

completed:false,

type:"grocery",

items,

createdDate:today()

}

]

})

},

toggleTask:(id)=>{

set(state=>({

tasks:state.tasks.map(task=>{

if(task.id!==id) return task

const completed = !task.completed

return{

...task,

completed,

lastCompletedDate:completed ? today() : undefined

}

})

}))

},

deleteTask:(id)=>{

set(state=>({

tasks:state.tasks.filter(t=>t.id!==id)

}))

},

toggleItem:(taskId,itemId)=>{

set(state=>({

tasks:state.tasks.map(task=>{

if(task.id!==taskId) return task

return{

...task,

items:task.items?.map(item=>

item.id!==itemId

? item

: {...item,checked:!item.checked}

)

}

})

}))

},

refreshDailyTasks:()=>{

const day = new Date().getDay()

set(state=>({

tasks:state.tasks.map(task=>{

if(task.repeatType==="daily"){

return{

...task,

completed:false

}

}

if(task.repeatType==="weekly" && task.repeatDays?.includes(day)){

return{

...task,

completed:false

}

}

return task

})

}))

}

}))