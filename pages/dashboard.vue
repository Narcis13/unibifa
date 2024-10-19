<script setup>
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
import { useNomenclatoareStore } from '~/stores/useNomenclatoareStore';

const utilizatorStore = useUtilizatorStore();
const nomenclatoareStore=useNomenclatoareStore()


 
if(utilizatorStore.eAdmin){
    const surse =  await $fetch(`/api/nomenclatoare/sursefinantare`);
    nomenclatoareStore.baza.sursefinantare_index=[]
    surse.map(s=>{
        nomenclatoareStore.baza.sursefinantare_index.push(s)
    })

    const articole =  await $fetch(`/api/nomenclatoare/articolebugetare`);
    nomenclatoareStore.baza.articolebugetare_index=[]
    articole.map(a=>{
        nomenclatoareStore.baza.articolebugetare_index.push(a)
    })
} 
</script>

<template>
    <div class="flex flex-center q-mt-xl">
        <div class="column">
            <div v-if="utilizatorStore.institutie" class="q-pa-sm text-h6">
                <div>Institutie: {{ utilizatorStore.institutie.denumire }}</div>
                <div>Adresa: {{ utilizatorStore.institutie.adresa }}</div>
                <div>Cod fiscal: {{ utilizatorStore.institutie.cui }}</div>
                <div>Reprezentant legal: {{ utilizatorStore.institutie.reprezentant }}</div>
            </div>

        </div>
    </div>
</template>