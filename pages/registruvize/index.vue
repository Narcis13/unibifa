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
                  :icon="expandedGroups[props.row.gender] ? 'remove' : 'add'"
                  flat
                  round
                  dense
                  size="sm"
                  @click="toggleGroup(props.row.gender)"
                />
                {{ props.row.gender.charAt(0).toUpperCase() + props.row.gender.slice(1) }}
                ({{ filterByGender(props.row.gender).length }})
              </q-td>
            </q-tr>
          </template>
    
          <!-- Regular Data Row -->
          <template v-if="props.row.type === 'data'">
            <q-tr v-if="expandedGroups[props.row.sex]" :props="props">
              <q-td auto-width>
                <q-checkbox 
                  v-model="props.selected" 
                  :disable="props.row.type !== 'data'"
                />
              </q-td>
              <q-td key="name">{{ props.row.name }}</q-td>
              <q-td key="age">{{ props.row.age }}</q-td>
              <q-td key="sex">{{ props.row.sex }}</q-td>
              <q-td class="text-centrat" key="profesie">{{ props.row.profesie }}</q-td>
            </q-tr>
          </template>
    
          <!-- Summary Row -->
          <template v-if="props.row.type === 'summary'">
            <q-tr v-if="expandedGroups[props.row.gender]" class="bg-grey-1">
              <q-td colspan="2" class="text-right">
                <strong>Average Age</strong>
              </q-td>
              <q-td>
                {{ calculateAverageAge(props.row.gender).toFixed(1) }}
              </q-td>
            </q-tr>
          </template>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const pagination = ref({
  rowsPerPage: 0
})

// Add unique identifier to original rows
const originalRows = ref([
  { id: 1, name: 'Ion', age: 23, sex: 'male' ,profesie:'inginer'},
  { id: 2, name: 'Gigina', age: 44, sex: 'female',profesie:'avocat' },
  { id: 3, name: 'Popa', age: 34, sex: 'male' ,profesie:'inginer'}
])

const columns = [
  { 
    name: 'name', 
    required: true, 
    label: 'Name', 
    align: 'left', 
    field: 'name' 
  },
  { 
    name: 'age', 
    label: 'Age', 
    field: 'age' 
  },
  { 
    name: 'sex', 
    label: 'Gender', 
    field: 'sex' 
  },{
    name:'profesie',
    label:'Profesie',
    field:'profesie',
    align:'center'
  }
]

// Initialize expandedGroups with all groups closed
const expandedGroups = ref({
  male: true,
  female: true
})

// Selected rows
const selectedRows = ref([])

// Computed property to check if there are selectable rows
const hasSelectableRows = computed(() => {
  return processedRows.value.some(row => row.type === 'data')
})

// Processed rows include group headers, data rows, and summary rows
const processedRows = computed(() => {
  let rows = []
  
  // Iterate through each gender
  let categorii = ['male', 'female']
  categorii.forEach(gender => {
    // Add group header row
    rows.push({
      type: 'header',
      gender: gender
    })

    // Add data rows if group is expanded
    if (expandedGroups.value[gender]) {
      // Add individual person rows
      const genderRows = filterByGender(gender)
      rows.push(...genderRows.map(row => ({
        ...row,
        type: 'data'
      })))
      
      // Add summary row
      rows.push({
        type: 'summary',
        gender: gender
      })
    }
  })

  return rows
})

const filterByGender = (gender) => {
  return originalRows.value.filter(person => person.sex === gender)
}

const calculateAverageAge = (gender) => {
  const groupRows = filterByGender(gender)
  if (groupRows.length === 0) return 0
  
  const totalAge = groupRows.reduce((sum, person) => sum + person.age, 0)
  return totalAge / groupRows.length
}

const toggleGroup = (gender) => {
  expandedGroups.value[gender] = !expandedGroups.value[gender]
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
  console.log('Selected Rows:', selectedRows.value)
}

const handleSecondAction = () => {
  console.log('Second Action clicked')
  console.log('Selected Rows:', selectedRows.value)
}
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