<template>
    <div class="q-pa-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Lichidari/receptii</div>
        </q-card-section>
  
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab v-if="utilizatorStore.utilizator?.role=='RESPONSABIL'" name="adauga" label="ADAUGA" />
          <q-tab v-if="utilizatorStore.utilizator?.role=='RESPONSABIL'" name="receptii" label="TOATE.." />
          <q-tab v-if="utilizatorStore.utilizator?.role!=='RESPONSABIL'" name="interzis" label="" />
        </q-tabs>
  
        <q-separator />
  
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel  name="adauga">
            <q-table
              :rows="angajamente_receptii"
              :columns="ang_columns"
              row-key="id"
              v-model:expanded="expanded"
              :pagination="pagination"
              
            >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn size="lg" color="accent" round dense @click="props.expand = !props.expand;expansion()" :icon="props.expand ? 'remove' : 'add'" />
                </q-td>
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  {{ col.value }}
                </q-td>
              </q-tr>
              <q-tr v-if="props.expand" :props="props">
                <q-td colspan="100%">
                  <!-- <div class="text-left">This is expand slot for row above: {{ props.row }}.</div> -->
                  <receptie-noua :id-comp="utilizatorStore.utilizator?.compartiment.id" :id-ang="props.row.id" :totalreceptii="props.row.totalreceptii" :sumadisponibila="props.row.suma_disponibila" :data-ang="new Date(props.row.data)" @adaugreceptienoua="onReceptieNoua" @adaugreceptiesiordonantare="onReceptieSiOrdonantareNoua"/>
                  <receptie-istoric :receptii="props.row.receptii"/>
                </q-td>
              </q-tr>
            </template>
            </q-table>
            <!-- <receptie-noua /> -->
          </q-tab-panel>
  
          <q-tab-panel  name="receptii">
            <receptie-lista :id-compartiment="utilizatorStore.utilizator?.compartiment.id"/>
            <!-- <div class="text-h6">Lista Receptii si Lichidari</div>
           
            <q-table
              :rows="receptii"
              :columns="columns"
              row-key="id"
              :loading="loading"
              :pagination="pagination"
              @request="onRequest"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-group flat>
                    <q-btn flat round color="primary" icon="edit"  />
                    <q-btn flat round color="negative" icon="delete"  />
                  </q-btn-group>
                </q-td>
              </template>
            </q-table> -->
          </q-tab-panel>
  
          <q-tab-panel   name="interzis">
            <q-banner inline-actions class="text-white bg-red">
               <div class="text-h6">Doar utilizatorii cu rol de RESPONSABIL pentru compartimente de specialitate pot accesa aceasta sectiune!</div> 
      
            </q-banner>
          
            <!-- Content for interzis tab -->
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { TableColumn,Receptie } from "~/types/receptii"
  import { useUtilizatorStore } from '~/stores/useUtilizatorStore'
  import { useReceptii } from "~/composables/useReceptii"; 
  import { useOrdonantari } from "~/composables/useOrdonantari";
  import { useQuasar } from "quasar";
  const loading = ref(false)
  
  //const angajamenteOptions = ref([])
  const $q = useQuasar()
  const utilizatorStore = useUtilizatorStore()
  const {receptii,fetchReceptiiAngajamente,createReceptie} = useReceptii()
  const {createOrdonantare} = useOrdonantari()
  const activeTab = ref(utilizatorStore.utilizator?.role=='RESPONSABIL'?'adauga':'interzis')
  const angajamente_disponibile=utilizatorStore.utilizator?.role=='RESPONSABIL'? await fetchReceptiiAngajamente(utilizatorStore.utilizator?.compartiment.id):[]
  const angajamente_receptii = ref(angajamente_disponibile)
  //const toate_receptiile = await fetchReceptions(utilizatorStore.utilizator?.compartiment.id)
  //console.log('Toate receptiile',toate_receptiile)
  const expanded=ref([])
  const router = useRouter()
  const openInNewTab = (path:string) => {
  const url = router.resolve(path).href
  window.open(url, '_blank')
}
  const pagination = ref({
    sortBy: 'datafact',
    descending: true,
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 0
  })
  function expansion(){
   // console.log('Expansion',expanded.value)
    if(expanded.value.length==2) expanded.value.shift()
  }
  const columns: TableColumn[] = [
    { name: 'id', label: 'ID', field: 'id', sortable: true },
    { name: 'angajament', label: 'Angajament', field: 'idAngajament', sortable: true },
    { name: 'furnizor', label: 'Furnizor', field: 'idFurnizor', sortable: true },
    { name: 'datafact', label: 'Data Factura', field: 'datafact', sortable: true },
    { name: 'valoare', label: 'Valoare', field: 'valoare', sortable: true },
    { name: 'stare', label: 'Stare', field: 'stare', sortable: true },
    { name: 'actions', label: 'Actiuni', field: 'actions', align: 'center' }
  ]
  
  const ang_columns = [

  {
    name: 'numar',
    label: 'Număr',
    field: 'numar',
    align: 'left'
  },
  {
    name: 'data',
    label: 'Data',
    field: 'data',
    format: (val: string) => new Date(val).toLocaleDateString(),
    align: 'left'
  },
  {
    name: 'sursafinantare',
    label: 'Sursa fin.',
    field: (row) => row.categorie?.sursaFinantare?.scurt,
    align: 'left',
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/surse')
    }
  },
  {
    name: 'artbug',
    label: 'Art. bug.',
    field: (row) => row.categorie?.articolBugetar.cod,
    align: 'center'
  },

  {
    name: 'descriere',
    label: 'Descriere',
    field: 'descriere',
    align: 'left'
  },
  {
    name: 'totalsuma',
    label: 'Suma Totală',
    field: 'totalsuma',
    align: 'right'


  },
  {
    name: 'sumareceptii',
    label: 'Suma Receptii',
    field: 'totalreceptii',
    align: 'right'


  },
  {
    name: 'sumadisponibila',
    label: 'Suma Disponibila',
    field: 'suma_disponibila',
    align: 'right'


  }
]
  
const onReceptieNoua = async (dateReceptie:Receptie)=>{
  dateReceptie.idFurnizor=dateReceptie.idFurnizor.value
  try {
    const r = await createReceptie(dateReceptie)
 // console.log('receptie noua ....!!',r)
    $q.notify({
      color: 'positive',
      message: 'Lichidarea/receptia a fost adaugata cu succes!',
    })

    angajamente_receptii.value.map(a=>{
      if(a.id===r.idAngajament){
        a.totalreceptii+=parseFloat(r.valoare)
        a.suma_disponibila = a.totalsuma - a.totalreceptii
      }
    })
    expanded.value=[]
  } catch {
    console.error('Error onReceptieNoua')
  }

}

const onReceptieSiOrdonantareNoua = async (dateReceptie:Receptie) =>{

  dateReceptie.idFurnizor=dateReceptie.idFurnizor.value
  try {
    const r = await createReceptie(dateReceptie)

    const OrdPayload= {
      idFurnizor: dateReceptie.idFurnizor,
      receptii: [r.id],
      valoare: parseFloat(r.valoare),
      explicatii: ''
    }
 
    const ordonantare= await createOrdonantare(OrdPayload)

   // console.log('receptie si ordonantare noua ....!!',ordonantare)
    openInNewTab('/rapoarte/ordonantari/'+ordonantare.data.id)
    $q.notify({
      color: 'positive',
      message: 'Lichidarea/receptia si Ordonantarea de Plata au fost adaugate cu succes!',
    })

    angajamente_receptii.value.map(a=>{
      if(a.id===r.idAngajament){
        a.totalreceptii+=parseFloat(r.valoare)
        a.suma_disponibila = a.totalsuma - a.totalreceptii
      }
    })
    expanded.value=[]
  } catch {
    console.error('Error onReceptieNoua')
  }

}
  

  
  // Lifecycle hooks
  onMounted(async () => {
    try {
      loading.value = true
      // Add API calls to fetch initial data
      // Fetch angajamente options
      // Fetch furnizori options
      // Fetch initial receptii
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .my-card {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  </style>