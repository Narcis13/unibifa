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
      data: string
      modificari_totale: number
    }
  }
  console.log('ordonantare angajament setup')
  const props = defineProps({
        receptii: {
            type: Array as PropType<Receptie[]>,
            required: true
        }
  })
  function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ro-RO')
}
  const columns: QTableColumn[] = [
    {
      name: 'angnr',
      label: 'Numar Ang.',
      align: 'left',
      field: row => row.angajament.numar
    },
    {
      name: 'dataang',
      label: 'Data Ang.',
      field: row => formatDate(row.angajament.data),
      align: 'left'
    },
    {
      name: 'detalii',
      label: 'Detalii',
      field: row => row.angajament.descriere,
      align: 'left'
    },
    {
      name: 'categorie',
      label: 'Categorie',
      field: row => row.angajament.categorie.denumire,
      align: 'left'
    },
    {
      name: 'sumaang',
      label: 'Suma totala',
      field: row => row.angajament.modificari_totale,
      align: 'right'
    }
  ]
  </script>