<template>
    <div class="q-pa-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6 row items-center justify-between">
            <div class="row q-gutter-sm">
              <span>Plata facturi</span>
              <facturi-plati-filter
              :columns="columns"
              :defaults="filterDefaults"
              @filtersadded="handleFilters"
            />
          </div>
            <div class="row justify-center q-pa-sm">
              <q-btn
                  :icon="isExpanded ? 'unfold_less' : 'unfold_more'"
                  flat
                  dense
                  color="primary"
                  @click="toggleAllGroups"
                  :label="isExpanded ? 'Colapseaza Tot' : 'Extinde Tot'"
                />
            </div>
     
            <div class="row q-gutter-sm">
              <q-btn 
              :disable="!canGroupForPayment"
                color="primary" 
                label="Plata" 
                @click="handleFirstAction"
              />
              <!-- <q-btn 
                color="secondary" 
                label="Tiparire" 
                @click="handleSecondAction"
              /> -->
              <q-btn-dropdown   label="Lista facturi" color="primary" square icon="printer" class="q-mr-sm" style="min-width: 300px">
                <div class="q-pa-md" >
                  <div class="text-h6 q-mb-md">
                    <q-checkbox v-model="subtotaluri" label="Doar antet si subtotaluri" />
                  </div>
                    <q-btn
                      v-close-popup
                      color="primary"
                      icon="printer"
                      label="Print"
                      style="min-width: 200px;"
                      @click="handleSecondAction"
                    />
                  </div>
            </q-btn-dropdown>
            </div>
          </div>
        </q-card-section>
        <q-table
          dense
          style="height: 1000px"
          flat 
          bordered
          separator="cell"
          :rows="processedRows"
           :row-class="row => row.paid ? 'paid-invoice' : ''"
          :columns="columns"
          row-key="id"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          selection="multiple"
          v-model:selected="selectedRows"
        >
          <!-- Custom header -->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width>
                <q-checkbox 
                  v-model="props.selected" 
                  :disable="!hasSelectableRows"
                  @update:model-value="toggleAllRows"
                />
              </q-th>
              <q-th v-for="col in props.cols" :key="col.name">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
      
          <!-- Custom row rendering -->
          <template v-slot:body="props">
            <!-- Group Header Row -->
            <template v-if="props.row.type === 'header'">
              <q-tr :props="props" class="bg-grey-2">
                <q-td auto-width>
                    <div>*</div>
                </q-td>
                <q-td  class="flex items-center text-weight-bold">
                  <q-btn
                    :icon="expandedGroups[props.row.furnizor] ? 'remove' : 'add'"
                    flat
                    round
                    dense
                    size="sm"
                    @click="toggleGroup(props.row.furnizor)"
                  />
                  {{ props.row.furnizor.charAt(0).toUpperCase() + props.row.furnizor.slice(1) }}
                  ({{ filterByFurnizor(props.row.furnizor).length }}) Subtotal: {{ formatAmount(calculateValoareTotalaFurnizor(props.row.furnizor).toFixed(2)) }} lei
                </q-td>
              </q-tr>
            </template>
      
            <!-- Regular Data Row -->
            <template v-if="props.row.type === 'data'">
              <q-tr :class="{ 'paid-invoice': props.row.paid }" v-if="expandedGroups[props.row.artbug]" :props="props">
                <q-td auto-width>
                  <q-checkbox 
                    v-model="props.selected" 
                    :disable="props.row.type !== 'data'"
                  />
                </q-td>
                <q-td key="numefurnizor">{{ props.row.numefurnizor }}</q-td>
                <q-td key="nrfact">{{ props.row.nrfact }}</q-td>
                <q-td  class="text-centrat" key="datafact">{{ props.row.datafact }}</q-td>
                <q-td class="text-right" key="valoare">{{ formatAmount(props.row.valoare) }}</q-td>
                <q-td class="text-right" key="ramasplata">{{ formatAmount(props.row.ramasplata) }}</q-td>
                <q-td key="expl">{{ props.row.explicatii }}</q-td>
                <q-td key="sursafin">{{ props.row.sursafin }}</q-td>
                <q-td class="text-centrat" key="artbug">{{ props.row.artbug }}</q-td>
                <q-td class="text-centrat" key="plata">{{ props.row.plata }}</q-td>
              </q-tr>
            </template>
      
            <!-- Summary Row -->
            <template v-if="props.row.type === 'summary'">
              <q-tr v-if="expandedGroups[props.row.furnizor]" class="bg-grey-1">
             
                <q-td colspan="4" class="text-right">
                  <strong>Total:</strong>
                </q-td>
                <q-td class="text-right">
                  {{ formatAmount(calculateValoareTotalaFurnizor(props.row.furnizor).toFixed(2)) }}
                </q-td>
                <q-td class="text-right">
                  {{ formatAmount(calculateRamasPlataTotalFurnizor(props.row.furnizor).toFixed(2)) }}
                </q-td>
              </q-tr>
            </template>
            <template v-if="props.row.type === 'total'">
              <q-tr  class="bg-grey-1">
                <q-td colspan="4" class="text-right">
                  <strong>Total general:</strong>
                </q-td>
                <q-td class="text-right">
                  {{ formatAmount(props.row.total) }}
                </q-td>
                <q-td class="text-right">
                  {{ formatAmount(calculateTotalRamasPLata()) }}
                </q-td>
              </q-tr>
            </template>
              <!-- Bottom Slot for Summary Row -->

          </template>
        </q-table>
      </q-card>

      <q-dialog v-model="showPlataDialog" >
         <plata 
           @plati-montat="handleMounted"
           @plata-efectuata="handlePlataEfectuata"
           :facturi="selectedRows"
         />
    </q-dialog>
    </div>
  </template>
  
  <script setup>
import { useQuasar,date} from 'quasar'
import {useFacturiPrimite} from '~/composables/useFacturiPrimite'
  const pagination = ref({
    rowsPerPage: 0
  })
const $q = useQuasar()
const router = useRouter()
const subtotaluri = ref(false)
const {toateFacturilePrimite} = useFacturiPrimite()
function formatDate(date) {
  return new Date(date).toLocaleDateString('ro-RO')
}
function formatAmount(amount) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const openInNewTab = (path) => {
  const url = router.resolve(path).href
  window.open(url, '_blank')
}
  // Add unique identifier to original rows
  const originalRows = ref([
   
  ])
  
  const columns = [
    { 
      name: 'numefurnizor', 
      required: true, 
      label: 'Furnizor', 
      printable: true,
      align: 'left', 
      field: 'numefurnizor',
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/totifurnizorii')
    } 
    },
    { 
      name: 'nrfact', 
      label: 'Nr. fact.', 
      printable: true,
      field: 'nrfact' ,
      align:'left'
    },
    { 
      name: 'datafact', 
      label: 'Data fact.', 
      printable: true,
      field: 'dataFactura' ,
      align:'center',
      filterOptions:{
        enabled:true,
        type:'interval'
      }
    },{
      name:'valoare',
      label:'Valoare',
      printable: true,
      field:'valoare',
      align:'right',
    filterOptions:{
      enabled:true,
      type:'numericvalue'
    }
    },{
      name:'ramasplata',
      label:'Ramas de plata',
      printable: false,
      field:'ramasplata',
      align:'right',
    filterOptions:{
      enabled:true,
      type:'checkif'
    }
    },
    
    { 
      name: 'explicatii', 
      label: 'Expl.', 
      field: 'explicatii' ,
      align:'left'
    },
    { 
      name: 'sursafin', 
      label: 'Sursa fin.', 
      printable: true,
      field: 'sursafin' ,
      align:'left',
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/surse')
    }
    },
    { 
      name: 'artbug', 
      label: 'Art. bug.', 
      printable: false,
      field: 'artbug' ,
      align:'center',
    filterOptions:{
      enabled:true,
      type:'list',
      options:await $fetch('/api/info/articole')
    }
    },
    { 
      name: 'plata', 
      label: 'Plata', 
      printable: false,
      field: 'plata' ,
      align:'center'

    }
  ]

  // Initialize expandedGroups with all groups closed
  const expandedGroups = ref({

  })
  const showPlataDialog=ref(false)
  const processedRows  = ref([])
  let categorii = []
  const prelucrareFacturi = async (filtre)=>{
    const facturi = await toateFacturilePrimite(true,filtre)//await $fetch('/api/facturiprimite?sortby=articolbugetar')
    categorii=[]
    originalRows.value=[]

    facturi.map(factura=>{
      if(!categorii.includes(factura.articolBugetar.cod)) categorii.push(factura.articolBugetar.cod)
      originalRows.value.push({
          id:factura.id,
          numefurnizor:factura.furnizor.denumire,
          nrfact:factura.numarFactura,
          datafact:formatDate(factura.dataFactura),
          valoare:factura.valoare,
          ramasplata:factura.ramasplata,
          sursafin:factura.sursaFinantare.denumire,
          artbug:factura.articolBugetar.cod,
          codfiscalfurnizor:factura.furnizor.codfiscal,
          ibanfurnizor:factura.furnizor.iban,
          ibanplatitor:factura.articolBugetar.iban,
          explicatii:factura.receptie.mentiuni,
          indicator:factura.receptie.angajament.modificari.filter(modificare=>modificare.motiv==='Creare angajament')[0].indicator,
          codang:factura.receptie.angajament.modificari.filter(modificare=>modificare.motiv==='Creare angajament')[0].codang,
          plata:factura.statusPlata==='PLATITA'?`O.P. ${factura.plati[0].plata.numarop} / ${formatDate(factura.plati[0].plata.dataop)}`:'NEPLATITA'
      })
    })
    expandedGroups.value=categorii.reduce((acc, key) => {
          acc[key] = true; // Set the value to true for each key
          return acc; // Return the accumulator for the next iteration
      }, {});


    console.log('Info',facturi,categorii,originalRows.value,expandedGroups.value)
  } 

 
  const filterDefaults = {
 // 'compartiment':userStore.utilizator.role=='RESPONSABIL'?[{value:userStore.utilizator.compartiment.id,label:userStore.utilizator.compartiment.denumire}] :null,
  'ramasplata':false,  //psihologie inversa
  'artbug':null,
  'numefurnizor':null,
  'sursafin':null,
  'neachitateLaData':date.formatDate(new Date(),'YYYY/MM/DD') ,
  'datafact':{ from: date.formatDate(new Date(new Date().getFullYear(), 0, 1), 'YYYY/MM/DD'), to: date.formatDate(new Date(),'YYYY/MM/DD') },
  'valoare':{ operator:  { label: '>', value: 'gt' }, value: -9999999 }
}

const isExpanded = computed(() => {
  return Object.values(expandedGroups.value || {})[0] || false
})

const toggleAllGroups = () => {
  const newState = !isExpanded.value
  categorii.forEach(category => {
    expandedGroups.value = expandedGroups.value || {}
    expandedGroups.value[category] = newState
  })
}
const ultimeleFiltre = ref(filterDefaults) 
const handleFilters = async (filters) => {
  console.log('filters',filters)
  ultimeleFiltre.value=filters
  try {
    processedRows.value=[]
    await prelucrareFacturi(filters)
    processedRows.value=processRows()
   // await fetchAngajamente(2024,filters)
 //  ordonantari.value = await fetchOrdonantari(filters)
  } catch (e){
    console.error(e)
  }
}
  
  // Selected rows
  const selectedRows = ref([])
  
  // Computed property to check if there are selectable rows
  const hasSelectableRows = computed(() => {
    return processedRows.value.some(row => row.type === 'data')
  })
  
  // Processed rows include group headers, data rows, and summary rows

  const processRows= () => {
   
    let rows = []
    
    // Iterate through each gender

    categorii.forEach(furnizor => {
      // Add group header row
      rows.push({
        type: 'header',
        furnizor: furnizor
      })
  
      // Add data rows if group is expanded
      if (expandedGroups.value[furnizor]) {
        // Add individual person rows
        const furnizorRows = filterByFurnizor(furnizor)
        rows.push(...furnizorRows.map(row => ({
          ...row,
          type: 'data'
        })))
        
        // Add summary row
        rows.push({
          type: 'summary',
          furnizor: furnizor
        })
      }
    })
    rows.push({
          type: 'total',
          total: calculateTotalValoare()
        })
    return rows
  }
  
  const filterByFurnizor = (furnizor) => {
    return originalRows.value.filter(factura => factura.artbug === furnizor)
  }
  
  const calculateTotalValoare = ()=>{
    return originalRows.value.reduce((sum,factura)=> sum + parseFloat(factura.valoare),0)
  }

  const calculateTotalRamasPLata = ()=>{
    return originalRows.value.reduce((sum,factura)=> sum + parseFloat(factura.ramasplata),0)
  }

  const calculateValoareTotalaFurnizor = (furnizor) => {
    const groupRows = filterByFurnizor(furnizor)
    //console.log('groupRows',groupRows,furnizor)
    if (groupRows.length === 0) return 0
    
    const total = groupRows.reduce((sum, factura) => sum + parseFloat(factura.valoare), 0)
    return total
  }
  
  const calculateRamasPlataTotalFurnizor = (furnizor) => {
    const groupRows = filterByFurnizor(furnizor)
    //console.log('groupRows',groupRows,furnizor)
    if (groupRows.length === 0) return 0
    
    const total = groupRows.reduce((sum, factura) => sum + parseFloat(factura.ramasplata), 0)
    return total
  }

  const toggleGroup = (furnizor) => {
    expandedGroups.value[furnizor] = !expandedGroups.value[furnizor]
  }
  
  // Toggle all rows selection
  const toggleAllRows = (selected) => {
    selectedRows.value = selected 
      ? processedRows.value.filter(row => row.type === 'data') 
      : []
  }
  
  const canGroupForPayment = computed(() => {
    if (!selectedRows.value.length) return false
    
    const firstRow = selectedRows.value[0]
    const totaldeplata = selectedRows.value.reduce((sum, factura) => sum + parseFloat(factura.ramasplata), 0)
    return selectedRows.value.every(row => 
      row.artbug === firstRow.artbug && 
      row.numefurnizor === firstRow.numefurnizor &&
      !row.paid
    ) && totaldeplata>0
  })
  // Action handlers for new buttons
  const handleFirstAction = () => {
    console.log('First Action clicked')
  //  console.log('Selected Rows:',  selectedRows.value[0])
    showPlataDialog.value=true;
   //selectedRows.value=[]
  }
  
  const handleSecondAction = () => {
    console.log('Tiparire AB')
    const reportsData = {
      titlu:'Situatie facturi',
      format:'A4',
      orientation:'landscape',
      subtotaluri:true,
      columns:columns.filter(c=>c.printable).map(c=>({title:c.label,dataKey:c.name})),
      sortby:['artbug','numefurnizor'],
      groupby:'artbug',
      subtotal:'suma',
      doarsubtotaluri:subtotaluri.value,
      data:originalRows.value
    } // Your array of objects
    // Save to localStorage with a unique key
    localStorage.setItem('tempReports', JSON.stringify(reportsData))
    openInNewTab('/rapoarte/listafacturiplati')
  }


  const handleMounted = () => {
    console.log('Plati montat')
   // showPlataDialog.value=false
    selectedRows.value=[]

  }
  const handlePlataEfectuata = async (result) => {
    console.log('Plata efectuata:', result)
    if(result.success){
      console.log('Plata efectuata cu succes')
    $q.notify({
      color: 'positive',
      message: result.message
    })
    showPlataDialog.value=false

    /*result.facturi.map(f=>{
      const index = processedRows.value.findIndex(obj => obj.id === f.id);
      if (index !== -1) {
        processedRows.value.splice(index, 1);
      }
    })
*/
    result.facturi.forEach(f => {
      const index = processedRows.value.findIndex(obj => obj.id === f.id);
      if (index !== -1) {
        processedRows.value[index].paid = true;
      }
    })


    }
   // selectedRows.value=[]
  }

 onMounted(async ()=>{
  await prelucrareFacturi(filterDefaults)
  processedRows.value=processRows()
  //console.log('processed rows',processedRows.value)
 })


  </script>
  
  <style scoped>
  .flex {
    display: flex;
    align-items: center;
  }
  
  .text-right {
    text-align: right;
  }
  .text-centrat {
    text-align: center;
  }
  .my-card {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  .paid-invoice {
  text-decoration: line-through;
  opacity: 0.6;
}
  </style>