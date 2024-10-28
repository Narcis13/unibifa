import type { Angajament, CreateAngajamentDTO, ModificareAngajament, ModificareAngajamentDTO } from '~/types/angajamente'

export const useAngajamente = () => {

  
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

  const fetchAngajamente = async (exercitiuBugetar: number) => {
    loading.value = true
    try {
      angajamente.value = await $fetch(`/api/angajamente?an=${exercitiuBugetar}`)
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

  const createAngajament = async (data: CreateAngajamentDTO) => {
    loading.value = true
    try {
      const result = await $fetch('/api/angajamente', {
        method: 'POST',
        body: data
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

  const addModificare = async (idAngajament: number, data: ModificareAngajamentDTO) => {
    loading.value = true
    try {
      const result = await $fetch(`/api/angajamente/${idAngajament}/modificari`, {
        method: 'POST',
        body: data
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

  return {
    angajamente,
    categoriiOptions,
    loading,
    error,
    fetchAngajamente,
    fetchCategoriiByCompartiment,
    createAngajament,
    addModificare,
    validateDisponibil
  }
}
