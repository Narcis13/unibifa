<!-- TableFilter.vue -->
<template>
    <q-btn-dropdown color="primary" square icon="tune" class="q-mr-sm">
      <div class="q-pa-md" style="min-width: 300px">
        <div class="text-h6 q-mb-md">Filtre</div>
        <q-select
          
            v-model="compartiment"
            :options="compartimente"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Compartiment"
          />
        <div v-for="column in filterableColumns" :key="column.name" class="q-mt-md q-mb-md">
          <div class="text-subtitle2 q-mb-sm">{{ column.label }}</div>
          
          <!-- List filter type -->
          <q-select
            v-if="column.filterOptions.type === 'list'"
            v-model="filters[column.name]"
            :options="column.filterOptions.options || []"
            outlined
            dense
            clearable
            emit-value
            map-options
            :readonly="column.filterOptions.options.length==1"
          />
  
          <!-- Date interval filter type -->
          <div v-else-if="column.filterOptions.type === 'interval'" class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input label="De la data"  v-model="filters[column.name].from" mask="date" :rules="['date']">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                                <q-date v-model="filters[column.name].from">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Inchide" color="primary" flat />
                                                </div>
                                                </q-date>
                                            </q-popup-proxy>
                                            </q-icon>
                                        </template>
                 </q-input>


            </div>
            <div class="col-6">
                           <q-input label="La data"  v-model="filters[column.name].to" mask="date" :rules="['date']">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                                <q-date v-model="filters[column.name].to">
                                                <div class="row items-center justify-end">
                                                    <q-btn  v-close-popup  label="Inchide" color="primary" flat />
                                                </div>
                                                </q-date>
                                            </q-popup-proxy>
                                            </q-icon>
                                        </template>
                           </q-input>
            </div>
          </div>
  
          <!-- Checkbox filter type -->
          <q-checkbox
            v-else-if="column.filterOptions.type === 'check'"
            v-model="filters[column.name]"
            :label="filters[column.name]===null?'TOATE':'Vizat CFPP'"
            toggle-indeterminate
            
          />
          <div v-else-if="column.filterOptions.type === 'checkif'" class="row q-col-gutter-xl">
          <q-checkbox
           
            v-model="filters[column.name]"
            :label="filters[column.name]===null?'TOATE':'Platite'"
            toggle-indeterminate
            
          />

          <q-input v-if="!filters['ramasplata']&&filters['ramasplata']!==null" label="Neachitate la data"  v-model="neachitateLaData" mask="date" :rules="['date']">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                                <q-date v-model="neachitateLaData">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Inchide" color="primary" flat />
                                                </div>
                                                </q-date>
                                            </q-popup-proxy>
                                            </q-icon>
                                        </template>
                 </q-input>

                 <div v-if="filters['ramasplata']" class="row q-col-gutter-sm">
                        <div class="col-6">
                        <q-input label="Platite de la data"  v-model="platiteDeLaData" mask="date" :rules="['date']">
                                                    <template v-slot:append>
                                                        <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="platiteDeLaData">
                                                            <div class="row items-center justify-end">
                                                                <q-btn v-close-popup label="Inchide" color="primary" flat />
                                                            </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                        </q-icon>
                                                    </template>
                            </q-input>


                        </div>
                        <div class="col-6">
                                    <q-input label="Pana la data"  v-model="platitePanaLaData" mask="date" :rules="['date']">
                                                    <template v-slot:append>
                                                        <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="platitePanaLaData">
                                                            <div class="row items-center justify-end">
                                                                <q-btn  v-close-popup  label="Inchide" color="primary" flat />
                                                            </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                        </q-icon>
                                                    </template>
                                    </q-input>
                        </div>
                    </div>
          </div>
          <!-- Numeric value filter type -->
          <div v-else-if="column.filterOptions.type === 'numericvalue'" class="row q-col-gutter-sm">
            <div class="col-4">
              <q-select
                v-model="filters[column.name].operator"
                :options="[
                  { label: '>', value: 'gt' },
                  { label: '<', value: 'lt' },
                  { label: '=', value: 'eq' }
                ]"
                outlined
                dense
           
              />
            </div>
            <div class="col-8">
              <q-input
                v-model.number="filters[column.name].value"
                type="number"
                outlined
                dense
              
              />
            </div>
          </div>
        </div>
  
        <div class="row justify-end q-gutter-sm">
          <q-btn label="Resetează" color="negative" flat @click="resetFilters" />
          <q-btn label="Aplică" color="primary" v-close-popup @click="emitFilters" />
        </div>
      </div>
    </q-btn-dropdown>
  </template>
  
  <script setup lang="ts">
  //import { ref, computed } from 'vue'
  //import type { Ref } from 'vue'
  import { date } from 'quasar'

  interface FilterOptions {
    enabled: boolean
    type: 'list' | 'interval' | 'check' | 'numericvalue'
    options?: { label: string; value: any }[] // For list type filters
  }
  
  interface Column {
    name: string
    label: string
    filterOptions: FilterOptions
  }
  
  interface Props {
    columns: Column[]
    defaults:Record<string,any>
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['filtersadded'])

  // Only show columns that have filtering enabled
  const filterableColumns = computed(() => 
    props.columns.filter(col => col.filterOptions?.enabled)
  )
  const compartimente = await $fetch('api/info/compartimente')
  const compartiment=ref(null)
  console.log('Filtre default',props.defaults)
  // Initialize filters object based on column types
  const filters: Ref<Record<string, any>> = ref({})
  const neachitateLaData = ref(date.formatDate(new Date(),'YYYY/MM/DD'))

  const platiteDeLaData = ref(date.formatDate(new Date(new Date().getFullYear(), 0, 1), 'YYYY/MM/DD'))
  const platitePanaLaData = ref(date.formatDate(new Date(),'YYYY/MM/DD'))
  // Initialize empty filters for each filterable column
  filterableColumns.value.forEach(column => {
    if (column.filterOptions.type === 'interval') {
      filters.value[column.name] = { from: date.formatDate(new Date(new Date().getFullYear(), 0, 1), 'YYYY/MM/DD'), to: date.formatDate(new Date(),'YYYY/MM/DD') }
    } else if (column.filterOptions.type === 'numericvalue') {
      filters.value[column.name] = props.defaults[column.name]//{ operator:  { label: '>', value: 'gt' }, value: props.defaults[column.name] }
    } else if (column.filterOptions.type === 'check'||column.filterOptions.type === 'checkif') {
      filters.value[column.name] = props.defaults[column.name]
    } else {
      filters.value[column.name] = props.defaults[column.name]?props.defaults[column.name][0]:null
    }
  })
  
  const resetFilters = () => {
    filterableColumns.value.forEach(column => {
    if (column.filterOptions.type === 'interval') {
      filters.value[column.name] = { from: date.formatDate(new Date(new Date().getFullYear(), 0, 1), 'YYYY/MM/DD'), to: date.formatDate(new Date(),'YYYY/MM/DD') }
    } else if (column.filterOptions.type === 'numericvalue') {
      filters.value[column.name] = props.defaults[column.name]//{ operator:  { label: '>', value: 'gt' }, value: props.defaults[column.name] }
    } else if (column.filterOptions.type === 'check'||column.filterOptions.type === 'checkif') {
      filters.value[column.name] = props.defaults[column.name]
    } else {
      filters.value[column.name] = props.defaults[column.name]?props.defaults[column.name][0]:null
    }
  })
    emitFilters()
  }
  
  const emitFilters = () => {
    // Create a clean filter object removing null/empty values
    const activeFilters = Object.entries(filters.value).reduce((acc, [key, value]) => {
      if (value === null) return acc
      
      if (typeof value === 'object') {
        // Handle interval and numericvalue types
        if (Object.values(value).every(v => v === null || v === '')) return acc
        
        // Only include non-null values
        const cleanValue = Object.entries(value).reduce((obj, [k, v]) => {
          if (v !== null && v !== '') obj[k] = v
          return obj
        }, {} as Record<string, any>)
        
        if (Object.keys(cleanValue).length > 0) {
          acc[key] = cleanValue
        }
      } else {
        acc[key] = value
      }
      
      return acc
    }, {} as Record<string, any>)
   activeFilters['neachitateLaData']=neachitateLaData.value
    activeFilters['platiteDeLaData']=platiteDeLaData.value
    activeFilters['platitePanaLaData']=platitePanaLaData.value
    if(compartiment.value!==null) activeFilters['idcompartiment']=compartiment.value
    emit('filtersadded', activeFilters)
  }
  </script>