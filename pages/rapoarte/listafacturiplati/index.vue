<template>
    <div class="report-container">
      <div class="report-content">
        <h2 class="text-h5 q-mb-md">{{ report.titlu }}</h2>
        
        <q-markup-table flat bordered dense class="full-width" v-if="report.columns">
        <thead>
          <tr>
            <th v-for="col in report.columns" :key="col.dataKey" class="text-left">
              {{ col.title }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="report.subtotaluri" v-for="(sursaGroup, sursaKey) in groupedData" :key="sursaKey">
            <!-- Sursa Finantare Header -->
            <tr v-if="!report.doarsubtotaluri" class="bg-grey-3">
              <td :colspan="report.columns.length" class="text-weight-bold">
                {{ sursaKey }}
              </td>
            </tr>

            <template v-if="!report.doarsubtotaluri" v-for="(artGroup, artKey) in sursaGroup" :key="artKey">
              <!-- Article Bugetar Header -->
              <tr class="bg-grey-2">
                <td :colspan="report.columns.length" class="text-weight-bold q-pl-md">
                  {{ artKey }}
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-for="row in artGroup" :key="row.id">
                <td v-for="col in report.columns" :key="col.dataKey">
                  <template v-if="col.dataKey === 'datafact'">
                    {{ row[col.dataKey] }}
                  </template>
                  <template v-else-if="col.dataKey === 'valoare'">
                    {{ formatAmount(getTotalSuma(row)) }}
                  </template>
                  <template v-else-if="col.dataKey === 'sursafin'">
                    {{ getInitials(row[col.dataKey]) }} {{ row['artbug'] }}
                  </template>
                  <template v-else-if="col.dataKey === 'artbug'">
                    {{ row[col.dataKey] }}
                  </template>
                  <template v-else>
                    {{ row[col.dataKey] }}
                  </template>
                </td>
              </tr>

              <!-- Article Subtotal -->
              <tr class="bg-grey-1">
                <td :colspan="report.columns.length - 2" class="text-right">
                  Subtotal {{ artKey }}:
                </td>
                <td class="text-weight-bold">
                  {{ formatAmount(calculateSubtotal(artGroup)) }}
                </td>
              </tr>
            </template>

            <!-- Sursa Finantare Subtotal -->
            <tr class="bg-grey-3">
              <td :colspan="report.columns.length - 2" class="text-right">
                Subtotal {{ sursaKey }}:
              </td>
              <td class="text-weight-bold">
                {{ formatAmount(calculateSursaSubtotal(sursaGroup)) }}
              </td>
            </tr>
          </template>
   
        </tbody>

        <!-- Grand Total -->
        <tfoot>
          <tr class="bg-primary text-white">
            <td :colspan="report.columns.length - 1" class="text-right">
              Total General:
            </td>
            <td class="text-weight-bold">
              {{ formatAmount(calculateGrandTotal()) }}
            </td>
          </tr>
        </tfoot>
      </q-markup-table>
      
      <div v-else class="text-center q-pa-md">
        Încărcare date...
      </div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  import { format } from 'date-fns'
  import { ro } from 'date-fns/locale'
  
  definePageMeta({
    layout: 'rapoarte'
  })
  
  const institutie = await $fetch('/api/info/institutie')
  
  // Initialize report with default empty values
  const report = ref({
    titlu: '',
    format: 'A4',
    orientation: 'landscape',
    columns: [],
    sortby: [],
    groupby: '',
    subtotal: '',
    data: []
  })
  
  function formatAmount(amount) {
    return new Intl.NumberFormat('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  function formatDate(date) {
    return format(new Date(date), 'dd.MM.yyyy', { locale: ro })
  }
  function getInitials(str) {
    return str.split(' ')
        .map(word => word[0].toUpperCase() + '.')
        .join('');
}
  function getTotalSuma(row) {
    return parseFloat(row.valoare) || 0
  }
  
  function calculateSubtotal(group) {
    return group.reduce((acc, row) => acc + getTotalSuma(row), 0)
  }
  
  function calculateSursaSubtotal(sursaGroup) {
    return Object.values(sursaGroup).reduce((acc, group) => 
      acc + calculateSubtotal(group), 0)
  }
  
  function calculateGrandTotal() {
    return report.value.data?.reduce((acc, row) => acc + getTotalSuma(row), 0) || 0
  }
  
  /*const groupedData = computed(() => {
    if (!report.value.data?.length) return {}
  
    return report.value.data.reduce((sursaGroups, item) => {
      const sursaKey = item.categorie?.sursaFinantare?.denumire || 'Nedefinit'
      const artKey = item.categorie?.articolBugetar?.cod || 'Nedefinit'
      
      if (!sursaGroups[sursaKey]) {
        sursaGroups[sursaKey] = {}
      }
      if (!sursaGroups[sursaKey][artKey]) {
        sursaGroups[sursaKey][artKey] = []
      }
      
      sursaGroups[sursaKey][artKey].push(item)
      return sursaGroups
    }, {})
  })*/
  
  const groupedData = computed(() => {
    if (!report.value.data?.length) return {}
  
    // First, reduce the data into grouped structure
    const grouped = report.value.data.reduce((sursaGroups, item) => {
      let sursaKey = '', artKey = '';
      if(report.value.sortby[0]==='artbug'){
       sursaKey = item.artbug || 'Nedefinit'
       artKey = item.numefurnizor || 'Nedefinit'
      }
      else{
        sursaKey = item.numefurnizor || 'Nedefinit'
        artKey = item.sursafin || 'Nedefinit'
      }
     // const sursaKey = item.artbug || 'Nedefinit'
     // const artKey = item.numefurnizor || 'Nedefinit'
      
      if (!sursaGroups[sursaKey]) {
        sursaGroups[sursaKey] = {}
      }
      if (!sursaGroups[sursaKey][artKey]) {
        sursaGroups[sursaKey][artKey] = []
      }
      
      sursaGroups[sursaKey][artKey].push(item)
      return sursaGroups
    }, {})
   console.log('groupedData:', grouped)
    // Then, for each sursafinantare, create a new object with sorted artbug keys
    return Object.fromEntries(
      Object.entries(grouped).map(([sursaKey, artBugGroups]) => {
        const sortedArtBugGroups = Object.fromEntries(
          Object.entries(artBugGroups)
            .sort(([artKeyA], [artKeyB]) => artKeyA.localeCompare(artKeyB))
        )
        return [sursaKey, sortedArtBugGroups]
      })
    )
  })
  
  onMounted(() => {
    const savedData = localStorage.getItem('tempReports')
    if (savedData) {
      report.value = JSON.parse(savedData)
      console.log('Loaded saved report data:', report.value)
      localStorage.removeItem('tempReports')
    }
  })
  </script>
  
  <style scoped>
.report-container {
  /* A4 Portrait dimensions */
  width: 297mm;  /* Changed from 297mm */
  height: auto;
  margin: 0 auto;
  background: white;
  padding: 10mm;
  box-sizing: border-box;
}

.report-content {
  width: 100%;
}

/* Print-specific styles */
@media print {
  @page {
    size: A4 portrait;  /* Changed from landscape */
    margin: 10mm;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .report-container {
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    box-shadow: none;
    overflow: visible !important;
  }
  
  .report-content {
    width: 100%;
    overflow: visible !important;
  }

  .q-markup-table {
    width: 100%;
    page-break-inside: auto;
  }
  
  thead {
    display: table-header-group;
  }

  .no-print {
    display: none !important;
  }
}

/* Table styles */
.q-markup-table {
  font-size: 0.85rem;
}

.q-markup-table th,
.q-markup-table td {
  padding: 4px 8px;
}
</style>