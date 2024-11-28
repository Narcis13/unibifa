<script setup lang="ts">
import { useOrdonantari } from "~/composables/useOrdonantari";

const {fetchOrdonantari} = useOrdonantari()


const columns = [
  {
    name: 'numar',
    label: 'Număr',
    field: 'numar',
    align: 'left',
    sortable: true
  },
  {
    name: 'dataord',
    label: 'Data',
    field: 'dataord',
    align: 'left',
    sortable: true
  },
  {
    name: 'furnizor',
    label: 'Furnizor',
    field: 'furnizor_denumire',
    align: 'left',
    sortable: true
  },
  {
    name: 'valoare',
    label: 'Valoare',
    field: 'valoare',
    align: 'right',
    sortable: true
  },
  {
    name: 'stare',
    label: 'Stare',
    field: 'stare',
    align: 'left',
    sortable: true
  },
  {
    name: 'receptii',
    label: 'Recepții',
    field: 'receptii',
    align: 'left'
  }
]

// State
const ordonantari = ref([])
const loading = ref(false)
const selected = ref([])
const selectedRow = computed(() => selected.value[0])

// Fetch data
async function toateOrdonantarile() {
  loading.value = true
  try {
   
    ordonantari.value = await fetchOrdonantari()
  } catch (error) {
    console.error('Error fetching ordonantari:', error)
  } finally {
    loading.value = false
  }
}

// Utility functions
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ro-RO')
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Action handlers
function handleVizaCFPP() {
  if (!selectedRow.value) return
  // Implement CFPP visa logic here
  console.log('Applying CFPP visa for:', selectedRow.value)
}

function handlePrint() {
  if (!selectedRow.value) return
  // Implement print logic here
  console.log('Printing:', selectedRow.value)
}

// Lifecycle
onMounted(() => {
  toateOrdonantarile()
})
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Header with buttons -->
      <div class="row q-mb-md justify-between items-center">
        <div class="text-h6">Ordonanțări de Plată</div>
        <div>
          <q-btn
            color="primary"
            icon="check_circle"
            label="Viză CFPP"
            :disable="!selectedRow"
            class="q-mr-sm"
            @click="handleVizaCFPP"
          />
          <q-btn
            color="secondary"
            icon="print"
            label="Print"
            :disable="!selectedRow"
            @click="handlePrint"
          />
        </div>
      </div>

      <!-- Table -->
      <q-table
        :rows="ordonantari"
        :columns="columns"
        row-key="id"
        selection="single"
        v-model:selected="selected"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <!-- Custom column formatters -->
        <template v-slot:body-cell-dataord="props">
          <q-td :props="props">
            {{ formatDate(props.row.dataord) }}
          </q-td>
        </template>

        <template v-slot:body-cell-valoare="props">
          <q-td :props="props">
            {{ formatAmount(props.row.valoare) }}
          </q-td>
        </template>

        <template v-slot:body-cell-furnizor="props">
          <q-td :props="props">
            {{ props.row.furnizor_denumire }}
          </q-td>
        </template>

        <!-- Expand slot for showing receptii details -->
        <template v-slot:body-cell-receptii="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="props.expand = !props.expand"
            />
          </q-td>
        </template>

        <template v-slot:expanded-item="props">
          <q-tr>
            <q-td colspan="100%">
              <div class="text-left">
                <div class="text-weight-bold q-mb-sm">Recepții:</div>
                <q-list dense>
                  <q-item v-for="receptie in props.row.receptii" :key="receptie.id">
                    <q-item-section>
                      <q-item-label>
                        Factură nr. {{ receptie.nrfact }} din {{ formatDate(receptie.datafact) }}
                        - {{ formatAmount(receptie.valoare) }} lei
                      </q-item-label>
                      <q-item-label caption>
                        Angajament: {{ receptie.angajament.numar }}
                        - {{ receptie.angajament.categorie.denumire }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style scoped>
.q-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%);
}
</style>