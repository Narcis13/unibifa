<template>
    <q-card class="q-pa-md" style="min-width: 400px;">
      <q-card-section>
        <div class="text-h6">Modifica furnizor</div>
      </q-card-section>
  
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.denumire"
            label="Denumire"
           
            outlined
          />
  

          <q-input
            v-model="form.codfiscal"
            label="Cod fiscal"
            error-message="Cod fiscal invalid"
            :error="!cuiValid"
            bottom-slots
            outlined
          />
          <q-input
            v-model="form.iban"
            label="Cont IBAN"
            error-message="Cont IBAN invalid"
            :error="!ibanCorect"
            bottom-slots
            outlined
          />

  
          <q-select
            v-model="form.stare"
            :options="['activ', 'inactiv']"
            label="Stare"
            :rules="[val => !!val || 'Status is required']"
            outlined
          />
  
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Abandon"
              color="grey"
              @click="$emit('cancel')"
              flat
            />
            <q-btn
             :disable="!cuiValid || !ibanCorect"
              type="submit"
              label="Modifica"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </template>
  
  <script setup>
  import { useQuasar } from 'quasar'
  import useValidare  from '~/composables/useValidare';
  const $q = useQuasar()
  
  const props = defineProps({
    furnizor: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  // Form state
  const form = ref({
    id: props.furnizor.id,
    denumire: props.furnizor.denumire,
    codfiscal: props.furnizor.codfiscal,
    iban: props.furnizor.iban, 
    stare: 'activ'
  })
  
 
  const {ibanValid, codfiscalValid} = useValidare()
  const cuiValid = computed(() => {
    return codfiscalValid(form.value.codfiscal)
  })

  const ibanCorect = computed(() => {
    return ibanValid(form.value.iban)
  })
  

  const onSubmit = async () => {
    try {
      const { data } = await useFetch(`/api/furnizori/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
  
      $q.notify({
        color: 'positive',
        message: 'Furnizor modificat cu succes',
        icon: 'check'
      })
  
      emit('save', data.value)
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Eroare la modificarea furnizorului',
        icon: 'warning'
      })
    }
  }
  
  // Load reference data on mount
  onMounted(() => {
   // fetchReferenceData()
  })
  </script>