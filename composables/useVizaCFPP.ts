

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

    return {
        loading,
        error,
        vizaUrmatoare
    }
}