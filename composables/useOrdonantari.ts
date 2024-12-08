interface CreateOrdonantarePayload {
    idFurnizor: number;
    receptii: number[];
    valoare: number;
    explicatii?: string;
  }
  
  interface OrdonantarePlataResponse {
    success: boolean;
    data: {
      id: number;
      numar: string;
      dataord: Date;
      valoare: number;
      stare: string;
      explicatii: string | null;
      furnizor: {
        denumire: string;
        codfiscal: string;
      };
    };
  }

export const useOrdonantari = ()=>{

    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const createOrdonantare = async (payload: CreateOrdonantarePayload): Promise<OrdonantarePlataResponse> => {
      try {
        loading.value = true
        error.value = null
        
        return await $fetch('/api/ordonantari', {
          method: 'POST',
          body: payload
        })
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'An error occurred'
        throw e
      } finally {
        loading.value = false
      }
    }

    const fetchOrdonantari = async (filters:Record<string,any>)=>{
       const comp=filters.compartiment==null?'':typeof filters.compartiment=='number'?`&compartiment=${filters.compartiment}`:Array.isArray(filters.compartiment)?`&compartiment=${filters.compartiment[0].value}`:`&compartiment=${filters.compartiment.value}`
       const sursa=filters.sursa==null?'':`&sursa=${filters.sursa}`
       const furnizor=filters.furnizor==null?'':`&furnizor=${filters.furnizor}`
       const artbug=filters.artbug==null?'':`&artbug=${filters.artbug}`
        const viza='vizaCFPP' in filters?`&viza=${filters.vizaCFPP}`:''
      const querystring = `?from=${filters.dataord.from}&to=${filters.dataord.to}${comp}${viza}&sumaoperator=${filters.valoare.operator.value}&sumavalue=${filters.valoare.value}${sursa}${artbug}${furnizor}`
      console.log('fetch Ordonanhtari',filters,querystring,typeof filters.compartiment)
      const { data} = await $fetch('/api/ordonantari'+querystring)

      return data
    }

 return {
    loading,
    error,
    createOrdonantare,
    fetchOrdonantari
 }
}