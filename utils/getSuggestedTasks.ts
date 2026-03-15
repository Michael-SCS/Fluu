import { taskTemplates } from "@/data/taskTemplates"

export function getSuggestedTasks(existingTasks:any[]){

const existingTitles =
existingTasks.map(t=>t.title)

const available =
taskTemplates.filter(t =>
!existingTitles.includes(t.title)
)

const shuffled =
available.sort(()=>0.5 - Math.random())

return shuffled.slice(0,3)

}
