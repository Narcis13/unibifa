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

    const fetchReceptions = async (compartimentId: number,filters:Record<string,any>) => {
      const furnizor=filters.furnizor==null?'':`&furnizor=${filters.furnizor}`
      const sursa=filters.sursafinantare==null?'':`&sursa=${filters.sursafinantare}`
      const artbug=filters.articolbugetar==null?'':`&artbug=${filters.articolbugetar}`
       const ordon='ordonantare' in filters?`&ordonantare=${filters.ordonantare}`:''
    //console.log(furnizor,sursa,artbug,ordon,filters)
      return await $fetch<ReceptionResponse>(`/api/receptii?compartimentId=${compartimentId}&from=${filters.datafact.from}&to=${filters.datafact.to}${furnizor}${ordon}&sumaoperator=${filters.valoare.operator.value}&sumavalue=${filters.valoare.value}${sursa}${artbug}`
      )
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