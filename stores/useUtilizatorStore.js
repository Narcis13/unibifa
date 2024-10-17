import { defineStore } from "pinia";

export const useUtilizatorStore = defineStore('utilizatorStore',()=>{
    const text="Pinia..."
    const utilizator=ref(null)
    const eAutentificat=ref(false)
    const eAdmin=ref(false)


    function autentificare(payload){
        console.log('payload autentificare',payload)
    }

    function logout(){
       console.log('')
    }
    return {
        text,
        utilizator,
        eAdmin,
        eAutentificat,
        autentificare,
        logout
    }
})