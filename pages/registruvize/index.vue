<template>
  <q-page padding>
    <div class="my-card">
      <h5 class="text-h5 q-mb-md">Registru vize de control financiar preventiv</h5>
      
      <q-dialog v-model="showDateDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">Selectați perioada</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              filled
              v-model="dataInceput"
              label="Data început"
              type="date"
              class="q-mb-md"
              :rules="[val => !!val || 'Data început este obligatorie']"
            />
            
            <q-input
              filled
              v-model="dataSfarsit"
              label="Data sfârșit"
              type="date"
              :rules="[val => !!val || 'Data sfârșit este obligatorie', 
                       val => !dataInceput || val >= dataInceput || 'Data sfârșit trebuie să fie după data început']"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Anulare" color="primary" @click="$router.push('/')" />
            <q-btn 
              label="Generare raport" 
              color="primary" 
              @click="genereazaRaport"
              :disable="!dataInceput || !dataSfarsit || dataSfarsit < dataInceput"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div v-if="loading" class="text-center q-pa-lg">
        <q-spinner-dots color="primary" size="40px" />
        <div class="q-mt-md">Se încarcă datele...</div>
      </div>

      <div v-else-if="registruData.length > 0" class="q-mt-md">
        <q-table
          flat
          bordered
          :rows="registruData"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 20 }"
        />
        
        <div class="q-mt-md">
          <q-btn 
            label="Tipărire raport" 
            color="primary" 
            icon="print"
            @click="printReport"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'

const router = useRouter()
const showDateDialog = ref(true)
const dataInceput = ref('')
const dataSfarsit = ref('')
const loading = ref(false)
const registruData = ref([])

const columns = [
  { name: 'nrvizac', label: 'Nr. viză', field: 'nrvizac', align: 'left', sortable: true },
  { name: 'dataviza', label: 'Data viză', field: row => formatDate(row.dataviza), align: 'center', sortable: true },
  { name: 'document', label: 'Document', field: 'document', align: 'left' },
  { name: 'explicatii', label: 'Explicații', field: 'explicatii', align: 'left' },
  { name: 'compartiment', label: 'Compartiment', field: 'compartiment', align: 'left' },
  { name: 'valoare', label: 'Valoare', field: row => formatAmount(row.valoare), align: 'right', sortable: true },
  { name: 'nume', label: 'Utilizator', field: 'nume', align: 'left' }
]

const formatDate = (dateString) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'dd.MM.yyyy', { locale: ro })
}

const formatAmount = (value) => {
  if (!value) return '0,00'
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const genereazaRaport = async () => {
  if (!dataInceput.value || !dataSfarsit.value || dataSfarsit.value < dataInceput.value) {
    return
  }

  showDateDialog.value = false
  loading.value = true

  try {
    const response = await $fetch('/api/registruvize', {
      params: {
        dataInceput: dataInceput.value,
        dataSfarsit: dataSfarsit.value
      }
    })
    
    registruData.value = response.data || []
  } catch (error) {
    console.error('Eroare la încărcarea datelor:', error)
    registruData.value = []
  } finally {
    loading.value = false
  }
}

const printReport = () => {
  const params = new URLSearchParams({
    dataInceput: dataInceput.value,
    dataSfarsit: dataSfarsit.value
  })
  
  window.open(`/rapoarte/registruvize?${params.toString()}`, '_blank')
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
</style>