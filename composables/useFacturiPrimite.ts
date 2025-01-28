import type { FacturaPrimitaDTO } from '~/types/facturiprimite'

export const useFacturiPrimite = ()=>{
    const loading = ref(false)
    const error = ref<string | null>(null)

    const createFacturaPrimita = async (data:FacturaPrimitaDTO)=>{
        try {
            loading.value = true
            error.value = null
            
            return await $fetch('/api/facturiprimite', {
              method: 'POST',
              body: data
            })
          } catch (e) {
            error.value = e instanceof Error ? e.message : 'An error occurred'
            throw e
          } finally {
            loading.value = false
          }
    }
    function hasKey(obj:any, key:string) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
   const toateFacturilePrimite = async (sortateAB:boolean, filters:Record<string,any>)=>{
        try {
            loading.value = true
            error.value = null
            
            const sufix = sortateAB ? '&sortby=articolbugetar' : ''
            let prefix= `?dela=${filters.datafact.from}&panala=${filters.datafact.to}`
            if(hasKey(filters,'ramasplata')){
                prefix+=(filters.ramasplata?`&platite=true&platitedela=${filters.platiteDeLaData}&platitepanala=${filters.platitePanaLaData}`:`&platite=false&neachitatela=${filters.neachitateLaData}`)
            }
            else{
                prefix+=('&platite=toate')
            }
            if(hasKey(filters,'numefurnizor')&&filters.numefurnizor!==null){
                prefix+=`&furnizorId=${filters.numefurnizor}`
            }
            if(hasKey(filters,'artbug')&&filters.artbug!==null){
                prefix+=`&artbug=${filters.artbug}`
            }
            if(hasKey(filters,'sursafin')&&filters.sursafin!==null){
              prefix+=`&sursafin=${filters.sursafin}`
          }
            prefix+=`&sumaoperator=${filters.valoare.operator.value}&sumavalue=${filters.valoare.value}`
            console.log('sunt in useFacturiPrimite fetch facturi primite',filters,prefix)
            return await $fetch('/api/facturiprimite'+prefix+sufix)
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'An error occurred'
            throw e
        } finally {
            loading.value = false
        }
    }
    return {
        loading,
        error,
        createFacturaPrimita,
        toateFacturilePrimite
    }
}