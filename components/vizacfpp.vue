<template>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Adaugă Viză CFPP - {{ tipDocument }}</div>
      </q-card-section>
  
      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="formData.numar"
            label="Număr viză"
            :rules="[val => !!val || 'Câmpul este obligatoriu']"
          />
          <q-input
            v-model="formData.data"
            label="Data viză"
            type="date"
            :rules="[val => !!val || 'Câmpul este obligatoriu']"
          />
          <q-input
            v-model="formData.observatii"
            label="Observații"
            type="textarea"
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
    numar: string
    data: string
    observatii: string
  }
  
  interface Props {
    tipDocument: string
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
    numar: '',
    data: '',
    observatii: ''
  })
  
  // Form handlers
  const onSubmit = () => {
    emit('submit', formData.value)
  }
  
  const onCancel = () => {
    emit('cancel')
  }
  </script>