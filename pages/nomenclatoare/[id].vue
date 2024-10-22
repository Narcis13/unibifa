<script setup>
import { useArhitecturaStore } from '~/stores/useArhitecturaStore';
import { useNomenclatoareStore } from '~/stores/useNomenclatoareStore';
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
const arhitecturaStore = useArhitecturaStore()
const nomenclatoareStore=useNomenclatoareStore()
const utilizatorStore = useUtilizatorStore();
const {id} = useRoute().params

const arhitectura = arhitecturaStore.arhitectura[id]
const columns = [
...arhitectura.proprietati.filter(obj=>obj.displayed_in_table)
]
//console.log(arhitectura)
//console.log(arhitecturaStore.arhitectura[id],columns)
const  initialPagination = {
       // sortBy: 'desc',
       // descending: false,
        page: 1,
        rowsPerPage: 10

      }

const selected = ref([])
const filtru=ref('')
const adaugmodificItem = ref(false)

let optiuni = {}
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

if(utilizatorStore.eAdmin){
    const surse =  await $fetch(`/api/nomenclatoare/sursefinantare`);
    nomenclatoareStore.baza.sursefinantare_index=[]
    surse.map(s=>{
        nomenclatoareStore.baza.sursefinantare_index.push(s)
    })

    const articole =  await $fetch(`/api/nomenclatoare/articolebugetare`);
    nomenclatoareStore.baza.articolebugetare_index=[]
    articole.map(a=>{
        nomenclatoareStore.baza.articolebugetare_index.push(a)
    })

    const compartimente =  await $fetch(`/api/nomenclatoare/compartimente`);
    nomenclatoareStore.baza.compartimente_index=[]
    compartimente.map(c=>{
        c.responsabil=c.responsabil.name;
        nomenclatoareStore.baza.compartimente_index.push(c)
    })

    const categorii =  await $fetch(`/api/nomenclatoare/Categorii`);
    nomenclatoareStore.baza.Categorii_index=[]
    categorii.map(c=>{
        c.compartiment=c.compartiment.denumire;
        c.articolBugetar=c.articolBugetar.cod;
        c.sursaFinantare=c.sursaFinantare.scurt;
        nomenclatoareStore.baza.Categorii_index.push(c)
    })

    const bugete =  await $fetch(`/api/nomenclatoare/Bugete`);
    nomenclatoareStore.baza.Bugete_index=[]
    bugete.map(b=>{
 
        b.articolBugetar=b.articolBugetar.cod;
        b.sursaFinantare=b.sursaFinantare.scurt;
        nomenclatoareStore.baza.Bugete_index.push(b)
    })
} 

function afiseazaAlerta(mesaj){
   alert.value=true
   mesajAlerta.value=mesaj
}

function adaug(){
  adaugmodificItem.value=true
  actiune.value='adaug'
}
function modific(){
  //console.log('selected',selected)
  nomenclatoareStore.mod_item(selected.value[0],id+'_demodificat')
  adaugmodificItem.value=true
  actiune.value='modific'
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
                :rows="nomenclatoareStore.baza[id+'_index']"
                :columns="columns"
                :pagination="initialPagination"
                row-key="id"
                selection="single"
                v-model:selected="selected"
             >

             <template v-slot:top-left>

                               
                                <div class="flex" style="min-width:200px;max-height:100px;">


                                    <q-btn  class="q-ma-sm" label="Adauga"   icon="add" @click="adaug">

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
                  <div class="text-h6">Adaug {{ id }}</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
               </q-card-section>

               <q-card-section >
                   <add-nomenclator-item :mod="actiune" :optiuni="optiuni" :context="arhitectura" :tip_nomenclator="id" @nonunic="afiseazaAlerta"/>
               </q-card-section>
               </q-card>
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