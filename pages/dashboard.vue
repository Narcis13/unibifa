<script setup>
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
const utilizatorStore = useUtilizatorStore();

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