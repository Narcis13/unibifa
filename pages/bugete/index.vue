<template>
    <div class="q-pa-md">
      <div class="row q-mb-md">
        <div class="col-12">
          <h1 class="text-h4">Budget Management</h1>
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
        :rows="bugete"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        :pagination="{ rowsPerPage: 10 }"
      >
        <!-- Top Slot -->
        <template v-slot:top>
          <q-space />
          <q-input
            v-model="filter"
            placeholder="Search"
            dense
            outlined
            class="q-ml-md"
            style="width: 200px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
  
        <!-- Loading Slot -->
        <template v-slot:loading>
          <q-inner-loading showing>
            <q-spinner-dots size="50px" color="primary" />
          </q-inner-loading>
        </template>
  
        <!-- Custom Column Slots -->
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            <span :class="{'text-positive': props.value > 0, 'text-negative': props.value < 0}">
              {{ formatCurrency(props.value) }}
            </span>
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
                <q-tooltip>Edit Budget</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="handleDelete(props.row.id)"
              >
                <q-tooltip>Delete Budget</q-tooltip>
              </q-btn>
            </q-btn-group>
          </q-td>
        </template>
      </q-table>
    </div>
  </template>
  
  <script setup lang="ts">
import {useBugete} from '~/composables/useBugete'
import type { Buget } from '~/types/bugete';

  const { bugete, loading, error, fetchBugete } = useBugete()
  const filter = ref('')
  

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(value)
  }
  
  // Handler functions
  const handleEdit = (row: Buget) => {
    // Implement edit functionality
    console.log('Edit row:', row)
  }
  
  const handleDelete = async (id: number) => {
    try {
      await $fetch(`/api/bugete/${id}`, {
        method: 'DELETE'
      })
      await fetchBugete()
    } catch (err) {
      console.error('Error deleting budget:', err)
    }
  }
  
  // Table columns definition
  const columns = [
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
      field: (row: Buget) => row.articolBugetar.denumire,
      align: 'left',
      sortable: true
    },
    {
      name: 'explicatii',
      label: 'Explicatii',
      field: 'explicatii',
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
    },
    {
      name: 'actions',
      label: 'Actions',
      field: 'actions',
      align: 'center',
    }
  ]
  
  
  
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