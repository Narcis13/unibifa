import type { Receptie,ReceptionResponse } from "~/types/receptii"

export const useReceptii = ()=>{

    const loading = ref(false)
    const error = ref<string | null>(null)
    const receptii = ref<Receptie[]>([])

    const fetchReceptii = async ()=>{
     
    }

    const fetchReceptiiAngajamente = async (compartimentid:number)=>{
       const ang_disponibile = await $fetch(`/api/receptii/${compartimentid}/receptiiangajamente`)

       return ang_disponibile
    }

    const fetchReceptions = async (compartimentId: number) => {
      return await $fetch<ReceptionResponse>('/api/receptii', {
        query: {
          compartimentId
        }
      })
    }
    const createReceptie = async (data) => {
        loading.value = true
        try {
          const result = await $fetch('/api/receptii', {
            method: 'POST',
            body: {
              ...data
            }
          })
          receptii.value.push(result)
          return result
        } catch (e) {
          error.value = 'Eroare la crearea receptiei'
          console.error(e)
          throw e
        } finally {
          loading.value = false
        }
      }
    return {
        loading,
        error,
        receptii,
        fetchReceptii,
        fetchReceptiiAngajamente,
        createReceptie,
        fetchReceptions
    }
}