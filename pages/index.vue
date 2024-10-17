<script setup>
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
const utilizatorStore = useUtilizatorStore()

if(utilizatorStore.eAutentificat){
  navigateTo("./dashboard")
}
else
{
    navigateTo("./autentificare")
}
</script>


<template>
    <div>
        INDEX
    </div>
</template>