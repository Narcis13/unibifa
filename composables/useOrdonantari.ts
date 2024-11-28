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

    const fetchOrdonantari = async ()=>{
      const { data} = await $fetch('/api/ordonantari')

      return data
    }

 return {
    loading,
    error,
    createOrdonantare,
    fetchOrdonantari
 }
}