<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useOrdonantari } from "~/composables/useOrdonantari";
import { useUtilizatorStore } from '~/stores/useUtilizatorStore'
import {useVizaCFPP} from '~/composables/useVizaCFPP'
import type { CreateVizaCFPPDTO } from "~/types/vizecfpp"
const {fetchOrdonantari} = useOrdonantari()
const {vizaUrmatoare,createVizaCFPP} = useVizaCFPP()
const $q = useQuasar()
const columns = [
{
    name: 'compartiment',
    label: 'Compartiment',
    field: 'compartiment',
    align: 'left',
    sortable: true
  },
  {
    name: 'numar',
    label: 'Număr',
    field: 'numar',
    align: 'left',
    sortable: true
  },
  {
    name: 'dataord',
    label: 'Data',
    field: 'dataord',
    align: 'left',
    sortable: true
  },
  {
    name: 'furnizor',
    label: 'Furnizor',
    field: 'furnizor_denumire',
    align: 'left',
    sortable: true
  },
  {
    name: 'valoare',
    label: 'Valoare',
    field: 'valoare',
    align: 'right',
    sortable: true
  },
  {
    name: 'sursa',
    label: 'Sursa finantare',
    field:(row)=> row.primareceptie.angajament.categorie?.sursa.scurt,
    align: 'left',
    sortable: true
  },
  {
    name: 'artbug',
    label: 'Art. bug.',
    field:(row)=> row.primareceptie.angajament.categorie?.articol.cod,
    align: 'left',
    sortable: true
  },
  {
    name: 'vizaCFPP',
    label: 'Viză CFPP',
    field: 'vizaCFPP',
    align: 'center',
    sortable: true
  }

]

// State
const ordonantari = ref([])
const loading = ref(false)
const selected = ref([])
const selectedRow = computed(() => selected.value[0])
const selectatSiNevizat = computed(()=>{
  return selected.value[0]&&selected.value[0].vizaCFPP==0
})
const showVizaDialog = ref(false)
// Fetch data
async function toateOrdonantarile() {
  loading.value = true
  try {
   
    ordonantari.value = await fetchOrdonantari()
    console.log(ordonantari.value)
  } catch (error) {
    console.error('Error fetching ordonantari:', error)
  } finally {
    loading.value = false
  }
}

// Utility functions
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ro-RO')
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Action handlers
function handleVizaCFPP() {
  if (!selectedRow.value) return
  // Implement CFPP visa logic here
  showVizaDialog.value=true
  console.log('Applying CFPP visa for:', selectedRow.value)
}

function handlePrint() {
  if (!selectedRow.value) return
  // Implement print logic here
  console.log('Printing:', selectedRow.value)
}

const vizeaza = async ()=>{
  const userStore = useUtilizatorStore()
  const nrviza= await vizaUrmatoare()
  const dateviza:CreateVizaCFPPDTO ={
  document:'Ordonantare plata nr. '+selectedRow.value!.numar,
  explicatii:selectedRow.value!.primareceptie.angajament.descriere,
  compartiment : selectedRow.value!.compartiment! ,
  valoare:selectedRow.value.valoare,
  dataviza:new Date(),
  nume:userStore.utilizator.first_name+' '+userStore.utilizator.last_name,
  userid:userStore.utilizator.id,
  nrviza:nrviza as string,
  nrvizac:userStore.utilizator.first_name.substr(0,1)+userStore.utilizator.last_name.substr(0,1)+'-'+nrviza
  }

  try {
    const viza = await createVizaCFPP(dateviza)
   
    showVizaDialog.value=false
    $q.notify({
      color: 'positive',
      message: 'Viza CFPP a fost aplicata cu succes!',
    })
  } catch (e){
    console.error(e)
  }

}
// Lifecycle
onMounted(() => {
  toateOrdonantarile()
})
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Header with buttons -->
      <div class="row q-mb-md justify-between items-center">
        <div class="text-h6">Ordonanțări de Plată</div>
        <div>
          <q-btn
            color="primary"
            icon="check_circle"
            label="Viză CFPP"
            :disable="!selectatSiNevizat"
            class="q-mr-sm"
            @click="handleVizaCFPP"
          />
          <q-btn
            color="secondary"
            icon="print"
            label="Print"
            :disable="!selectedRow"
            @click="handlePrint"
          />
        </div>
      </div>

      <!-- Table -->
      <q-table
        :rows="ordonantari"
        :columns="columns"
        row-key="id"
        selection="single"
        v-model:selected="selected"
        :loading="loading"
        :pagination="{ rowsPerPage: 20 }"
      >
        <!-- Custom column formatters -->
        <template v-slot:body-cell-dataord="props">
          <q-td :props="props">
            {{ formatDate(props.row.dataord) }}
          </q-td>
        </template>

        <template v-slot:body-cell-valoare="props">
          <q-td :props="props">
            {{ formatAmount(props.row.valoare) }}
          </q-td>
        </template>

        <template v-slot:body-cell-furnizor="props">
          <q-td :props="props">
            {{ props.row.furnizor_denumire }}
          </q-td>
        </template>
        <template v-slot:body-cell-vizaCFPP="props">
          <q-td :props="props">
            <q-checkbox
              :model-value="props.row.vizaCFPP==0?false:true"
           
       
            />
          </q-td>
        </template>
        <!-- Expand slot for showing receptii details -->
        <template v-slot:body-cell-receptii="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="props.expand = !props.expand"
            />
          </q-td>
        </template>

      </q-table>
    </div>

    <q-dialog v-model="showVizaDialog">
          <q-card style="min-width: 800px">
            <q-card-section>
              <div class="text-h6">Viza CFPP</div>
            </q-card-section>

           

            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn flat label="Vizeaza CFPP!" color="primary"  @click="vizeaza"/>
              <q-btn flat label="Închide" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.q-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%);
}
</style>