<script setup>

import { useArhitecturaStore } from '~/stores/useArhitecturaStore';
//import { useNomenclatoareStore } from '~/stores/useNomenclatoareStore';
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
import { useValidare } from '~/composables/useValidare';
const arhitecturaStore = useArhitecturaStore()
//const nomenclatoareStore=useNomenclatoareStore()
const utilizatorStore = useUtilizatorStore();
//const {id} = useRoute().params


const arhitectura = arhitecturaStore.arhitectura['furnizori']
const columns = [
...arhitectura.proprietati.filter(obj=>obj.displayed_in_table)
]
//console.log(arhitectura)
//console.log(arhitecturaStore.arhitectura[id],columns)
const  initialPagination = {
       // sortBy: 'desc',
       // descending: false,
        page: 1,
        rowsPerPage: 15

      }
const {ibanValid, codfiscalValid} = useValidare()
const selected = ref([])
const filtru=ref('')
const adaugmodificItem = ref(false)
const modificaItem = ref(false)
let optiuni = {}
const furnizori=ref([])
furnizori.value =  await $fetch(`/api/nomenclatoare/furnizori?cid=${utilizatorStore.utilizator.role=='CFPP'?0:utilizatorStore.utilizator.id}`);
const hidrateaza = async (url)=>{

 return await $fetch(`/${url}`,{
              headers:{
             
              }
            })
}
arhitectura.proprietati.map(async item=>{
  if("options" in item){
   optiuni[item.name]=[... await hidrateaza(item.options[0])]
  }
 })
let alert = ref(false)
let mesajAlerta = ref('')
let actiune = ref('adaug')




function modific(){
  console.log('selected',selected.value[0],id)
  //nomenclatoareStore.mod_item(selected.value[0],id+'_demodificat')
  modificaItem.value=true
  actiune.value='modific'
 // selected.value=[]
}
function onCancel(){
  modificaItem.value=false
}

async function onSaveFurnizor(item){
  //console.log('item',item)
 // await furnizori()
  modificaItem.value=false
  selected.value=[]
}
</script>
<template>
   <q-page class=" column items-center justify-start q-gutter-md " >
      <div class="text-h5 q-mt-xl">{{ arhitectura.titlu }}</div>
        <div class="q-mt-md">
            <q-table
                flat bordered
                :filter="filtru"
                :rows="furnizori"
                :columns="columns"
                :pagination="initialPagination"
                row-key="id"
                selection="single"
                v-model:selected="selected"
             >

             <template v-slot:top-left>

                               
                                <div class="flex" style="min-width:200px;max-height:100px;">


                                    <q-btn disable class="q-ma-sm" label="Adauga"   icon="add" >

                                    </q-btn>
                                
                                    <q-btn :disable="selected.length==0" class="q-ma-sm" label="Modifica"   icon="edit_note" @click="modific">

                                    </q-btn>
                                    <q-btn :disable="selected.length==0" class="q-ma-sm" label="Sterge" icon="remove" >
                                        
                                      </q-btn>
                                </div>

              </template>
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filtru" placeholder="Cauta..">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
            </q-table>
        </div>

        <q-dialog v-model="adaugmodificItem">
               <q-card style="min-width: 350px;">
               <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Adaug furnizor</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
               </q-card-section>

               <q-card-section >
                   <!-- <add-nomenclator-item :mod="actiune" :optiuni="optiuni" :context="arhitectura" :tip_nomenclator="id" @nonunic="afiseazaAlerta"/> -->
               </q-card-section>
               </q-card>
       </q-dialog>

       <q-dialog v-model="modificaItem">

          <ModificFurnizor 
         
            :furnizor="selected[0]"
            @save="onSaveFurnizor" 
            @cancel="onCancel"
          />
       </q-dialog>

       <q-dialog v-model="alert">
          <q-card>
            <q-card-section>
              <div class="text-h6">Alerta</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ mesajAlerta }}
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="AM INTELES" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
    </q-dialog>
     </q-page>
</template>