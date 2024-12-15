<template>
  <div class="q-pa-md">
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">Plata facturi</div>
    </q-card-section>
      <q-table
        dense
        style="height: 1000px"
        flat bordered
        separator="cell"
        :rows="processedRows"
        :columns="columns"
        row-key="name"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
    
      >
        <!-- Custom header -->
        <template v-slot:header="props">
          <q-tr :props="props">
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
              <q-td colspan="3" class="flex items-center">
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
              <q-td key="name">{{ props.row.name }}</q-td>
              <q-td key="age">{{ props.row.age }}</q-td>
              <q-td key="sex">{{ props.row.sex }}</q-td>
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

const pagination= ref({
    rowsPerPage: 0
  })
const originalRows = [
{ name: 'Ion', age: 23, sex: 'male' },
{ name: 'Gigina', age: 44, sex: 'female' },
{ name: 'Popa', age: 34, sex: 'male' }
]

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
}
]

// Initialize expandedGroups with all groups closed
const expandedGroups = ref({
male: true,
female: true
})

// Processed rows include group headers, data rows, and summary rows
const processedRows = computed(() => {
let rows = []

// Iterate through each gender
let categorii = ['male', 'female']
categorii.map(gender => {
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
return originalRows.filter(person => person.sex === gender)
}

const calculateAverageAge = (gender) => {
const groupRows = filterByGender(gender)
if (groupRows.length === 0) return 0

const totalAge = groupRows.reduce((sum, person) => sum + person.age, 0)
return totalAge / groupRows.length
}

const toggleGroup = (gender) => {
//console.log(gender,expandedGroups.value,processedRows)
expandedGroups.value[gender] = !expandedGroups.value[gender]
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
.my-card {
width: 100%;
max-width: 1400px;
margin: 0 auto;
}
</style>