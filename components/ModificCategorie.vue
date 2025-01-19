<template>
    <q-card class="q-pa-md" style="min-width: 400px;">
      <q-card-section>
        <div class="text-h6">Modifica categorie</div>
      </q-card-section>
  
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.denumire"
            label="Denumire"
            :rules="[val => !!val || 'Denumire is required']"
            outlined
          />
  
          <q-input
            v-model="form.explicatii"
            type="textarea"
            label="Explicatii"
            :rules="[val => !!val || 'Explicatii is required']"
            outlined
          />
  
          <!-- <q-select
            v-model="form.idsursa"
            :options="surseFinantare"
            label="Sursa Finantare"
            option-value="id"
            option-label="denumire"
            :rules="[val => !!val || 'Sursa finantare is required']"
            outlined
          />
  
          <q-select
            v-model="form.idarticol"
            :options="articoleBugetare"
            label="Articol Bugetar"
            option-value="id"
            option-label="denumire"
            :rules="[val => !!val || 'Articol bugetar is required']"
            outlined
          />
  
          <q-select
            v-model="form.idcompartiment"
            :options="compartimente"
            label="Compartiment"
            option-value="id"
            option-label="denumire"
            :rules="[val => !!val || 'Compartiment is required']"
            outlined
          /> -->
  
          <q-select
            v-model="form.stare"
            :options="['activ', 'inactiv']"
            label="Stare"
            :rules="[val => !!val || 'Status is required']"
            outlined
          />
  
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Abnadon"
              color="grey"
              @click="$emit('cancel')"
              flat
            />
            <q-btn
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
  
  const $q = useQuasar()
  
  const props = defineProps({
    categoria: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  // Form state
  const form = ref({
    id: props.categoria.id,
    denumire: props.categoria.denumire,
    explicatii: props.categoria.explicatii,
    idsursa: props.categoria.idsursa,
    idarticol: props.categoria.idarticol,
    idcompartiment: props.categoria.idcompartiment,
    stare: props.categoria.stare
  })
  
 
  const surseFinantare = ref([])
  const articoleBugetare = ref([])
  const compartimente = ref([])
  

  const fetchReferenceData = async () => {
    try {
      const [surseRes, articoleRes, compartimenteRes] = await Promise.all([
        useFetch('/api/sursefinantare'),
        useFetch('/api/articolebugetare'),
        useFetch('/api/compartimente')
      ])
  
      surseFinantare.value = surseRes.data.value
      articoleBugetare.value = articoleRes.data.value
      compartimente.value = compartimenteRes.data.value
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Failed to load reference data',
        icon: 'warning'
      })
    }
  }
  

  const onSubmit = async () => {
    try {
      const { data } = await useFetch(`/api/categorii/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
  
      $q.notify({
        color: 'positive',
        message: 'Categoria modificata cu succes',
        icon: 'check'
      })
  
      emit('save', data.value)
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Eroare la modificarea categoriei',
        icon: 'warning'
      })
    }
  }
  
  // Load reference data on mount
  onMounted(() => {
   // fetchReferenceData()
  })
  </script>