<script setup>
import {useNomenclatoareStore} from '~/stores/useNomenclatoareStore'

const nomenclatoareStore = useNomenclatoareStore()
const props = defineProps({
     default:String,
     modelValue:String
})
const emit = defineEmits(['update:modelValue'])


const columns = [

  { name: 'cod', align: 'center', label: 'Cod', field: 'cod', sortable: true },
  { name: 'denumire', align: 'left', label: 'Denumire', field: 'denumire', sortable: true },
]

let rows=reactive({
     coduricpv:[{cod:'111111',denumire:'Cod CPV'}],
     codurinc:[{cod:'aaaaaa',denumire:'Cod NC'}]
})
let pagination= ref({
        rowsPerPage: 0
      })
let filter=ref(props.modelValue?props.modelValue:'')
let selected=ref([])
let tipcod=ref(props.default)
//console.log(props.modelValue,'select cod')
</script>


<template>
     <div style="max-height:480px">
          <q-card style="max-width: 400px;">
               <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Selectie cod</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
               </q-card-section>

               <q-card-section >
                    <div class="flex flex-center">
                        
                         <q-btn-toggle
                              v-model="tipcod"
                              class="my-custom-toggle"
                              no-caps
                              rounded
                              unelevated
                              toggle-color="primary"
                              color="white"
                              text-color="primary"
                              :options="[
                                   {label: 'Coduri CPV', value: 'codcpv'},
                                   {label: 'Coduri NC', value: 'codnc'}
                              ]"
                    />
                    </div>
                    <q-table
                         style="height: 400px"
                         flat bordered
                         dense
                         :rows="tipcod=='codcpv'?nomenclatoareStore.baza.coduricpv:rows.codurinc"
                         :columns="columns"
                         :filter="filter"
                         row-key="cod"
                         virtual-scroll
                         v-model:pagination="pagination"
                         :rows-per-page-options="[0]"
                         selection="single"
                         v-model:selected="selected"
                         @update:selected="emit('update:modelValue', selected.length>0?selected[0].cod:null)"
                    >

                    <template v-slot:top-right>
                         <q-input  borderless dense debounce="300" v-model="filter" placeholder="Cauta...">
                              <template v-slot:append>
                              <q-icon name="search" />
                              </template>
                         </q-input>
                    </template>
                    </q-table>

               </q-card-section>
           </q-card>
     </div>
</template>
<style>
.my-custom-toggle{
  border: 1px solid #027be3;
  margin-bottom: 8px;
}
 
</style>