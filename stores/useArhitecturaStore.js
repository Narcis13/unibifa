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
        },
        articolebugetare:{
            "titlu":"Articole bugetare",
            "proprietati":[
             {"name": "id", "align": "center", "label": "ID", "field": "id", "sortable": false,"displayed_in_table":false,"hidden_in_form":true,"qtype":"QInput"},
             {"name": "cod", "align": "center", "label": "Cod *", "field": "cod", "sortable": true,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "denumire", "align": "left", "label": "Denumire *", "field": "denumire", "sortable": true,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "iban", "align": "left", "label": "Cont IBAN", "field": "iban", "sortable": false,"displayed_in_table":false,"qtype":"QInput","validare":["ibanValid"]} , 
             {"name": "codang", "align": "left", "label": "Cod CAB", "field": "codang", "sortable": false,"displayed_in_table":true,"qtype":"QInput"} ,
             {"name": "indicator", "align": "left", "label": "Indicator CAB", "field": "indicator", "sortable": false,"displayed_in_table":true,"qtype":"QInput"} 
           
             
            ]
        },
        compartimente:{
            "titlu":"Compartimente",
            "proprietati":[
             {"name": "id", "align": "center", "label": "ID", "field": "id", "sortable": false,"displayed_in_table":false,"hidden_in_form":true,"qtype":"QInput"},
             {"name": "denumire", "align": "left", "label": "Denumire *", "field": "denumire", "sortable": true,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "responsabil", "align": "left", "label": "Responsabil *", "field": "idresponsabil", "sortable": false,"displayed_in_table":true,"qtype":"QSelect","options":["api/info/responsabili"]} 
           
             
            ]
        }
    }





    return {
        arhitectura
    }
})