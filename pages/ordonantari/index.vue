<script setup lang="ts">
import { useQuasar ,date} from 'quasar'
import { useOrdonantari } from "~/composables/useOrdonantari";
import { useFacturiPrimite } from "~/composables/useFacturiPrimite";
import { useUtilizatorStore } from '~/stores/useUtilizatorStore'
import { useNomenclatoareStore } from '~/stores/useNomenclatoareStore';
import {useVizaCFPP} from '~/composables/useVizaCFPP'
import type { CreateVizaCFPPDTO } from "~/types/vizecfpp"
import type { FacturaPrimitaDTO } from "~/types/facturiprimite"
const {fetchOrdonantari} = useOrdonantari()
const {vizaUrmatoare,createVizaCFPP,aplicaVizaCFPPOrdonantare} = useVizaCFPP()
const {createFacturaPrimita} = useFacturiPrimite()
const $q = useQuasar()
const filter = ref('')
const userStore = useUtilizatorStore()
const nomenclatoareStore=useNomenclatoareStore()
const furnizoriOptions = ref(userStore.utilizator.role=='CFPP'?await $fetch('/api/info/totifurnizorii'):nomenclatoareStore.baza.furnizori_index.map(f=>({label:f.denumire,value:f.id})))
const columns = [
{
    name: 'compartiment',
    label: 'Compartiment',
    field: 'compartiment',
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'list',
      options:userStore.utilizator.role=='RESPONSABIL'?[{value:userStore.utilizator.compartiment.id,label:userStore.utilizator.compartiment.denumire}] :await $fetch('/api/info/compartimente') 
    }
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
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'interval'
    }
  },
  {
    name: 'furnizor',
    label: 'Furnizor',
    field: 'furnizor_denumire',
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'list',
      options:furnizoriOptions.value
    }
  },
  {
    name: 'valoare',
    label: 'Valoare',
    field: 'valoare',
    align: 'right',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'numericvalue'
    }
  },
  {
    name: 'sursa',
    label: 'Sursa finantare',
    field:(row)=> row.primareceptie.angajament.categorie?.sursa.scurt,
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/surse')
    }
  },
  {
    name: 'artbug',
    label: 'Art. bug.',
    field:(row)=> row.primareceptie.angajament.categorie?.articol.cod,
    align: 'left',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/articole')
    }
  },
  {
    name: 'vizaCFPP',
    label: 'Viză CFPP',
    field: 'vizaCFPP',
    align: 'center',
    sortable: true,
    filterOptions:{
      enabled:true,
      type:'check'
    }
  }

]

// State
const ordonantari = ref([])
const strnrviza = ref('')
const loading = ref(false)
const selected = ref([])
//const route = useRoute()
const router = useRouter()

const openInNewTab = (path:string) => {
  const url = router.resolve(path).href
  window.open(url, '_blank')
}
const filterDefaults:Record<string,any> = {
  'compartiment':userStore.utilizator.role=='RESPONSABIL'?[{value:userStore.utilizator.compartiment.id,label:userStore.utilizator.compartiment.denumire}] :null,
  'vizaCFPP':false,
  'artbug':null,
  'furnizor':null,
  'sursa':null,
  'dataord':{ from: date.formatDate(new Date(new Date().getFullYear(), 0, 1), 'YYYY/MM/DD'), to: date.formatDate(new Date(),'YYYY/MM/DD') },
  'valoare':{ operator:  { label: '>', value: 'gt' }, value: 0 }
}

const handleFilters = async (filters: Record<string, any>) => {
  console.log('filters',filters)
  try {
   // await fetchAngajamente(2024,filters)
   ordonantari.value = await fetchOrdonantari(filters)
  } catch (e){
    console.error(e)
  }
}
const selectedRow = computed(() => selected.value[0])
const selectatSiNevizat = computed(()=>{
  return selected.value[0]&&selected.value[0].vizaCFPP==0
})
const showVizaDialog = ref(false)
// Fetch data
async function toateOrdonantarile() {
  loading.value = true
  try {
   
    ordonantari.value = await fetchOrdonantari(filterDefaults)
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
  strnrviza.value=''


  //console.log('Applying CFPP visa for:', selectedRow.value,fp)
}

function handlePrint() {
  if (!selectedRow.value) return
  // Implement print logic here
  console.log('Printing:', selectedRow.value)
  openInNewTab('/rapoarte/ordonantari/'+selectedRow.value.id)
}
//console.log('Ordonantari',userStore.utilizator.role)

const vizeaza = async ()=>{

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

  let newDate = new Date(selectedRow.value.primareceptie.datafact);
  newDate.setDate(newDate.getDate() + 60);
  const fp:FacturaPrimitaDTO = {
    idFurnizor: Number(selectedRow.value.idFurnizor),
    numarFactura: selectedRow.value.primareceptie.nrfact,
    dataFactura: new Date(selectedRow.value.primareceptie.datafact),
    valoare: Number(selectedRow.value.valoare),
    detaliiFactura: selectedRow.value.primareceptie.angajament.descriere,
    idArticolBugetar: selectedRow.value.primareceptie.angajament.categorie.articol.id,
    idSursaFinantare: selectedRow.value.primareceptie.angajament.categorie.sursa.id,
    idOrdonantare:  selectedRow.value.id,
    idReceptie: selectedRow.value.primareceptie.id,
    idCompartiment: selectedRow.value.idCompartiment,

    termenPlata: newDate,

    stare: 'activ'
  }


  try {
    const viza = await createVizaCFPP(dateviza)
    strnrviza.value=dateviza.nrvizac
    await aplicaVizaCFPPOrdonantare(selectedRow.value.id,dateviza)
    
    const facturaprimita = await createFacturaPrimita(fp)
     console.log('Viza',viza,facturaprimita)
   // showVizaDialog.value=false
    selected.value=[]
    toateOrdonantarile()
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
        <table-filter
              :columns="columns"
              :defaults="filterDefaults"
              @filtersadded="handleFilters"
            />
        <div>
          <q-space />
          <div class="row">
            <q-input  dense debounce="300" v-model="filter" placeholder="Cauta..." class="q-mr-md">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
           </q-input>
          <q-btn
           v-show="userStore.utilizator.role=='CFPP'"
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
      </div>

      <!-- Table -->
      <q-table
        :rows="ordonantari"
        :columns="columns"
        row-key="id"
        selection="single"
        :filter="filter"
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

    <q-dialog v-model="showVizaDialog" persistent>
          <q-card style="min-width: 900px">
            <q-card-section>
              <div class="text-h6">Viza CFPP</div>
            </q-card-section>
            <q-card-section v-if="strnrviza!==''">
              <div class="text-h6">{{ strnrviza }}</div>
            </q-card-section>
           <q-card-section v-if="strnrviza==''">
            <q-list bordered>
                <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="Receptii"
                  default-opened
                  header-class="text-primary"
                >
                  <q-card>
                    <q-card-section>
                      <ordonantare-receptie :receptii="selectedRow.receptii" :furnizor="selectedRow.furnizor_denumire"/>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <q-separator />

                <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="Angajament"
                  header-class="text-primary"
                >
                  <q-card>
                    <q-card-section>
                       <ordonantare-angajament :receptii="selectedRow.receptii"/>     
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <q-separator />

                <q-expansion-item
                  group="somegroup"
                  icon="explore"
                  label="Ordonantare de plata"
                  header-class="text-primary"
                >
                  <div class="q-pa-md row items-start q-gutter-md">
                    <q-card class="my-card">
                      <q-card-section>
                        <div class="text-subtitle1">{{ selectedRow.compartiment }}</div>
                        <div class="text-subtitle1">{{ selectedRow.numar }}</div>
                        <div class="text-subtitle1">{{ formatDate(selectedRow.dataord )}}</div>
                        <div class="text-subtitle1">{{ selectedRow.valoare }} lei.</div>
                      </q-card-section>
                  </q-card>
                        
                  <q-card class="my-card">
                      <q-card-section>
                        <div class="text-subtitle1">{{ selectedRow.furnizor_denumire }}</div>
                        <div class="text-subtitle1">{{ selectedRow.furnizor_codfiscal }}</div>
                        <div class="text-subtitle1">{{ selectedRow.furnizor_adresa }}</div>
                        <div class="text-subtitle1">{{ selectedRow.furnizor_iban }} </div>
                      </q-card-section>
                  </q-card>

                  <q-card class="my-card-long">
                      <q-card-section>
                        <div class="text-subtitle1 row justify-between items-center">
                          <span>Clasific.:</span>
                          <span class="text-right">{{ selectedRow.primareceptie.angajament.categorie?.sursa.cod+' '+selectedRow.primareceptie.angajament.categorie?.articol.cod  }}</span>
                        </div>

                        <div class="text-subtitle1 row justify-between items-center">
                          <span>Disponibil înainte:</span>
                          <span class="text-right">{{ parseFloat(selectedRow.total_modificari)-parseFloat(selectedRow.total_receptii_ordonantate) }}</span>
                        </div>
                        <div class="text-subtitle1 row justify-between items-center">
                          <span>Suma de plata:</span>
                          <span class="text-right">{{ selectedRow.valoare }}</span>
                        </div>

                        <div class="text-subtitle1 row justify-between items-center">
                          <span>Disponibil după:</span>
                          <span class="text-right">{{  parseFloat(selectedRow.total_modificari)-parseFloat(selectedRow.total_receptii_ordonantate)-parseFloat(selectedRow.valoare) }}</span>
                        </div>
                      </q-card-section>
                  </q-card>
                  </div>

                </q-expansion-item>

                
              </q-list>
           </q-card-section>

            <q-card-actions class="row justify-between q-gutter-sm">
              <q-btn v-if="strnrviza==''" flat label="Vizeaza CFPP!" color="primary"  @click="vizeaza"/>
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
.my-card{
  width: 100%;
  max-width: 250px;
}
.my-card-long{
  width: 100%;
  max-width: 270px;
}
</style>