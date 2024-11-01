<template>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Adaugă Viză CFPP - {{ tipDocument }}</div>
      </q-card-section>
  
      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-md">
           <div>
               <div class="text-subtitle1">Compartiment: {{ formData.compartiment }}</div>
               <div class="text-subtitle1">Document: {{ formData.document }}</div>
               <div class="text-subtitle1">Viza CFPP: {{ formData.nrvizac }}</div>
           </div>
          <q-input
            v-model="formData.codang"
            label="Cod angajament"
            type="textarea"
          />
          <q-input
            v-model="formData.indicator"
            label="Indicator angajament"
    
          />
          <div class="row justify-end q-gutter-sm">
            <q-btn label="Anulează" color="negative" @click="onCancel" />
            <q-btn label="Salvează" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </template>
  
  <script setup lang="ts">
  //import { defineProps,defineEmits } from 'vue';
  interface VizaFormData {
    userid: number,
    nume: string,
    nrviza: string,
    nrvizac:string,
    dataviza:Date,
    document:string,
    explicatii:string,
    compartiment:string,
    codang:string,
    indicator:string,
    valoare:number
  }
  
  interface Props {
    tipDocument: string,
    vizadata: VizaFormData
  }
  
  // Define props
  const props = defineProps<Props>()
  
  // Define emits
  const emit = defineEmits<{
    (e: 'submit', data: VizaFormData): void
    (e: 'cancel'): void
  }>()
  
  // Form data
  const formData = ref<VizaFormData>({
    ...props.vizadata
  })
  
  // Form handlers
  const onSubmit = () => {
    emit('submit', formData.value)
  }
  
  const onCancel = () => {
    emit('cancel')
  }
  </script>