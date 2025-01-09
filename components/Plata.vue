<template>
    <q-card class="payment-form q-pa-md" style="max-width: 500px">
      <q-card-section>
        <div class="text-h6">Plata facturi</div>
      </q-card-section>
  
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Numar OP -->
          <q-input
            v-model="formData.numarOP"
            label="Număr OP"
            filled
            readonly
          
          />
  
          <!-- Data OP -->
          <q-input label="La data"  v-model="formData.dataOP" mask="date" :rules="['date']">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                                <q-date v-model="formData.dataOP">
                                                <div class="row items-center justify-end">
                                                    <q-btn  v-close-popup  label="Inchide" color="primary" flat />
                                                </div>
                                                </q-date>
                                            </q-popup-proxy>
                                            </q-icon>
                                        </template>
                           </q-input>
  
          <!-- Valoare plata -->
          <q-input
            v-model="formData.valoarePlata"
            label="Valoare plată"
            :readonly="facturi.length>1"
            filled
            type="number"
            step="0.01"
            lazy-rules
            :rules="[
              val => !!val || 'Câmpul este obligatoriu',
              val => (val > 0 && val<=facturi.reduce((acc, curr) => acc + parseFloat(curr.valoare) , 0))|| 'Valoarea invalidă '
            ]"
          />
  
          <!-- Detalii -->
          <q-input
            v-model="formData.detalii"
            
            label="Detalii"
            filled
            type="textarea"
            rows="3"
          />
  
          <!-- Art. bug. -->
          <q-input
            v-model="formData.artBug"
            readonly
            label="Articol bugetar"
            filled
          />
  
          <!-- Cod angajament -->
          <q-input
            v-model="formData.codAngajament"
            readonly
            label="Cod angajament"
            filled
          />
  
          <!-- Indicator -->
          <q-input
            v-model="formData.indicator"
            readonly
            label="Indicator"
            filled
          />

          <q-input
            v-model="formData.disponibil"
            readonly
            label="Disponibil bugetar"
            filled
          />
  
          <div class="row justify-end q-mt-md">
            <q-btn label="Anulează" flat class="q-mr-sm" @click="resetForm" />
            <q-btn label="Salvează" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </template>
  <script setup >
  import { date } from 'quasar'
// Define the props

const props = defineProps({
  facturi: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      // Add any validation logic for the facturi array if needed
      return Array.isArray(value)
    }
  }
})

const emit = defineEmits([
  'plati-montat',
  'plata-efectuata'
])

const nextop = await $fetch('api/plati/nextop')  
//console.log('max value: '+props.facturi.reduce((acc, curr) => acc + parseFloat(curr.valoare) , 0))
const azi = ref(date.formatDate(new Date(), 'YYYY/MM/DD'))
const facturi=[...props.facturi]
  const formData = ref({
    numarOP: nextop.nextop,
    dataOP: azi.value,
    valoarePlata: facturi.reduce((acc, curr) => acc + parseFloat(curr.ramasplata) , 0),
    detalii: 'c/v fact. '+facturi.reduce((acc, curr) => acc + curr.nrfact + ', ', '')+' '+facturi[0].explicatii,
    artBug: facturi[0].artbug,
    codAngajament: facturi[0].codang,
    indicator: facturi[0].indicator,
    disponibil:0
  })
  
  const onSubmit = async () => {
    try {
    const response = await $fetch('/api/plati', {
      method: 'POST',
      body: {
        ...formData.value,
        facturi
      }
    })
    
    if (response.success) {
      emit('plata-efectuata', {
        success: true,
        message: `OP nr. ${formData.value.numarOP} a fost adaugat cu succes`,
        facturi
      })
    }
  } catch (error) {
    console.error('Error:', error)
    emit('plata-efectuata', {
      success: false,
      message: error.message,
      facturi: []
    })
  }
  }
  
  const resetForm = () => {
    formData.value={
      numarOP: nextop.nextop,
    dataOP: new Date(),
    valoarePlata: facturi.reduce((acc, curr) => acc + parseFloat(curr.ramasplata) , 0),
    detalii: 'c/v fact. '+facturi.reduce((acc, curr) => acc + curr.nrfact + ', ', '')+' '+facturi[0].explicatii,
    artBug: facturi[0].artbug,
    codAngajament: facturi[0].codang,
    indicator: facturi[0].indicator,
    disponibil:0
  }
  }

  onMounted(() => {
    emit('plati-montat')
  })
  </script>
  
  <style scoped>
  .payment-form {
    margin: 20px auto;
  }
  </style>