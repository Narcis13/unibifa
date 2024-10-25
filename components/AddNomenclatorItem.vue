<script setup>
import { useQuasar } from 'quasar'
import useValidare from '~/composables/useValidare';
import { useArhitecturaStore } from '~/stores/useArhitecturaStore';
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
import {useNomenclatoareStore} from '~/stores/useNomenclatoareStore'
import codselect from '~/components/codselect.vue'
const props=defineProps({
  tip_nomenclator:String,
  mod:String,
  context:Object,
  optiuni:Object
})
const emit = defineEmits(['nonunic'])

const arhitecturaStore = useArhitecturaStore()
const nomenclatoareStore = useNomenclatoareStore()
const userStore = useUtilizatorStore()
const $q = useQuasar()
const faraValidare = computed(()=>{
  return true;
})
console.log(userStore.utilizator)
const corelatieBucuresti = computed(()=>{
//console.log('corelatie buc',formData["judet"].substr(0,4))
//const corelatie = formData["judet"].substr(0,4)=='B - '&&formData["localitate"].substr(0,6)=="SECTOR"
return props.tip_nomenclator=='client'?formData["judet"].substr(0,4)!=='B - '||formData["judet"].substr(0,4)=='B - '&&formData["localitate"].substr(0,6)=="SECTOR":true;
})


const lipsaDate = computed(()=>{
   
   let interim=[]
   cimpuri_obligatorii.map(c=>{
    interim.push(formData[c]==null||formData[c]=="")
   })
  
   return interim.some(item => item === true);
})
//console.log('props optiuni',props.optiuni)
const formularInvalid = computed(()=>{
  let rezultate=[]
 
  fields.map(field=>{
    if("validare" in field){
      field.validare.map(v=>{
       rezultate.push(validari[v](formData[field.name])) 
      })
    }
  })
  return rezultate.some(item => item === false);
})

const formularRef = ref(null)

const validari = useValidare()
const sincronizari = useSincronizare()
const {stripNulls,camelCase} = useUtilitare()
let validatori = reactive({})
const formData = reactive({});
let fields =reactive([])
let cimpuri_obligatorii=[]

//console.log(props.mod,nomenclatoareStore.baza.client_demodificat)

function initData(){
 props.context.proprietati.map(async p=>{
  let clone={...p}
  //console.log('clone si p',clone,p)


  if(!p.hidden_in_form){
   
    if("options" in p) {
    // clone.options= [...await hidrateaza(p.options[0])]
     clone.options=props.optiuni[p.name]
       fields.push(clone)
     // console.log('fields push clone',fields,clone)
    }
    else {
      fields.push(p)
     // console.log('fields push p',fields,p)
    }
  //  console.log('clona si optiuni',clone,optiuni)
  
    if(p.label.slice(-1)=="*") cimpuri_obligatorii.push(p.name);
    if("default_value" in p){
      formData[p.name]=p.default_value
    }
    else
    formData[p.name]=null


    if("validare" in p){
      validatori[p.name]=computed(()=>{
        let rezultat=true
        p.validare.map(v=>{
           rezultat=rezultat&&validari[v](formData[p.name])
        })
     //   return validari[p.validare[0]](formData[p.name])
     return rezultat;
      })
    }
    else
    validatori[p.name]=faraValidare
    
    if("sync" in p){
      watch(formData,(val_noua)=>{
        let s=sincronizari[p.sync](val_noua)
        if(s){
         // console.log(s)
          formData[p.sync]=s
        }
      })
    }
  }
})
}
initData();

if(props.mod==='modific'){
  const item_demodificat = nomenclatoareStore.baza[props.tip_nomenclator+'_demodificat']
  Object.keys(item_demodificat).map(k=>{
    formData[k]=item_demodificat[k]
  })
}
//console.log("client_unic" in validari,"Proprietati add item in nomenclator")

async function run(name){
 const rez= await arhitecturaStore.actions[name]({host,name:formData[name]})
Object.keys(rez).map(k=>{
  formData[k]=rez[k]
})
}

async function adauga(){



  let payload=stripNulls(formData);
  payload.id_user=userStore.utilizator.id
  let unicitate = 'unic'
  if(props.tip_nomenclator+"_unic" in validari){
   unicitate = validari[props.tip_nomenclator+"_unic"](nomenclatoareStore.baza[props.tip_nomenclator+'_index'],payload)
  }  
 // console.log('rezultate validare finala',rezultate,unicitate)
if(unicitate==='unic'){
  let {data}=  await useFetch(`/api/nomenclatoare/${props.tip_nomenclator}/nou`, {
        method: "POST",
        headers: {
          
        },
        body: payload
      });

      if(data.value.succes){

       nomenclatoareStore.add_item(data.value[props.tip_nomenclator],props.tip_nomenclator+'_index')
        $q.notify({
          type: 'positive',
          position:'top',
          timeout:2000,
          message:camelCase(props.tip_nomenclator)+ ' adaugat cu succes!'
        })
      
      }
      else
      {
        $q.notify({
          type: 'negative',
          position:'top',
          timeout:2000,
          message:'EROARE!'
        })
      }
    }
    else {
      //display alert non unic...
     // alert.value=true;
     emit("nonunic",unicitate)
    }
}

async function modifica(){
  const {id} =formData;
  let payload=stripNulls(formData)

  let {data}=  await useFetch(`/api/nomenclatoare/${props.tip_nomenclator}/modific?resid=${id}`, {
        method: "PUT",
        headers: {
         
        },
        body: payload
      });
  if(data.value.succes){
     nomenclatoareStore.integreaza_item(data.value.updateitem,props.tip_nomenclator+'_index')
     $q.notify({
          type: 'positive',
          position:'top',
          timeout:2000,
          message:camelCase(props.tip_nomenclator)+ ' actualizat cu succes!'
        })
  }
  else
  {
    $q.notify({
          type: 'negative',
          position:'top',
          timeout:2000,
          message:'EROARE!'
        })
  }
 // console.log('modifica....',data.value)
}
</script>
<template>
<div ref="formularRef" class="q-gutter-y-md column " style="max-width: 400px">
     <div v-for="(field, index) in fields" :key="index" class="q-ma-sm">
          <q-input  dense bottom-slots :error="!validatori[field.name]" error-message="Continut invalid!" v-if="field.qtype=='QInput'" v-bind="field" v-model="formData[field.name]">
            <template v-slot:after>
              <q-btn :disable="formData[field.name]==null||!validatori[field.name]||formData[field.name].length==13" v-if="field.with_action" round dense flat icon="send" @click="run(field.name)"/>
            </template>

            <template v-if="field.with_popup" v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <codselect :default="field.name" v-model="formData[field.name]"/>
                </q-popup-proxy>
              </q-icon>
      </template>


          </q-input>
          <q-select  dense bottom-slots error-message="Continut invalid!" v-if="field.qtype=='QSelect'" v-bind="field" v-model="formData[field.name]"/>
          <q-checkbox  dense v-if="field.qtype=='QCheckbox'" v-bind="field" v-model="formData[field.name]"/>
            <!-- <component :is="field.type" v-bind="field" v-model="formData[field.name]" /> -->
    </div>
    <div class="flex flex-center">
      <q-btn v-if="mod==='adaug'" :disable="lipsaDate||formularInvalid||!corelatieBucuresti" color="white" text-color="indigo" label="Adauga" @click="adauga" v-close-popup>
        <q-tooltip v-if="lipsaDate" class="bg-accent">Campurile cu * sunt obligatorii</q-tooltip>
      </q-btn>
      <q-btn v-if="mod==='modific'" :disable="lipsaDate||formularInvalid" color="white" text-color="indigo" label="Modifica" @click="modifica" v-close-popup>
        <q-tooltip v-if="lipsaDate" class="bg-accent">Campurile cu * sunt obligatorii</q-tooltip>
      </q-btn>
    </div>


</div>
</template>
