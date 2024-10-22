import type { Buget } from "~/types/bugete"

// composables/useBugete.ts
export const useBugete = () => {
    const loading = ref(false)
    const bugete = ref<Buget[]>([])
    const error = ref<string | null>(null)
  
    const fetchBugete = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await useFetch('/api/bugete')
        bugete.value = response.data.value as Buget[]
      } catch (err) {
        error.value = 'Error loading budget data'
        console.error('Error:', err)
      } finally {
        loading.value = false
      }
    }
  
    return {
      bugete,
      loading,
      error,
      fetchBugete
    }
  }