<script setup>
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';


const utilizatorStore = useUtilizatorStore();




function executa(link){
 // console.log('executa',link)
  navigateTo(link.ruta)
}

const  links_administrare= [
    { icon: 'home', text: 'Surse finantare' ,ruta:'/nomenclatoare/sursefinantare'},
    { icon: 'whatshot', text: 'Articole bugetare', ruta:'/nomenclatoare/articolebugetare' },
    { icon: 'subscriptions', text: 'Compartimente',ruta:'/nomenclatoare/compartimente' },
    { icon: 'thumb_up_alt', text: 'Categorii',ruta:'/neimplementat' },
    { icon: 'restore', text: 'Utilizatori',ruta:'/neimplementat' }
  ]

  
  const   links_operatiuni= [
    { icon: 'folder', text: 'Buget',ruta:'/neimplementat' },
    { icon: 'restore', text: 'Furnizori',ruta:'/neimplementat'  },
    { icon: 'watch_later', text: 'Angajamente',ruta:'/neimplementat' },
    { icon: 'thumb_up_alt', text: 'Lichidari/receptii',ruta:'/neimplementat'  },
    { icon: 'thumb_up_alt', text: 'Ordonantari plata',ruta:'/neimplementat'  },
    { icon: 'thumb_up_alt', text: 'Plati',ruta:'/neimplementat'  },
    { icon: 'thumb_up_alt', text: 'Registru vize CFPP',ruta:'/neimplementat'  },

  ] 

const    buttons1=[
    { text: 'About' },
    { text: 'Press' },
    { text: 'Copyright' },
    { text: 'Contact us' },
    { text: 'Creators' },
    { text: 'Advertise' },
    { text: 'Developers' }
  ]


</script>

<template>
        <q-scroll-area class="fit">
          <UtilizatorCard denumire="FIRMA" cui="123456"/>
          <q-list padding>

            <q-item-label v-show="utilizatorStore.eAdmin" header class="text-weight-bold text-uppercase">
                  Administrare
            </q-item-label>

            <q-item  v-show="utilizatorStore.eAdmin" v-for="link in links_administrare" :key="link.text" v-ripple clickable @click="executa(link)">
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>
  
            <q-separator v-show="utilizatorStore.eAdmin" class="q-my-md" />
             <q-item-label header class="text-weight-bold text-uppercase">
                  Operatiuni
            </q-item-label>
    <!--        <q-item v-for="link in links2" :key="link.text" v-ripple clickable  @click="executa(link)">
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item> -->
            <q-expansion-item group="somegroup" icon="edit_calendar" label="ALOP" header-class="text-weight-bold text-uppercase">
            <q-card>
              <q-card-section>

                <q-item class="text-weight-bold text-uppercase" v-for="link in links_operatiuni" :key="link.text" v-ripple clickable  @click="executa(link)">
                    <q-item-section avatar>
                      <q-icon color="grey" :name="link.icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ link.text }}</q-item-label>
                    </q-item-section>
            </q-item>

              </q-card-section>
            </q-card>
          </q-expansion-item>
  
            <q-separator class="q-mt-md q-mb-xs" />
  
            
  
     
  
            <div class="q-px-md text-grey-9">
              <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
                <a
                  v-for="button in buttons1"
                  :key="button.text"
                  class="YL__drawer-footer-link"
                  href="javascript:void(0)"
                >
                  {{ button.text }}
                </a>
              </div>
            </div>
 
          </q-list>
        </q-scroll-area>
</template>
<style>
 
  
.YL__drawer-footer-link{
  color: inherit;
text-decoration: none;
font-weight: 500;
font-size: .75rem;
}


.YL__drawer-footer-link:hover {
  color: #000;
}
  
</style>