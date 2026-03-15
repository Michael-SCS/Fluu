import { taskTemplates } from "@/data/taskTemplates"

export function getRandomTasks(count:number){

const shuffled = [...taskTemplates].sort(()=>0.5 - Math.random())

return shuffled.slice(0,count)

}
