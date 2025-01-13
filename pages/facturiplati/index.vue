<template>
<q-page padding class=" column items-center justify-start q-gutter-md ">

  <div class=" q-gutter-y-md" style="width: 1400px">
    <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="facturi" label="Facturi primite" />
          <q-tab name="plati" label="Registru plati" />
       
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="facturi">
            <FacturiPlati />
          </q-tab-panel>

          <q-tab-panel name="plati">
            <div class="q-ml-md text-h6">Registru plati</div>
           <PlatiTabel />
          </q-tab-panel>


        </q-tab-panels>
  </div>

</q-page>

</template>

<script setup>


const tab =ref('facturi')
</script>