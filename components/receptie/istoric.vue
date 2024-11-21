<template>
    <div class="receptii-component">
      <div class="text-center q-my-sm">
        <q-btn 
          label="Istoric"
          no-caps 
          color="primary" 
          :icon="isTableVisible ? 'visibility_off' : 'visibility'" 
          @click="toggleTableVisibility"
        />
      </div>
  
      <q-table
        v-if="isTableVisible"
        :rows="props.receptii"
        :columns="columns"
        row-key="id"
        dense
        flat
        bordered
      >
        <template v-slot:body-cell-furnizor="props">
          <q-td key="furnizor">
            {{ props.row.furnizor.denumire }}
          </q-td>
        </template>
      </q-table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { QTableColumn } from 'quasar'
  
  // Interface matching the Receptii structure
  interface Receptii {
    id: number;
    idAngajament: number;
    idFurnizor: number;
    idCompartiment: number;
    datafact: string | Date;
    valoare: number | string;
    mentiuni: string | null;
    nrfact?: string;
    stare: string;
    created_at: string | Date;
    updated_at: string | Date | null;
    furnizor: {
      id: number;
      denumire: string;
    };
  }
  
  // Component props definition
  interface Props {
    receptii: Receptii[]
  }
  
  // Receive props
  const props = defineProps<Props>()
  
  // State for table visibility
  const isTableVisible = ref(false)
  
  // Toggle table visibility
  const toggleTableVisibility = () => {
    isTableVisible.value = !isTableVisible.value
  }
  
  // Define columns for q-table
  const columns: QTableColumn[] = [
    {
      name: 'furnizor',
      required: true,
      label: 'Furnizor',
      align: 'left',
      field: (row: Receptii) => row.furnizor.denumire,
      sortable: true
    },
    {
      name: 'nrfact',
      align: 'left',
      label: 'Nr. Fact.',
      field: 'nrfact',
      sortable: true
    },
    {
      name: 'datafact',
      align: 'left',
      label: 'Data Fact.',
      field: 'datafact',
      sortable: true,
      format: (val: string | Date) => {
        // Format date if needed
        return val instanceof Date 
          ? val.toLocaleDateString() 
          : new Date(val).toLocaleDateString()
      }
    },
    {
      name: 'valoare',
      align: 'right',
      label: 'Valoare',
      field: 'valoare',
      sortable: true,
      format: (val: number | string) => {
        // Format value as currency
        return new Intl.NumberFormat('ro-RO', { 
          style: 'currency', 
          currency: 'RON' 
        }).format(Number(val))
      }
    }
  ]
  </script>
  
  <style scoped>
  .receptii-component {
    width: 100%;
  }
  </style>