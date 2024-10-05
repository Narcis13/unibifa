<template>
  <div>
<q-btn :label="utilizatorStore.text"></q-btn>
  </div>
</template>
<script setup>
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
const utilizatorStore = useUtilizatorStore()
const label='Bafta!!'
</script>
