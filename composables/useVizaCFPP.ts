import type { CreateVizaCFPPDTO } from "~/types/vizecfpp"

export const useVizaCFPP = ()=>{
    const loading = ref(false)
    const error = ref<string | null>(null)


    const vizaUrmatoare = async ()=>{
        let nextviza=null
        loading.value = true
        try {
          nextviza = await $fetch(`/api/info/nextviza`)
          return nextviza?.numar
        } catch (e) {
          error.value = 'Eroare la generarea urmatorului numar de viza CFPP'
          console.error(e)
        } finally {
          loading.value = false
        }
    }

    const createVizaCFPP = async (data:CreateVizaCFPPDTO) => {
      loading.value = true
      try {
        const result = await $fetch('/api/info/nextviza', {
          method: 'POST',
          body: {
            ...data
          }
        })
      
        return result
      } catch (e) {
        error.value = 'Eroare la aplicarea vizei'
        console.error(e)
        throw e
      } finally {
        loading.value = false
      }
    }

    const aplicaVizaCFPPAngajament = async (idModificareAngajament:number,data:CreateVizaCFPPDTO)=>{
      loading.value = true
      try {
        const result = await $fetch('/api/info/nextviza', {
          method: 'PATCH',
          body: {
            ...data,
            idModificareAngajament
          }
        })
      
        return result
      } catch (e) {
        error.value = 'Eroare la aplicarea vizei'
        console.error(e)
        throw e
      } finally {
        loading.value = false
      }
    }

    return {
        loading,
        error,
        vizaUrmatoare,
        createVizaCFPP,
        aplicaVizaCFPPAngajament
    }
}