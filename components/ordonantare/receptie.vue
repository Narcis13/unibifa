<template>
    <q-table
      :rows="receptii"
      :columns="columns"
      row-key="id"
      hide-pagination
      dense
      flat
      bordered
    />
  </template>
  
  <script setup lang="ts">
  import { QTableColumn } from 'quasar'
  
  interface Receptie {
    id: number
    nrfact: string
    datafact: string
    valoare: number
    compartiment: string
    angajament: {
      categorie: {
        id: number
        denumire: string
      }
      descriere: string
      numar: string
    }
  }
  console.log('ordonantare receptie setup')
  const props = defineProps({
        receptii: {
            type: Array as PropType<Receptie[]>,
            required: true
        },
        furnizor: {
            type: String,
            default: ''
        }
  })
  function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ro-RO')
}
  const columns: QTableColumn[] = [
    {
      name: 'furnizor',
      label: 'Furnizor',
      align: 'left',
      field: row => props.furnizor
    },
    {
      name: 'nrfact',
      label: 'Nr. fact.',
      field: 'nrfact',
      align: 'left'
    },
    {
      name: 'datafact',
      label: 'Data fact.',
      field: row=> formatDate(row.datafact),
      align: 'left'
    },
    {
      name: 'detalii',
      label: 'Detalii',
      field: row => row.angajament.descriere,
      align: 'left'
    },
    {
      name: 'valoare',
      label: 'Valoare',
      field: 'valoare',
      align: 'right'
    }
  ]
  </script>