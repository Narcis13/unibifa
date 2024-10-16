<script setup>
defineProps({
  denumire:String,
  cui:String,
  administrator:String
})
</script>
<template>
<q-card class=" bg-indigo text-white">
    <q-card-section>
      <div class="text-h6">{{ denumire }}</div>
      <div class="text-subtitle2">Cod fiscal: {{ cui }}</div>
    </q-card-section>

    <q-card-section>
    Administrator: {{ administrator? administrator:'Nedefinit' }}
    </q-card-section>

    <q-separator dark />

    <q-card-actions>
      <q-btn flat @click="navigateTo('/client/actualizeazadate')">Actualizeaza</q-btn>
    
    </q-card-actions>
  </q-card>
</template>
