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


    return {
        loading,
        error,
        createFacturaPrimita
    }
}