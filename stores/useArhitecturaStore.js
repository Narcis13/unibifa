import { defineStore } from "pinia";

export const useArhitecturaStore = defineStore("arhitecturaStore",()=>{

    const arhitectura={
        sursefinantare:{
            "titlu":"Surse de finantare",
            "proprietati":[
             {"name": "id", "align": "center", "label": "ID", "field": "id", "sortable": false,"displayed_in_table":false,"hidden_in_form":true,"qtype":"QInput"},
             {"name": "denumire", "align": "left", "label": "Denumire *", "field": "denumire", "sortable": true,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "cod", "align": "center", "label": "Cod *", "field": "cod", "sortable": false,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "scurt", "align": "left", "label": "Nume scurt *", "field": "scurt", "sortable": true,"displayed_in_table":true,"qtype":"QInput"} 
           
             
            ]
        }
    }





    return {
        arhitectura
    }
})