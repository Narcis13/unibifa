
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

     
    if(response.status==='success'){

      const detaliiUser= await $fetch("/api/auth/user/"+response.data.name)
      const institutie= await $fetch("/api/auth/institutie")
     // console.log('Raspuns autentificare',response,detaliiUser)
      if(detaliiUser.status==='success'&&institutie.status==='success'&&institutie.data.institutie.length==1) {
        utilizatorStore.autentificare(detaliiUser.data.details)
        utilizatorStore.asigneazaInstitutie(institutie.data.institutie[0])
        navigateTo("./dashboard")
      }
      else
      $q.notify({
          type: 'negative',
          position:'top',
      
          message: 'Server Error!'
        })
        
    }
    else {
      name.value=""
      password.value=""
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