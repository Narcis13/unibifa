<script setup>





function executa(link){
  console.log('executa',link)
  navigateTo(link.ruta)
}

const  links1= [
    { icon: 'home', text: 'Clienti' ,ruta:'/nomenclatoare/client'},
    { icon: 'whatshot', text: 'Furnizori', ruta:'/nomenclatoare/furnizor' },
    { icon: 'subscriptions', text: 'Produse / servicii',ruta:'/nomenclatoare/produs' },
    { icon: 'thumb_up_alt', text: 'Serii documente',ruta:'/nomenclatoare/serie' },
    { icon: 'restore', text: 'Gestiuni',ruta:'/nomenclatoare/gestiune' }
  ]
const   links2= [
    { icon: 'folder', text: 'Facturi emise',ruta:'../client/femise' },
    { icon: 'restore', text: 'Facturi primite' },
    { icon: 'watch_later', text: 'Plati / Incasari' },
    { icon: 'thumb_up_alt', text: 'Alte operatiuni' }
  ]
  const   linksfe= [
    { icon: 'folder', text: 'Facturi fiscale',ruta:'/client/femise/fiscala' },
    { icon: 'restore', text: 'Facturi proforma',ruta:'/client/femise/proforma'  },
    { icon: 'watch_later', text: 'Avize',ruta:'/client/femise/avize' },
    { icon: 'thumb_up_alt', text: 'Facturi recurente',ruta:'/client/femise/recurente'  }
  ] 
const    links3= [
    { icon: 'local_movies', text: 'YouTube Premium' },
    { icon: 'local_movies', text: 'Movies & Shows' },
    { icon: 'videogame_asset', text: 'Gaming' },
    { icon: 'live_tv', text: 'Live' }
  ]
const     links4= [
   // { icon: 'settings', text: 'Settings' },
  //  { icon: 'flag', text: 'Report history' },
  //  { icon: 'help', text: 'Help' },
  //  { icon: 'feedback', text: 'Send feedback' }
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
const   buttons2= [
    { text: 'Terms' },
    { text: 'Privacy' },
    { text: 'Policy & Safety' },
    { text: 'Test new features' }
  ]

</script>

<template>
        <q-scroll-area class="fit">
          <UtilizatorCard denumire="FIRMA" cui="123456"/>
          <q-list padding>

            <q-item-label header class="text-weight-bold text-uppercase">
                  Nomenclatoare
            </q-item-label>

            <q-item v-for="link in links1" :key="link.text" v-ripple clickable @click="executa(link)">
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>
  
            <q-separator class="q-my-md" />
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
            <q-expansion-item group="somegroup" icon="edit_calendar" label="Facturi emise" header-class="text-weight-bold text-uppercase">
            <q-card>
              <q-card-section>

                <q-item v-for="link in linksfe" :key="link.text" v-ripple clickable  @click="executa(link)">
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
            <div class="q-py-md q-px-md text-grey-9">
              <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
                <a
                  v-for="button in buttons2"
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