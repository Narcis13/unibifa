<template>
  <div class="q-pa-md">
    <div class="row q-mb-md q-pa-md items-center">
      <div class="col-4">
        <h1 class="text-h5">Surse de finantere / bugete</h1>
      </div>
      <div class="col-4">
        <q-select
          v-model="selectedSource"
          :options="sourceOptions"
          label="Sursa Finantare"
          outlined
          dense
          emit-value
          map-options
          option-value="id"
          option-label="denumire"
          clearable
          @update:model-value="onSourceChange"
        >
          <template v-slot:prepend>
            <q-icon name="account_balance" />
          </template>
        </q-select>
      </div>
      <div class="col-4 text-right">
        <q-input
          v-model="filter"
          placeholder="Cauta"
          dense
          outlined
          style="width: 200px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Error Alert -->
    <q-banner v-if="error" class="bg-negative text-white q-mb-md">
      {{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="Retry" @click="fetchBugete" />
      </template>
    </q-banner>

    <!-- Budget Table -->
    <q-table
      :rows="filteredBugete"
      :columns="visibleColumns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      :pagination="{ rowsPerPage: 10 }"
    >
      <!-- Loading Slot -->
      <template v-slot:loading>
        <q-inner-loading showing>
          <q-spinner-dots size="50px" color="primary" />
        </q-inner-loading>
      </template>
  <!-- Bottom Slot for Summary Row -->
      <template v-slot:bottom-row>
        <tr class="bg-grey-2">
          <td class="text-weight-bold">Total</td>
          <td></td>
          <td></td>
          <td class="text-right text-weight-bold">{{ formatCurrency(summaryTotals.trimI) }}</td>
          <td class="text-right text-weight-bold">{{ formatCurrency(summaryTotals.trimII) }}</td>
          <td class="text-right text-weight-bold">{{ formatCurrency(summaryTotals.trimIII) }}</td>
          <td class="text-right text-weight-bold">{{ formatCurrency(summaryTotals.trimIV) }}</td>
          <td class="text-right text-weight-bold">{{ formatCurrency(summaryTotals.total) }}</td>
          <td v-if="isCFPPUser"></td>
        </tr>
      </template>
      <!-- Custom Column Slots -->
      <template v-slot:body-cell-total="props">
        <q-td :props="props">
          <span>{{ props.value }}</span>
        </q-td>
      </template>

      <!-- Actions Column -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>Editare Buget</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="handleDelete(props.row.id)"
            >
              <q-tooltip>Informatii suplimentare</q-tooltip>
            </q-btn>
          </q-btn-group>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Actualizare linie buget</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <!-- Display readonly information -->
            <div class="text-subtitle2">{{ selectedBudget?.sursaFinantare?.denumire }}</div>
            <div class="text-subtitle2">{{ selectedBudget?.articolBugetar?.cod }} - {{ selectedBudget?.articolBugetar?.denumire }}</div>

            <!-- Quarterly inputs -->
            <div class="row q-col-gutter-md q-pa-md">
              <div class="col-6 ">
                <q-input
                  v-model.number="form.trimI"
                  type="number"
                  label="Trimestrul I"
                  :rules="[
                    val => val >= 0 || 'Value must be positive',
                    val => !isNaN(val) || 'Please enter a valid number'
                  ]"
                  filled
                  step="1"
                  min="0"
                  @update:model-value="validateNumber('trimI')"
                >
                  <template v-slot:append>
                    <div class="text-grey">RON</div>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="form.trimII"
                  type="number"
                  label="Trimestrul II"
                  :rules="[
                    val => val >= 0 || 'Value must be positive',
                    val => !isNaN(val) || 'Please enter a valid number'
                  ]"
                  filled
                  step="1"
                  min="0"
                  @update:model-value="validateNumber('trimII')"
                >
                  <template v-slot:append>
                    <div class="text-grey">RON</div>
                  </template>
                </q-input>
              </div>
              <div class="col-6 ">
                <q-input
                  v-model.number="form.trimIII"
                  type="number"
                  label="Trimestrul III"
                  :rules="[
                    val => val >= 0 || 'Value must be positive',
                    val => !isNaN(val) || 'Please enter a valid number'
                  ]"
                  filled
                  step="1"
                  min="0"
                  @update:model-value="validateNumber('trimIII')"
                >
                  <template v-slot:append>
                    <div class="text-grey">RON</div>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="form.trimIV"
                  type="number"
                  label="Trimestrul IV"
                  :rules="[
                    val => val >= 0 || 'Value must be positive',
                    val => !isNaN(val) || 'Please enter a valid number'
                  ]"
                  filled
                  step="1"
                  min="0"
                  @update:model-value="validateNumber('trimIV')"
                >
                  <template v-slot:append>
                    <div class="text-grey">RON</div>
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Total (calculated automatically) -->
            <q-input
              v-model.number="totalAmount"
              type="number"
              label="Total"
              readonly
              filled
            >
              <template v-slot:append>
                <div class="text-grey">RON</div>
              </template>
            </q-input>

            <!-- Submit and Cancel buttons -->
            <div class="row justify-end q-gutter-sm">
              <q-btn label="Abandon" color="grey" v-close-popup />
              <q-btn 
                label="Salveaza" 
                type="submit" 
                color="primary"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Loading and Error handling -->
    <q-dialog v-model="showError">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="error" color="negative" text-color="white" />
          <span class="q-ml-sm">{{ errorMessage }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
//import { ref, computed } from 'vue'
import { useUtilizatorStore } from '~/stores/useUtilizatorStore';
import { useBugete } from '~/composables/useBugete'
import type { Buget } from '~/types/bugete'
import { useQuasar } from 'quasar'

interface FormState {
  trimI: number
  trimII: number
  trimIII: number
  trimIV: number
}
const utilizatorStore = useUtilizatorStore();
//console.log(utilizatorStore.utilizator?.role)
const { bugete, loading, error, fetchBugete } = useBugete()
const filter = ref('')
const selectedSource = ref(null)
const $q = useQuasar()
const isCFPPUser = computed(() => {
  return utilizatorStore.utilizator?.role === 'CFPP'
})
// Add computed property for summary totals
const summaryTotals = computed(() => {
  const totals = {
    trimI: 0,
    trimII: 0,
    trimIII: 0,
    trimIV: 0,
    total: 0
  }

  filteredBugete.value?.forEach(budget => {
    totals.trimI += Number(budget.trimI) || 0
    totals.trimII += Number(budget.trimII) || 0
    totals.trimIII += Number(budget.trimIII) || 0
    totals.trimIV += Number(budget.trimIV) || 0
    totals.total += Number(budget.total) || 0
  })

  return {
    trimI: Number(totals.trimI.toFixed(2)),
    trimII: Number(totals.trimII.toFixed(2)),
    trimIII: Number(totals.trimIII.toFixed(2)),
    trimIV: Number(totals.trimIV.toFixed(2)),
    total: Number(totals.total.toFixed(2))
  }
})


// Get unique sources for the dropdown
const sourceOptions = computed(() => {
  const sources = new Map()
  bugete.value?.forEach(budget => {
    const source = budget.sursaFinantare
    if (!sources.has(source.id)) {
      sources.set(source.id, source)
    }
  })
  return Array.from(sources.values())
})

// Filter budgets based on selected source
const filteredBugete = computed(() => {
  if (!selectedSource.value) {
    return bugete.value
  }
  return bugete.value?.filter(
    budget => budget.sursaFinantare.id === selectedSource.value
  )
})

const onSourceChange = () => {
  // Additional logic if needed when source changes
}

// Format currency helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON'
  }).format(value)
}

// Add these to your existing refs
const editDialog = ref(false)
const selectedBudget = ref<Buget | null>(null)
const saving = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const validateNumber = (field: keyof FormState) => {
  const value = form.value[field]
  if (isNaN(value) || value < 0) {
    form.value[field] = 0
  }
}

const form = ref<FormState>({
  trimI: 0,
  trimII: 0,
  trimIII: 0,
  trimIV: 0
})

// Compute total automatically
const totalAmount = computed(() => {
  const total = (
    Number(form.value.trimI || 0) +
    Number(form.value.trimII || 0) +
    Number(form.value.trimIII || 0) +
    Number(form.value.trimIV || 0)
  )
  return Number(total.toFixed(2))
})


// Handler functions
const handleEdit = (row: Buget) => {
  selectedBudget.value = row
  form.value = {
  trimI: Number(row.trimI),
  trimII: Number(row.trimII),
  trimIII: Number(row.trimIII),
  trimIV: Number(row.trimIV)
}
  editDialog.value = true
}

// Submit handler
const onSubmit = async () => {
  if (!selectedBudget.value) return

  try {
    saving.value = true
    const updatedBudget = {
      id: selectedBudget.value.id,
      trimI: Number(form.value.trimI),
      trimII: Number(form.value.trimII),
      trimIII: Number(form.value.trimIII),
      trimIV: Number(form.value.trimIV),
      total: totalAmount.value
    }

    // Make API call to update the budget
    await $fetch(`/api/bugete/${selectedBudget.value.id}`, {
      method: 'PUT',
      body: updatedBudget
    })

    // Refresh the table data
    await fetchBugete()
    
    // Close the dialog
    editDialog.value = false
    
    // Show success notification
    // If you're using Quasar Notify plugin:
    $q.notify({
      type: 'positive',
      message: 'Linie buget modificata cu succes!'
    })

  } catch (error) {
    errorMessage.value = 'Failed to update budget. Please try again.'
    showError.value = true
  } finally {
    saving.value = false
  }
}


const handleDelete = async (id: number) => {
  /* try {
    await $fetch(`/api/bugete/${id}`, {
      method: 'DELETE'
    })
    await fetchBugete()
  } catch (err) {
    console.error('Error deleting budget:', err)
  } */
}

// Define base columns
const baseColumns = [
  {
    name: 'sursaFinantare',
    label: 'Sursa Finantare',
    field: (row: Buget) => row.sursaFinantare.denumire,
    align: 'left',
    sortable: true
  },
  {
    name: 'articolBugetar',
    label: 'Articol Bugetar',
    field: (row: Buget) => row.articolBugetar.cod,
    align: 'left',
    sortable: true
  },
  {
    name: 'explicatii',
    label: 'Explicatii',
    field: (row: Buget) => row.articolBugetar.denumire,
    align: 'left',
  },
  {
    name: 'trimI',
    label: 'Trim I',
    field: 'trimI',
    format: formatCurrency,
    align: 'right',
    sortable: true
  },
  {
    name: 'trimII',
    label: 'Trim II',
    field: 'trimII',
    format: formatCurrency,
    align: 'right',
    sortable: true
  },
  {
    name: 'trimIII',
    label: 'Trim III',
    field: 'trimIII',
    format: formatCurrency,
    align: 'right',
    sortable: true
  },
  {
    name: 'trimIV',
    label: 'Trim IV',
    field: 'trimIV',
    format: formatCurrency,
    align: 'right',
    sortable: true
  },
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    format: formatCurrency,
    align: 'right',
    sortable: true
  }
]

// Actions column definition
const actionsColumn = {
  name: 'actions',
  label: 'Actiuni',
  field: 'actions',
  align: 'center',
}

// Computed property for visible columns
const visibleColumns = computed(() => {
  if (isCFPPUser.value) {
    return [...baseColumns, actionsColumn]
  }
  return baseColumns
})


// Fetch data on component mount
onMounted(() => {
  fetchBugete()
})
</script>

<style scoped>
.q-table__card {
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%);
}
</style>