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
          
          />
  
          <!-- Data OP -->
          <q-input
            v-model="formData.dataOP"
            label="Data OP"
            filled
            type="date"
       
          />
  
          <!-- Valoare plata -->
          <q-input
            v-model="formData.valoarePlata"
            label="Valoare plată"
            filled
            type="number"
            step="0.01"
            :rules="[
              val => !!val || 'Câmpul este obligatoriu',
              val => val > 0 || 'Valoarea trebuie să fie pozitivă'
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
            label="Articol bugetar"
            filled
          />
  
          <!-- Cod angajament -->
          <q-input
            v-model="formData.codAngajament"
            label="Cod angajament"
            filled
          />
  
          <!-- Indicator -->
          <q-input
            v-model="formData.indicator"
            label="Indicator"
            filled
          />

          <q-input
            v-model="formData.disponibil"
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
  
  <script setup>

  
  const formData = ref({
    numarOP: '',
    dataOP: '',
    valoarePlata: null,
    detalii: '',
    artBug: '',
    codAngajament: '',
    indicator: '',
    disponibil:0
  })
  
  const onSubmit = async () => {
    try {
      // Handle form submission here
      console.log('Form data:', formData.value)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  
  const resetForm = () => {
    formData.value = {
      numarOP: '',
      dataOP: '',
      valoarePlata: null,
      detalii: '',
      artBug: '',
      codAngajament: '',
      indicator: ''
    }
  }
  </script>
  
  <style scoped>
  .payment-form {
    margin: 20px auto;
  }
  </style>