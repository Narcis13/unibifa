<template>
    <div class="q-pa-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6 row items-center justify-between">
            <span>Plata facturi</span>
            <div class="row q-gutter-sm">
              <q-btn 
                color="primary" 
                label="First Action" 
                @click="handleFirstAction"
              />
              <q-btn 
                color="secondary" 
                label="Second Action" 
                @click="handleSecondAction"
              />
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
                  ({{ filterByFurnizor(props.row.furnizor).length }})
                </q-td>
              </q-tr>
            </template>
      
            <!-- Regular Data Row -->
            <template v-if="props.row.type === 'data'">
              <q-tr v-if="expandedGroups[props.row.numefurnizor]" :props="props">
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
                <q-td key="sursafin">{{ props.row.sursafin }}</q-td>
                <q-td class="text-centrat" key="artbug">{{ props.row.artbug }}</q-td>
              </q-tr>
            </template>
      
            <!-- Summary Row -->
            <template v-if="props.row.type === 'summary'">
              <q-tr v-if="expandedGroups[props.row.furnizor]" class="bg-grey-1">
                <q-td colspan="4" class="text-right">
                  <strong>Total:</strong>
                </q-td>
                <q-td class="text-right">
                  {{ formatAmount(calculateValoareTotalaFurnizor(props.row.furnizor).toFixed(1)) }}
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
              </q-tr>
            </template>
              <!-- Bottom Slot for Summary Row -->

          </template>
        </q-table>
      </q-card>
    </div>
  </template>
  
  <script setup>

  
  const pagination = ref({
    rowsPerPage: 0
  })

  function formatDate(date) {
  return new Date(date).toLocaleDateString('ro-RO')
}
function formatAmount(amount) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
  // Add unique identifier to original rows
  const originalRows = ref([
   
  ])
  
  const columns = [
    { 
      name: 'numefurnizor', 
      required: true, 
      label: 'Furnizor', 
      align: 'left', 
      field: 'numefurnizor' 
    },
    { 
      name: 'nrfact', 
      label: 'Nr. fact.', 
      field: 'nrfact' ,
      align:'left'
    },
    { 
      name: 'datafact', 
      label: 'Data fact.', 
      field: 'dataFactura' ,
      align:'center'
    },{
      name:'valoare',
      label:'Valoare',
      field:'valoare',
      align:'right'
    },{
      name:'ramasplata',
      label:'Ramas de plata',
      field:'ramasplata',
      align:'right'
    },
    { 
      name: 'sursafin', 
      label: 'Sursa fin.', 
      field: 'sursafin' ,
      align:'left'
    },
    { 
      name: 'artbug', 
      label: 'Art. bug.', 
      field: 'artbug' ,
      align:'center'
    }
  ]

  // Initialize expandedGroups with all groups closed
  const expandedGroups = ref({

  })
  const processedRows  = ref([])
  let categorii = []
  const prelucrareFacturi = async ()=>{
    const facturi = await $fetch('/api/facturiprimite')
    categorii=[]
    originalRows.value=[]

    facturi.map(factura=>{
      if(!categorii.includes(factura.furnizor.denumire)) categorii.push(factura.furnizor.denumire)
      originalRows.value.push({
          id:factura.id,
          numefurnizor:factura.furnizor.denumire,
          nrfact:factura.numarFactura,
          datafact:formatDate(factura.dataFactura),
          valoare:factura.valoare,
          ramasplata:factura.valoare,
          sursafin:factura.sursaFinantare.denumire,
          artbug:factura.articolBugetar.cod,
          codfiscalfurnizor:factura.furnizor.codfiscal,
          ibanfurnizor:factura.furnizor.iban,
          ibanplatitor:factura.articolBugetar.iban,
          explicatii:factura.articolBugetar.denumire,
          indicator:factura.receptie.angajament.modificari.filter(modificare=>modificare.motiv==='Creare angajament')[0].indicator,
          codang:factura.receptie.angajament.modificari.filter(modificare=>modificare.motiv==='Creare angajament')[0].codang,
      })
    })
    expandedGroups.value=categorii.reduce((acc, key) => {
          acc[key] = true; // Set the value to true for each key
          return acc; // Return the accumulator for the next iteration
      }, {});


    console.log(facturi,categorii,originalRows.value,expandedGroups.value)
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
    return originalRows.value.filter(factura => factura.numefurnizor === furnizor)
  }
  
  const calculateTotalValoare = ()=>{
    return originalRows.value.reduce((sum,factura)=> sum + parseFloat(factura.valoare),0)
  }
  const calculateValoareTotalaFurnizor = (furnizor) => {
    const groupRows = filterByFurnizor(furnizor)
    if (groupRows.length === 0) return 0
    
    const total = groupRows.reduce((sum, factura) => sum + parseFloat(factura.valoare), 0)
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
  
  // Action handlers for new buttons
  const handleFirstAction = () => {
    console.log('First Action clicked')
    console.log('Selected Rows:', selectedRows.value[0])
  }
  
  const handleSecondAction = () => {
    console.log('Second Action clicked')
    console.log('Selected Rows:', selectedRows.value)
  }

 onMounted(async ()=>{
  await prelucrareFacturi()
  processedRows.value=processRows()
  console.log('processed rows',processedRows.value)
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
  </style>