import {defineStore} from 'pinia'

export  const useNomenclatoareStore = defineStore('nomenclatoareStore',()=>{
      const baza = reactive({
        sursefinantare_index:reactive([]),
        sursefinantare_demodificat:{},
        articolebugetare_index:reactive([]),
        articolebugetare_demodificat:{},
        compartimente_index:reactive([]),
        compartimente_demodificat:{},
        Categorii_index:reactive([]),
        Categorii_demodificat:{},
        Bugete_index:reactive([]),
        Bugete_demodificat:{},
        furnizori_index:reactive([]),
        furnizori_demodificat:{},
        coduricpv:[],
        codurinc:[]
      })


      function add_item(item,selector){
          baza[selector].unshift(item)
      }

      function mod_item(item,selector){
        //console.log('mod_item',item)
        baza[selector]=item
      }

      function integreaza_item(item,selector){

        let indexToUpdate = baza[selector].findIndex(obj => obj.id === item.id);

      // Check if the object with the specified ID exists
      if (indexToUpdate !== -1) {
        // Replace the object at the found index with the new object
        baza[selector][indexToUpdate] = item;
      }
   
      }

      function reset(){
        baza.sursefinantare_index=[]
        baza.articolebugetare_index=[]
        baza.compartimente_index=[]
      }

      return {
        baza,
        add_item,
        mod_item,
        integreaza_item,
        reset
      }
})