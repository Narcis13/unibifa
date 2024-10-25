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
             {"name": "idresponsabil", "align": "left", "label": "Responsabil *", "field": "responsabil", "sortable": false,"displayed_in_table":true,"qtype":"QSelect","options":["api/info/responsabili"]} 
           
             
            ]
        },
        Categorii:{
            "titlu":"Categorii",
            "proprietati":[
             {"name": "id", "align": "center", "label": "ID", "field": "id", "sortable": false,"displayed_in_table":false,"hidden_in_form":true,"qtype":"QInput"},
             {"name": "denumire", "align": "left", "label": "Denumire *", "field": "denumire", "sortable": true,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "explicatii", "align": "left", "label": "Explicatii *", "field": "explicatii", "sortable": false,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "idsursa", "align": "left", "label": "Sursa finantare *", "field": "sursaFinantare", "sortable": false,"displayed_in_table":true,"qtype":"QSelect","options":["api/info/surse"]} ,
             {"name": "idarticol", "align": "left", "label": "Articol bugetar *", "field": "articolBugetar", "sortable": false,"displayed_in_table":true,"qtype":"QSelect","options":["api/info/articole"]} ,
             {"name": "idcompartiment", "align": "left", "label": "Compartiment *", "field": "compartiment", "sortable": false,"displayed_in_table":true,"qtype":"QSelect","options":["api/info/compartimente"]} 
             
            ]
        },
        Bugete:{
            "titlu":"Linii bugete",
            "proprietati":[
             {"name": "id", "align": "center", "label": "ID", "field": "id", "sortable": false,"displayed_in_table":false,"hidden_in_form":true,"qtype":"QInput"},
             {"name": "idSursa", "align": "left", "label": "Sursa finantare *", "field": "sursaFinantare", "sortable": true,"displayed_in_table":true,"qtype":"QSelect","options":["api/info/surse"]} ,
             {"name": "idArticol", "align": "left", "label": "Articol bugetar *", "field": "articolBugetar", "sortable": true,"displayed_in_table":true,"qtype":"QSelect","options":["api/info/articole"]}
             
            ]
        },
        furnizori:{
            "titlu":"Lista furnizori",
            "proprietati":[
             {"name": "id", "align": "center", "label": "ID", "field": "id", "sortable": false,"displayed_in_table":false,"hidden_in_form":true,"qtype":"QInput"},
             {"name": "codfiscal", "align": "center", "label": "Cod fiscal *", "field": "codfiscal", "sortable": false,"with_action":true,"displayed_in_table":true,"qtype":"QInput","hint":"Max. 13 caractere","validare":["codfiscalValid"]},
             {"name": "denumire", "align": "left", "label": "Denumire furnizor *", "field": "denumire", "sortable": true,"displayed_in_table":true,"qtype":"QInput"},
             {"name": "regcom", "align": "left", "label": "Nr. reg. com.", "field": "reg,com", "sortable": false,"displayed_in_table":false,"qtype":"QInput","validare":["caText"]},
             {"name": "adresa", "align": "left", "label": "Adresa *", "field": "adresa", "sortable": false,"displayed_in_table":false,"qtype":"QInput","validare":["caText"]},
             {"name": "judet", "align": "left", "label": "Judet *", "field": "judet", "sortable": false,"displayed_in_table":false,"qtype":"QSelect","options":["api/info/judete"]} , 
             {"name": "localitate", "align": "left", "label": "Localitate", "field": "localitate", "sortable": false,"displayed_in_table":true,"qtype":"QInput","validare":["caText"]} , 
             {"name": "tara", "align": "left", "label": "Tara *", "field": "tara", "sortable": false,"displayed_in_table":false,"qtype":"QInput","validare":["caText"],"default_value":"ROMANIA"} , 
             {"name": "telefon", "align": "left", "label": "Telefon", "field": "telefon", "sortable": false,"displayed_in_table":true,"qtype":"QInput","validare":["telefonValid"]} , 
             {"name": "email", "align": "left", "label": "Email", "field": "email", "sortable": false,"displayed_in_table":true,"qtype":"QInput","validare":["emailValid"]} , 
             {"name": "iban", "align": "left", "label": "Cont IBAN *", "field": "iban", "sortable": false,"displayed_in_table":false,"qtype":"QInput","validare":["ibanValid"],"sync":["banca"]} , 
             {"name": "banca", "align": "left", "label": "Banca", "field": "banca", "sortable": false,"displayed_in_table":false,"qtype":"QSelect","options":["api/info/banci"]} , 
             {"name": "perscontact", "align": "left", "label": "Persoana contact", "field": "perscontact", "sortable": false,"displayed_in_table":true,"qtype":"QInput","validare":["caText"]} , 
             {"name": "platitortva", "align": "center", "label": "Platitor TVA", "field": "platitortva", "sortable": false,"displayed_in_table":false,"qtype":"QCheckbox","default_value":false}
            ]
         }
    }





    return {
        arhitectura
    }
})