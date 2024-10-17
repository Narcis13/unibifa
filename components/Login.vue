
<script setup>
import { useQuasar } from 'quasar'
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';


const utilizatorStore = useUtilizatorStore();

let name=ref('')
let password=ref('')
const $q = useQuasar()

async function login(){

    let response=  await $fetch("api/auth/login", {
        method: "POST",
        headers: {
         
        },
        body: {
          name:name.value,
          password:password.value,
         
        },
      });

      console.log('Raspuns autentificare',response)
    if(response.status==='success'){

        navigateTo("./dashboard")
    }
    else {
        $q.notify({
          type: 'negative',
          position:'top',
      
          message: 'Autentificare esuata!'
        })
    }
} 

</script>



<template>
   <div class="flex flex-center q-pa-md">

            <div class="q-gutter-y-md column " style="max-width: 400px">
                <h5>Autentificare</h5>
                <q-input v-model="name" clearable filled color="purple-12"  label="Utilizator" />
                <q-input v-model="password" clearable filled color="purple-12"  label="Parola"  type="password" />
                
                <q-btn color="primary" label="Autentificare !"  @click="login"/>

               
            </div>

    </div>

  
</template>
<style>

.doc-link {
    color: #a3090e;
    text-decoration: none;
    border-bottom: 1px dotted currentColor;
    outline: 0;
    transition: color .28s ease-in-out;
}
</style>