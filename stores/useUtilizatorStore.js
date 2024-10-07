import { defineStore } from "pinia";

export const useUtilizatorStore = defineStore('utilizatorStore',()=>{
    const text="Pinia..."

    return {
        text
    }
})