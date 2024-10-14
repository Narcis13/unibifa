<template>
  <div>
<q-btn :label="utilizatorStore.text" @click="register"></q-btn>
  </div>
</template>
<script setup>
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
const utilizatorStore = useUtilizatorStore()
const label='Bafta!!'

async function register(){
  const response = await $fetch("/api/auth", {
    method: "POST",
    headers: {
      "client-platform": "browser",
    },
    body: {},
  });
  console.log(response)
}
</script>
