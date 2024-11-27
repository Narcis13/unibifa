<template>
    <div class="row justify-center items-center q-pa-md">
  <div class=" q-gutter-md" style="display: flex; flex-direction: row;  justify-content: center; align-items: center;">
    <q-select
      style="width: 200px"
      v-model="newReceptie.idFurnizor"
      :options="furnizoriOptions"
      label="Furnizor *"
      :rules="[val => !!val || 'Furnizorul este obligatoriu']"
    />
    <q-input
      style="width: 150px"
      :rules="[val => !!val || 'Numarul facturii este obligatoriu']"
      v-model="newReceptie.nrfact"
      label="Nr. factura*"
    />
    <q-input style="width: 120px" label="De la data"  v-model="newReceptie.datafact" mask="date" :rules="['date']">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                                <q-date v-model="newReceptie.datafact"  :options="optionsFn">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Inchide" color="primary" flat />
                                                </div>
                                                </q-date>
                                            </q-popup-proxy>
                                            </q-icon>
                                        </template>
     </q-input>

    <q-input
      style="width: 180px"
      v-model="newReceptie.valoare"
      type="number"
      label="Valoare*"
      :hint="'Interval:('+(0-props.totalreceptii)+':'+props.sumadisponibila+')'"
      error-message="Valoare in afara intervalului permis"
      :error="!sumaValida"
      bottom-slots
    />

    <q-input
      style="width: 150px;"
      v-model="newReceptie.mentiuni"
      type="textarea"
      label="Mentiuni"
    />

    <div class="q-ml-xl" style="display: flex; justify-content: center; align-items: center; gap: 10px;">
      <q-btn :disable="!allValid" class="full-width q-pa-sm" color="primary" @click="emitReceptieOrdonantareNoua">
        Salveaza <br> Ordonanteaza plata
      </q-btn>
      <q-btn :disable="!allValid" label="Salveaza" color="secondary" flat class="q-ml-sm" @click="emitReceptieNoua"/>
    </div>
  </div>
</div>
</template>
<script setup lang="ts">
import type { Receptie } from "~/types/receptii"
import { useNomenclatoareStore } from '~/stores/useNomenclatoareStore';
import { date } from 'quasar'
interface Props {
    idAng: number
    idComp: number
    totalreceptii:number
    sumadisponibila:number
    dataAng : Date
  }
  
const props = defineProps<Props>()
const emit = defineEmits(['adaugreceptienoua','adaugreceptiesiordonantare'])
const nomenclatoareStore=useNomenclatoareStore()
//console.log('Receptie noua setup',props)
function optionsFn (d) {
        return d >= date.formatDate(props.dataAng,'YYYY/MM/DD') && d <= date.formatDate(new Date(),'YYYY/MM/DD')
      }
const furnizoriOptions = ref(nomenclatoareStore.baza.furnizori_index.map(f=>({label:f.denumire,value:f.id})))

//computed area
const sumaValida = computed(()=>{
  return newReceptie.value.valoare>=(0-props.totalreceptii) && newReceptie.value.valoare<=props.sumadisponibila
})
const allValid = computed(()=>{
  return newReceptie.value.valoare>=(0-props.totalreceptii) && newReceptie.value.valoare<=props.sumadisponibila && newReceptie.value.idFurnizor!==null && newReceptie.value.nrfact.length>1
})


const newReceptie = ref<Receptie>({
    idAngajament: props.idAng,
    idFurnizor: null,
    datafact: date.formatDate(new Date(),'YYYY/MM/DD'),
    nrfact:'',
    valoare: 0,
    mentiuni: '',
    stare: 'activ',
    idCompartiment: props.idComp
  })
  const loading = ref(false)
  // Methods
 const emitReceptieNoua = ()=>{
 // console.log('emitReceptieNoua',newReceptie.value)
 //newReceptie.value.idFurnizor=newReceptie.value.idFurnizor.value
  emit('adaugreceptienoua',newReceptie.value)
}

const emitReceptieOrdonantareNoua = ()=>{
 // console.log('emitReceptieNoua',newReceptie.value)
 //newReceptie.value.idFurnizor=newReceptie.value.idFurnizor.value
  emit('adaugreceptiesiordonantare',newReceptie.value)
}
</script>
