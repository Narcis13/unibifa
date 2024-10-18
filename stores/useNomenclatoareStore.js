import {defineStore} from 'pinia'

export  const useNomenclatoareStore = defineStore('nomenclatoareStore',()=>{
      const baza = reactive({
        sursefinantare_index:reactive([]),
        sursefinantare_demodificat:{},
        furnizor_index:reactive([]),
        furnizor_demodificat:{},
        produs_index:reactive([]),
        produs_demodificat:{},
        serie_index:reactive([]),
        serie_demodificat:{},
        gestiune_index:reactive([]),
        gestiune_demodificat:{},
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

      return {
        baza,
        add_item,
        mod_item,
        integreaza_item
      }
})