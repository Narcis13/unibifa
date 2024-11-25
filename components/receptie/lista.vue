<script setup lang="ts">
import { useReceptii }  from "~/composables/useReceptii"; 
import { useOrdonantari } from "~/composables/useOrdonantari";
import { date ,useQuasar} from 'quasar'


interface Props {
  idCompartiment: number
}

const props = defineProps<Props>()

interface Reception {
  id: number
  sursafinantare: string
  articolbugetar: string
  furnizor: {
    denumire: string
    codfiscal: string
  }
  nrfact: string
  datafact: Date
  valoare: number
  mentiuni: string | null
  ordonantare: {
    numar: string
    data: Date
    stare: string
    valoare: number
  } | null
}
const {fetchReceptions} = useReceptii()
const {createOrdonantare} = useOrdonantari()
const loading = ref(false)
const selected = ref<Reception[]>([])
const receptions = ref<Reception[]>([])
console.log('setup lista receptii')
const $q= useQuasar()
const isValidSelection = computed(() => {
  // If no selections or only one selection, return false
  if (selected.value.length === 0) {
    return false
  }

  // Get the first selected row to compare against
  const firstSelection = selected.value[0]

  // Check if all selected rows match the criteria
  return selected.value.every(row => 
    // Check if ordonantare is null
    row.ordonantare === null &&
    // Check if same furnizor
    row.furnizor.codfiscal === firstSelection.furnizor.codfiscal &&
    // Check if same sursa finantare
    row.sursafinantare === firstSelection.sursafinantare &&
    // Check if same articol bugetar
    row.articolbugetar === firstSelection.articolbugetar
  )
})


const columns = [
  {
    name: 'sursafinantare',
    label: 'Sursa finantare',
    field: 'sursafinantare',
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/surse')
    }
  },
  {
    name: 'articolbugetar',
    label: 'Articol bugetar',
    field: 'articolbugetar',
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/articole')
    }
  },
  {
    name: 'furnizor',
    label: 'Furnizor',
    field: (row: Reception) => row.furnizor.denumire,
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'list',
      options:[]
    }
  },
  {
    name: 'nrfact',
    label: 'Nr. fact.',
    field: 'nrfact',
    align: 'left',
    sortable: true
  },
  {
    name: 'datafact',
    label: 'Data fact.',
    field: 'datafact',
    format: (val: Date) => new Date(val).toLocaleDateString('ro-RO'),
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'interval'
    }
  },
  {
    name: 'valoare',
    label: 'Valoare',
    field: 'valoare',
    format: (val: number) => new Intl.NumberFormat('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val),
    align: 'right',
    sortable: true,
    style: (row: Reception) => row.valoare < 0 ? 'color: red' : '',
    filterOptions:{
      enabled:true,
      type:'numericvalue'
    }
  },
  {
    name: 'mentiuni',
    label: 'Mentiuni',
    field: 'mentiuni',
    align: 'left'
  },
  {
    name: 'ordonantare',
    label: 'Ordonantare Plata',

    field: (row: Reception) => row.ordonantare?.numar || '-',
    format: (val: string, row: Reception) => {
      if (!row.ordonantare) return '-'
      return `${row.ordonantare.numar} / ${new Date(row.ordonantare.data).toLocaleDateString('ro-RO')}`
    },
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'check'
    }
  }
]
const filterDefaults:Record<string,any> = {
  
  'ordonantare':false,
  'furnizor':null,
  'artbug':null,
  'sursafinantare':null,
  'datafact':{ from: date.formatDate(new Date(new Date().getFullYear(), 0, 1), 'YYYY/MM/DD'), to: date.formatDate(new Date(),'YYYY/MM/DD') },
  'valoare':{ operator:  { label: '>', value: 'gt' }, value: 0 }
}
const totalValoare = computed(() => {
  return receptions.value.reduce((sum, reception) => sum + parseFloat(reception.valoare), 0)
})

const formattedTotalValoare = computed(() => {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(totalValoare.value)
})

const fetchReceptionsData = async () => {
  try {
    loading.value = true
    const response = await fetchReceptions(props.idCompartiment)
    receptions.value = response
  } catch (error) {
    console.error('Error fetching receptions:', error)
    // You might want to use a toast or notification system here
  } finally {
    loading.value = false
  }
}
const handleFilters = async (filters: Record<string, any>) => {
  console.log('filters',filters)
  try {
   // await fetchAngajamente(2024,filters)
  } catch (e){
    console.error(e)
  }
}
const ordonantareNoua = async ()=>{
 
  if (!selected.value.length) return
  
  try {
    
    
    // Get the first selected row to get furnizor details
    const firstSelection = selected.value[0]
    
    // Calculate total value from selected receptions
    const totalValue = selected.value.reduce((sum, reception) => sum + parseFloat(reception.valoare), 0)
    
    const payload = {
      idFurnizor: firstSelection.furnizor.id,
      receptii: selected.value.map(reception => reception.id),
      valoare: totalValue,
      explicatii: `Ordonantare pentru ${selected.value.length} facturi de la ${firstSelection.furnizor.denumire}`
    }
    console.log('Ordonantare noua',selected.value,payload)
    const result = await createOrdonantare(payload)
    
    if (result.success) {
      // Refresh the receptions list
      await fetchReceptionsData()
      
      // Clear selection
      selected.value = []
      
      // Show success message using Quasar's notify
      $q.notify({
        type: 'positive',
        message: `Ordonanțare creată cu succes: ${result.data.numar}`
      })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error instanceof Error ? error.message : 'Eroare la crearea ordonanțării'
    })
    console.error('Error creating ordonantare:', error)
  }
}

onMounted(() => {
  fetchReceptionsData()
})
</script>

<template>
  <q-table
    :rows="receptions"
    :columns="columns"
    row-key="id"
    :loading="loading"
    selection="multiple"
    v-model:selected="selected"
    :pagination="{
      rowsPerPage: 20
    }"
  >
  <template v-slot:top>
        <FiltruReceptii
              :columns="columns"
              :defaults="filterDefaults"
              @filtersadded="handleFilters"
        >

        </FiltruReceptii>
        
        <q-space />
        <q-btn color="primary" :disable="!isValidSelection" no-caps icon="payments" label="Ordonanțează la plată" @click="ordonantareNoua" />
      </template>

    <template v-slot:bottom-row>
      <q-tr>
        <q-td colspan="6" class="text-right text-weight-bold text-subtitle1">Total:</q-td>
        <q-td class="text-right text-weight-bold text-subtitle1" :style="totalValoare < 0 ? 'color: red' : ''">
          {{ formattedTotalValoare }}
        </q-td>
        <q-td colspan="2" />
      </q-tr>
    </template>
  </q-table>
</template>

<style scoped>
.q-table__grid-content {
  min-height: 100px;
}
</style>