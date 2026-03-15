/*
Tipo de template de tarea
Esto sirve para crear tareas rápidas
*/

export type TaskTemplate = {

id:string
title:string
description:string
category:string

}

/*
Lista de templates
*/
export const taskTemplates:TaskTemplate[] = [

/* PLANNING */

{
id:"1",
title:"🗓️ Plan your day",
description:"Define the most important things you want to accomplish today.",
category:"Planning"
},

{
id:"2",
title:"🎯 Review your goals",
description:"Look at your long-term goals and check if today's actions align with them.",
category:"Planning"
},

{
id:"3",
title:"✍️ Write tomorrow's priorities",
description:"Prepare your top priorities for tomorrow before ending the day.",
category:"Planning"
},

{
id:"4",
title:"📅 Weekly planning",
description:"Take time to organize the week and define your priorities.",
category:"Planning"
},

/* DAILY LIFE */

{
id:"5",
title:"🛒 Grocery List",
description:"Write down everything you need to buy from the store.",
category:"Daily life"
},

{
id:"6",
title:"🧹 Clean your workspace",
description:"Organize and clean your desk to improve focus.",
category:"Daily life"
},

{
id:"7",
title:"👕 Prepare tomorrow's outfit",
description:"Choose what you'll wear tomorrow to save time in the morning.",
category:"Daily life"
},

{
id:"8",
title:"🧺 Organize your room",
description:"Put things back in place and create a calm environment.",
category:"Daily life"
},

/* PRODUCTIVITY */

{
id:"9",
title:"📥 Clear your inbox",
description:"Reply, archive or delete emails to keep your inbox under control.",
category:"Productivity"
},

{
id:"10",
title:"🔥 Work on your top priority",
description:"Spend focused time on the most important task of the day.",
category:"Productivity"
},

{
id:"11",
title:"📋 Review pending tasks",
description:"Check what tasks remain unfinished and reorganize them.",
category:"Productivity"
},

{
id:"12",
title:"🗂️ Declutter digital files",
description:"Delete unnecessary files and organize your folders.",
category:"Productivity"
},

/* HEALTH */

{
id:"13",
title:"🧘 Stretch for 5 minutes",
description:"Relax your muscles and reduce tension after sitting.",
category:"Health"
},

{
id:"14",
title:"🚶 Go for a short walk",
description:"Walk for a few minutes to clear your mind.",
category:"Health"
},

{
id:"15",
title:"💧 Drink a glass of water",
description:"Stay hydrated and support your energy levels.",
category:"Health"
},

{
id:"16",
title:"🏋️ Quick workout",
description:"Do a short body exercise routine.",
category:"Health"
},

/* MIND */

{
id:"17",
title:"📓 Write in your journal",
description:"Reflect about your thoughts and emotions.",
category:"Mind"
},

{
id:"18",
title:"📚 Read for 10 minutes",
description:"Spend some time reading something meaningful.",
category:"Mind"
},

{
id:"19",
title:"🧠 Reflect on your day",
description:"Think about what went well and what can improve.",
category:"Mind"
},

{
id:"20",
title:"🙏 Practice gratitude",
description:"Write down things you're grateful for today.",
category:"Mind"
}

]