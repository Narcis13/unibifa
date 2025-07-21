<template>
  <div class="report-container">
    <div class="report-header">
      <div class="institution-info">
        <h3>{{ institutie?.denumire || 'INSTITUȚIA' }}</h3>
        <p>{{ institutie?.adresa || '' }}</p>
        <p>CUI: {{ institutie?.cui || '' }}</p>
      </div>
      
      <div class="report-title">
        <h2>REGISTRU VIZE DE CONTROL FINANCIAR PREVENTIV</h2>
        <p class="period">Perioada: {{ formatDate(dataInceput) }} - {{ formatDate(dataSfarsit) }}</p>
      </div>
    </div>

    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 80px">Nr. viză</th>
          <th style="width: 100px">Data viză</th>
          <th style="width: 150px">Document</th>
          <th style="width: 300px">Explicații</th>
          <th style="width: 150px">Compartiment</th>
          <th style="width: 120px" class="text-right">Valoare (lei)</th>
          <th style="width: 150px">Utilizator</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in registruData" :key="row.id">
          <td>{{ row.nrvizac }}</td>
          <td class="text-center">{{ formatDate(row.dataviza) }}</td>
          <td>{{ row.document }}</td>
          <td>{{ row.explicatii }}</td>
          <td>{{ row.compartiment }}</td>
          <td class="text-right">{{ formatAmount(row.valoare) }}</td>
          <td>{{ row.nume }}</td>
        </tr>
        
        <tr v-if="registruData.length === 0">
          <td colspan="7" class="text-center">Nu există înregistrări în perioada selectată</td>
        </tr>
      </tbody>
    </table>

    <div class="report-footer">
      <div class="signatures">
        <div class="signature-box">
          <p>Întocmit,</p>
          <p class="signature-line">_____________________</p>
        </div>
        <div class="signature-box">
          <p>Verificat,</p>
          <p class="signature-line">_____________________</p>
        </div>
        <div class="signature-box">
          <p>Aprobat,</p>
          <p class="signature-line">_____________________</p>
        </div>
      </div>
      <div class="print-date">
        Data tipăririi: {{ formatDate(new Date()) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'

definePageMeta({
  layout: 'rapoarte'
})

const route = useRoute()
const dataInceput = route.query.dataInceput
const dataSfarsit = route.query.dataSfarsit

const institutie = await $fetch('/api/info/institutie')
const response = await $fetch('/api/registruvize', {
  params: {
    dataInceput,
    dataSfarsit
  }
})

const registruData = response.data || []

const formatDate = (dateString) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'dd.MM.yyyy', { locale: ro })
}

const formatAmount = (value) => {
  if (!value) return '0,00'
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<style scoped>
@page {
  size: A4 landscape;
  margin: 10mm;
}

.report-container {
  width: 100%;
  max-width: 297mm;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  background: white;
}

.report-header {
  margin-bottom: 30px;
}

.institution-info {
  text-align: center;
  margin-bottom: 20px;
}

.institution-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.institution-info p {
  margin: 2px 0;
  font-size: 12px;
}

.report-title {
  text-align: center;
}

.report-title h2 {
  margin: 10px 0;
  font-size: 18px;
  font-weight: bold;
}

.period {
  font-size: 14px;
  margin: 5px 0;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.report-table th,
.report-table td {
  border: 1px solid #000;
  padding: 5px;
  text-align: left;
}

.report-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: center;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}


.report-footer {
  margin-top: 50px;
}

.signatures {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.signature-box {
  text-align: center;
  width: 200px;
}

.signature-line {
  margin-top: 40px;
  border-bottom: 1px solid #000;
  display: inline-block;
  width: 150px;
}

.print-date {
  text-align: right;
  font-size: 10px;
  color: #666;
  margin-top: 20px;
}

@media print {
  .report-container {
    margin: 0;
    padding: 0;
  }
  
  .report-table {
    page-break-inside: auto;
  }
  
  .report-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  
  .report-footer {
    page-break-inside: avoid;
  }
}
</style>