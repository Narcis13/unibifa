import type { Angajament, CreateAngajamentDTO, ModificareAngajament, ModificareAngajamentDTO } from '~/types/angajamente'
import { useUtilizatorStore } from '~/stores/useUtilizatorStore'

export const useAngajamente = () => {

  const utilizatorStore = useUtilizatorStore()
  const situatieBuget = ref<{
    disponibilBugetar:number,
    sumaBuget:string | number
  }>({disponibilBugetar:0,sumaBuget:''})

  const angajamente = ref<Angajament[]>([])
  const categoriiOptions = ref<Array<{
    label: string
    value: number
    categorie: {
      id: number
      denumire: string
      sursaFinantare: {
        id: number
        denumire: string
        cod: string
      }
      articolBugetar: {
        id: number
        denumire: string
        cod: string
      }
    }
  }>>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAngajamente = async (exercitiuBugetar: number, filters:Record<string,any>) => {
   //console.log('sunt in useAngajamente fetch angajamente',filters)
   const comp=filters.compartiment==null?'':Array.isArray(filters.compartiment)?`&compartiment=${filters.compartiment[0].value}`:`&compartiment=${filters.compartiment.value}`
   const sursa=filters.sursafinantare==null?'':`&sursa=${filters.sursafinantare}`
   const artbug=filters.artbug==null?'':`&artbug=${filters.artbug}`
    const viza='vizatCFPP' in filters?`&viza=${filters.vizatCFPP}`:''
    
    loading.value = true
    try {
      angajamente.value = await $fetch(`/api/angajamente?an=${exercitiuBugetar}&from=${filters.data.from}&to=${filters.data.to}${comp}${viza}&sumaoperator=${filters.suma.operator.value}&sumavalue=${filters.suma.value}${sursa}${artbug}`)
    } catch (e) {
      error.value = 'Eroare la încărcarea angajamentelor'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const fetchCategoriiByCompartiment = async (compartimentId: number) => {
    loading.value = true
    try {
      categoriiOptions.value = await $fetch(`/api/categorii/compartiment/${compartimentId}`)
    } catch (e) {
      error.value = 'Eroare la încărcarea categoriilor'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const createAngajament = async (data: Omit<CreateAngajamentDTO, 'idUser'>) => {
    loading.value = true
    try {
      const result = await $fetch('/api/angajamente', {
        method: 'POST',
        body: {
          ...data,
          idUser: utilizatorStore.utilizator?.id
        }
      })
      angajamente.value.push(result)
      return result
    } catch (e) {
      error.value = 'Eroare la crearea angajamentului'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const addModificare = async (idAngajament: number, data: Omit<ModificareAngajamentDTO, 'idUser'>) => {
    loading.value = true
    try {
      const result = await $fetch(`/api/angajamente/${idAngajament}/modificari`, {
        method: 'POST',
        body: {
          ...data,
          idUser: utilizatorStore.utilizator?.id
        }
      })
      const angajament = angajamente.value.find(a => a.id === idAngajament)
      if (angajament && angajament.modificari) {
        angajament.modificari.push(result)
      }
      return result
    } catch (e) {
      error.value = 'Eroare la modificarea angajamentului'
      console.error(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const validateDisponibil = async (idCategorie: number, suma: number) => {
    try {
      const result = await $fetch(`/api/angajamente/validate`, {
        method: 'POST',
        body: { idCategorie, suma }
      })
      return result.valid
    } catch (e) {
      error.value = 'Eroare la validarea disponibilului'
      console.error(e)
      return false
    }
  }
  const infoVizibil = ref(false)
  const categorieSelectata = async (idCategorie:number)=>{
   
    infoVizibil.value=true

    try {
      const result = await $fetch(`/api/angajamente/validate`, {
        method: 'POST',
        body: { idCategorie, suma:0 }
      })
      //console.log('Categorie selectata',idCategorie,result)
      situatieBuget.value.disponibilBugetar=result.disponibilBugetar
      situatieBuget.value.sumaBuget=result.sumaBuget
    } catch (e) {
      error.value = 'Eroare la validarea disponibilului'
      console.error(e)
  
    }
  }
  return {
    angajamente,
    categoriiOptions,
    loading,
    error,
    fetchAngajamente,
    fetchCategoriiByCompartiment,
    createAngajament,
    addModificare,
    validateDisponibil,
    categorieSelectata,
    infoVizibil,
    situatieBuget
  }
}
