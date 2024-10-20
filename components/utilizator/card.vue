<script setup>
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
import { useNomenclatoareStore } from '~/stores/useNomenclatoareStore';
defineProps({
  denumire:String,
  cui:String,
  administrator:String
})

const utilizatorStore = useUtilizatorStore();
const nomenclatoareStore = useNomenclatoareStore()
async function logout(){
  let response=  await $fetch("/api/auth/logout", {
        method: "POST"
      });
    if(response.status=='success'){
      utilizatorStore.logout()
      nomenclatoareStore.reset()
      navigateTo('/')
    }  
}
</script>
<template>
<q-card class=" bg-indigo text-white">
    <q-card-section>
      <div v-if="utilizatorStore.eAutentificat" class="text-h6"> {{ utilizatorStore.utilizator.first_name }} {{ utilizatorStore.utilizator.last_name }}</div>
      <div v-if="utilizatorStore.eAutentificat" class="text-h6">Rol: {{utilizatorStore.utilizator.role }}</div>
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle2">
        Administrator: {{ administrator? administrator:'Nedefinit' }}
      </div>
    
    </q-card-section>

    <q-separator dark />

    <q-card-actions class="flex flex-center">
      <q-btn flat @click="logout">Inchide sesiunea</q-btn>
    
    </q-card-actions>
  </q-card>
</template>
