<!-- components/PlatiTable.vue -->
<template>
    <div class="q-pa-md">
      <div class="row q-mb-md items-center justify-between">
      <div class="row items-center">
        <q-btn-dropdown square icon="tune" class="q-mr-sm">
          <div class="q-pa-md" style="min-width: 100px">
              <q-input dense outlined v-model="selectedDate">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="selectedDate" :default-year-month="defaultYearMonth" >
                        <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Inchide" color="primary" flat />
                                                </div>
                        </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
          <q-btn label="Genereaza OPXML" color="primary" class="q-mt-sm" @click="generateOPXML" />
          </div>
        </q-btn-dropdown>

        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Caută..."
          class="col-grow q-mr-md"
          @update:model-value="onSearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <q-btn
        color="negative"
        icon="cancel"
        label="Anulare"
        @click="handleAnulare"
        :disable="!selectedRows.length||eDejaAnulat"
      />
    </div>
  
      <q-table
        :rows="platiData"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:selected="selectedRows"
        selection="single"
        :filter="search"
        :rows-per-page-options="[10, 25, 50, 100]"
        @request="onRequest"
      >
        <template v-slot:body-cell-dataop="props">
          <q-td :props="props">
            {{ formatDate(props.row.dataop) }}
          </q-td>
        </template>
  
        <template v-slot:body-cell-suma="props">
          <q-td :props="props">
            {{ formatAmount(props.row.suma) }}
          </q-td>
        </template>
  
        <template v-slot:body-cell-stare="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.stare === 'activ' ? 'positive' : 'negative'"
              text-color="white"
              dense
            >
              {{ props.row.stare }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </div>
  </template>
  
  <script setup>

  import { useQuasar,date } from 'quasar'
  
  const $q = useQuasar()
  
  const columns = [
    {
      name: 'numarop',
      required: true,
      label: 'Numar OP',
      align: 'left',
      field: 'numarop',
      sortable: true
    },
    {
      name: 'dataop',
      required: true,
      label: 'Data OP',
      align: 'left',
      field: 'dataop',
      sortable: true
    },
    {
      name: 'numefurnizor',
      required: true,
      label: 'Furnizor',
      align: 'left',
      field: 'numefurnizor',
      sortable: true
    },
    {
      name: 'suma',
      required: true,
      label: 'Suma',
      align: 'right',
      field: 'suma',
      sortable: true
    },
    {
      name: 'explicatii',
      required: true,
      label: 'Explicatii',
      align: 'left',
      field: 'explicatii',
      sortable: true
    },
    {
      name: 'artbug',
      required: true,
      label: 'Art. bug.',
      align: 'left',
      field: 'artbug',
      sortable: true
    },
    {
      name: 'stare',
      required: true,
      label: 'Stare',
      align: 'left',
      field: 'stare',
      sortable: true
    }
  ]
  const selectedDate= ref(date.formatDate(Date.now(), 'YYYY/MM/DD'))
  const defaultYearMonth= ref(date.formatDate(Date.now(), 'YYYY/MM'))
  const platiData = ref([])
  const loading = ref(false)
  const search = ref('')
  const selectedRows = ref([])
  
  const generateOPXML=()=>{
    console.log('generateOPXML')
  }
  const formatDate = (dateString) => {
    return date.formatDate(dateString, 'DD.MM.YYYY')
  }
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  const fetchData = async () => {
    loading.value = true
    try {
      const response = await $fetch('/api/plati')
    // const data = await response.json()
    console.log(response, 'response api plati')
      platiData.value = response
    } catch (error) {
      console.error('Error fetching data:', error)
      $q.notify({
        type: 'negative',
        message: 'Eroare la încărcarea datelor'
      })
    } finally {
      loading.value = false
    }
  }
  const eDejaAnulat=computed(()=>{
    if (!selectedRows.value.length) return true
    return selectedRows.value[0].stare==='anulat'
  })
  const handleAnulare = async () => {
    if (!selectedRows.value.length) return
  
    $q.dialog({
      title: 'Confirmare',
      message: 'Sigur doriți să anulați plățile selectate?',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
    
     
       const response = await $fetch('/api/plati', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {idPlata:selectedRows.value[0].id}
        })
       console.log(response)
        if (response.success) {
          $q.notify({
            type: 'positive',
            message: 'Plata a fost anulate cu succes'
          })
          await fetchData()
          selectedRows.value = []
        }
      } catch (error) {
        console.error('Error canceling payments:', error)
        $q.notify({
          type: 'negative',
          message: 'Eroare la anularea plăților'
        })
      }
    })
  }
  
  const onSearch = (val) => {
    // The q-table handles filtering automatically with the :filter prop
  }
  
  const onRequest = async (props) => {
    // Handle sorting and pagination if needed
  }
  
  onMounted(() => {
    fetchData()
  })
  </script>