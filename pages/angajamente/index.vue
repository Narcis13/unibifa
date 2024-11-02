<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">Angajamente Legale</div>
            <q-space />
            <q-btn
              color="primary"
              icon="add"
              label="Angajament Nou"
              @click="showAddDialog = true"
            />
          </q-card-section>

          <q-card-section>
            <q-table
              :rows="angajamente"
              :columns="columns"
              row-key="id"
              :loading="loading"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template #body-cell-suma="props">
                <q-td :props="props">
                  {{ calculateTotalSum(props.row.modificari) }}
                </q-td>
              </template>
              <template #body-cell-actiuni="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    @click="openModificareDialog(props.row)"
                  >
                    <q-tooltip>Modifică suma</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="info"
                    icon="history"
                    @click="showIstoric(props.row)"
                  >
                    <q-tooltip>Istoric modificări</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Replace the old visa dialog with this -->
  <q-dialog v-model="showVizaDialog" persistent>
    <vizacfpp
      tip-document="angajament"
      :vizadata="vizaData"
      @cancel="showVizaDialog = false"
      @submit="vizeazaCFPP"
  
    />
  </q-dialog>

    <!-- Dialog pentru adăugare angajament nou -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Angajament Nou</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmitAdd" class="q-gutter-md">
            <q-select
              v-model="newAngajament.idCategorie"
              :options="categoriiOptions"
              label="Categorie"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              @update:model-value="categorieSelectata"
              :rules="[val => !!val || 'Câmpul este obligatoriu']"
            />
           <div v-if="infoVizibil" class="">
              <div class="row items-center">
                <div>Buget total:</div><q-space /><div>{{ situatieBuget.sumaBuget }} lei</div>
              </div>
              
              <div class="row items-center">
                <div>Buget disponibil:</div><q-space /><div>{{ situatieBuget.disponibilBugetar }} lei</div>
              </div>
           </div>
            <q-input
              v-model="newAngajament.descriere"
              label="Descriere"
              type="textarea"
              :rules="[val => !!val || 'Câmpul este obligatoriu']"
            />

            <q-input
              v-model.number="newAngajament.suma"
              label="Suma"
              type="number"
              :rules="[
                val => !!val || 'Câmpul este obligatoriu',
                val => val > 0 || 'Suma trebuie să fie pozitivă'
              ]"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Anulează" color="negative" @click="reset" v-close-popup />
              <q-btn label="Salvează" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog pentru modificare sumă -->
       <!-- Dialog pentru istoric modificări - Updated -->
       <q-dialog v-model="showIstoricDialog">
          <q-card style="min-width: 800px">
            <q-card-section>
              <div class="text-h6">Istoric Modificări</div>
            </q-card-section>

            <q-card-section>
              <q-table
                :rows="selectedAngajament?.modificari || []"
                :columns="modificariColumns"
                row-key="id"
                :pagination="{ rowsPerPage: 5 }"
              >
                <template #body-cell-actiuni="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="verified"
                      @click="handleVizaCFPP(props.row)"
                    >
                      <q-tooltip>Viză CFPP</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="info"
                      icon="print"
                      @click="handlePrint(props.row)"
                    >
                      <q-tooltip>Printează</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Închide" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAngajamente } from '~/composables/useAngajamente'
import {useVizaCFPP} from '~/composables/useVizaCFPP'
import { useUtilizatorStore } from '~/stores/useUtilizatorStore'
import type { Angajament, ModificareAngajament } from '~/types/angajamente'
import type { CreateVizaCFPPDTO } from "~/types/vizecfpp"
const $q = useQuasar()
const { angajamente, categoriiOptions, loading, fetchAngajamente, fetchCategoriiByCompartiment, createAngajament, addModificare, validateDisponibil, categorieSelectata, infoVizibil , situatieBuget} = useAngajamente()
const {vizaUrmatoare,createVizaCFPP,aplicaVizaCFPPAngajament} = useVizaCFPP()

const columns = [
  {
    name: 'numar',
    label: 'Număr',
    field: 'numar',
    align: 'left',
  },
  {
    name: 'data',
    label: 'Data',
    field: 'data',
    format: (val: string) => new Date(val).toLocaleDateString(),
    align: 'left',
  },
  {
    name: 'categorie',
    label: 'Categorie',
    field: (row: Angajament) => row.categorie?.denumire,
    align: 'left',
  },
  {
    name: 'compartiment',
    label: 'Compartiment',
    field: (row: Angajament) => row.compartiment?.denumire,
    align: 'left',
  },
  {
    name: 'descriere',
    label: 'Descriere',
    field: 'descriere',
    align: 'left',
  },
  {
    name: 'suma',
    label: 'Suma Totală',
    field: 'suma',
    align: 'right',
  },
  {
    name: 'actiuni',
    label: 'Acțiuni',
    field: 'actiuni',
    align: 'center',
  },
]

const modificariColumns = [
  {
    name: 'created_at',
    label: 'Data',
    field: 'created_at',
    format: (val: string) => new Date(val).toLocaleDateString(),
  },
  {
    name: 'tipModificare',
    label: 'Tip',
    field: 'tipModificare',
  },
  {
    name: 'suma',
    label: 'Sumă',
    field: 'suma',
    format: (val: number) => val.toLocaleString('ro-RO'),
  },
  {
    name: 'motiv',
    label: 'Motiv',
    field: 'motiv',
  },
  {
    name: 'user',
    label: 'Utilizator',
    field: (row: any) => row.user?.name,
  },
  {
    name: 'actiuni',
    label: 'Acțiuni',
    field: 'actiuni',
    align: 'center',
  },
]

// State pentru dialoguri

const showAddDialog = ref(false)
const showVizaDialog = ref(false)
const showModificareDialog = ref(false)
const showIstoricDialog = ref(false)
const selectedAngajament = ref<Angajament | null>(null)
const selectedModificare = ref<ModificareAngajament | null>(null)

// State pentru formulare
const newAngajament = ref({
  idCategorie: null as number | null,
  descriere: '',
  suma: 0,
  exercitiuBugetar: new Date().getFullYear(),
  idCompartiment: 0, // Se va seta din user context
})

const modificare = ref({
  tipModificare: 'MAJORARE' as 'MAJORARE' | 'DIMINUARE',
  suma: 0,
  motiv: '',
})


const vizaData = ref({
  userid: 0,
  nume: '',
  nrviza: '',
  nrvizac:'',
  dataviza:new Date(),
  document:'',
  explicatii:'',
  compartiment:'',
  codang:'',
  indicator:'',
  valoare:0
})

const vizeazaCFPP = async (dataviza:CreateVizaCFPPDTO)=>{
 // console.log('Vizez',dataviza)

  try {
    const viza = await createVizaCFPP(dataviza)
    await aplicaVizaCFPPAngajament(selectedModificare.value!.id,dataviza)
    showVizaDialog.value=false
  } catch (e){
    console.error(e)
  }
}

function reset(){
  newAngajament.value.idCategorie=null
  infoVizibil.value=false
}
// Calculate total sum from modifications
const calculateTotalSum = (modificari: ModificareAngajament[] = []) => {
  const total = modificari.reduce((sum, mod) => {
    return Number(sum) + Number(mod.tipModificare === 'MAJORARE' ? mod.suma : -mod.suma)
  }, 0)
  return Number(total)//.toLocaleString('ro-RO')
}

// Action handlers
const handleVizaCFPP = async (modificare: ModificareAngajament) => {
  selectedModificare.value=modificare
  const userStore = useUtilizatorStore()
  const nrviza= await vizaUrmatoare()
  vizaData.value.document='Ang. legal nr. '+selectedAngajament.value!.numar
  vizaData.value.explicatii=selectedAngajament.value!.descriere
  vizaData.value.compartiment = selectedAngajament.value!.compartiment!.denumire + ' ' +modificare.user?.name
  vizaData.value.valoare=modificare.suma
  vizaData.value.nume=userStore.utilizator.first_name+' '+userStore.utilizator.last_name
  vizaData.value.userid=userStore.utilizator.id
  vizaData.value.nrviza=nrviza as string
  vizaData.value.nrvizac=userStore.utilizator.first_name.substr(0,1)+userStore.utilizator.last_name.substr(0,1)+'-'+nrviza
  vizaData.value.codang=selectedAngajament.value?.categorie?.articolBugetar.codang
  vizaData.value.indicator=selectedAngajament.value?.categorie?.articolBugetar.indicator

 // console.log('Modificare',modificare,selectedAngajament.value,vizaData.value)
  showVizaDialog.value=true
 // selectedModificare.value = modificare
 // showVizaDialog.value = true
}

const handlePrint = async (modificare: ModificareAngajament) => {
  /*try {
    // Example implementation - adjust based on your API
    const response = await fetch(`/api/modificari/${modificare.id}/print`, {
      method: 'POST',
    })
    
    if (!response.ok) throw new Error('Failed to generate print document')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `modificare-${modificare.id}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'negative',
      message: 'A apărut o eroare la generarea documentului',
    })
  }*/
}
// Handlers
const onSubmitAdd = async () => {
  try {
    const isValid = await validateDisponibil(
      newAngajament.value.idCategorie!,
      newAngajament.value.suma
    )
    
    if (!isValid) {
      $q.notify({
        color: 'negative',
        message: 'Nu există fonduri disponibile suficiente pentru această sumă',
      })
      return
    }

    await createAngajament(newAngajament.value)
    showAddDialog.value = false
    $q.notify({
      color: 'positive',
      message: 'Angajamentul a fost creat cu succes',
    })
    
    // Reset form
    newAngajament.value = {
      idCategorie: null,
      descriere: '',
      suma: 0,
      exercitiuBugetar: new Date().getFullYear(),
      idCompartiment: newAngajament.value.idCompartiment
    }
    
    // Refresh list
    await fetchAngajamente(new Date().getFullYear())
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'negative',
      message: 'A apărut o eroare la crearea angajamentului',
    })
  }
}

const openModificareDialog = (angajament: Angajament) => {
  selectedAngajament.value = angajament
  showModificareDialog.value = true
}

const onSubmitModificare = async () => {
  if (!selectedAngajament.value) return

  try {
    if (modificare.value.tipModificare === 'MAJORARE') {
      const isValid = await validateDisponibil(
        selectedAngajament.value.idCategorie,
        modificare.value.suma
      )
      
      if (!isValid) {
        $q.notify({
          color: 'negative',
          message: 'Nu există fonduri disponibile suficiente pentru această sumă',
        })
        return
      }
    }

    await addModificare(selectedAngajament.value.id, modificare.value)
    showModificareDialog.value = false
    $q.notify({
      color: 'positive',
      message: 'Modificarea a fost salvată cu succes',
    })
    
    // Reset form
    modificare.value = {
      tipModificare: 'MAJORARE',
      suma: 0,
      motiv: ''
    }
    
    // Refresh list
    await fetchAngajamente(new Date().getFullYear())
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'negative',
      message: 'A apărut o eroare la salvarea modificării',
    })
  }
}

const showIstoric = (angajament: Angajament) => {
  selectedAngajament.value = angajament
  showIstoricDialog.value = true
}

// Inițializare
onMounted(async () => {
  const userStore = useUtilizatorStore()
  newAngajament.value.idCompartiment = userStore.utilizator?.compartiment?.id || 0
  //console.log( userStore.utilizator?.compartiment?.id ,'compartiment id')
  // Fetch categorii for the user's compartiment
  if (newAngajament.value.idCompartiment) {
    await fetchCategoriiByCompartiment(newAngajament.value.idCompartiment)
  }
  
  await fetchAngajamente(new Date().getFullYear())
 // console.log(angajamente)
})
</script>
