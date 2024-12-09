<script setup >



const utilizatorStore = useUtilizatorStore();
definePageMeta({
    layout:'rapoarte'
})

const {idord}=useRoute().params
const { data} = await $fetch('/api/ordonantari/'+idord)
const institutie = await $fetch('/api/info/institutie')

// Utility functions
function formatDate(date) {
  return new Date(date).toLocaleDateString('ro-RO')
}

function formatAmount(amount) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
//console.log(institutie)
const ordonantare = data[0]
</script>
<template>
    <div class="page">
        <!-- Content remains the same as in previous version -->


        <!-- Rest of the content structure remains identical -->
        <div class="document-info">
        <div>
            <div>ROMANIA</div>
            <div>MINISTERUL APARARII NATIONALE</div>
            <div>{{ institutie.denumire }}</div>
        </div>
        <div>
            <div>Compartiment: {{ ordonantare.compartiment }}</div>
            <div>Numar: {{ ordonantare.numar }}</div>
            <div>Data emiterii: {{ formatDate(ordonantare.dataord) }}</div>
        </div>
    </div>

    <div class="title">
        <div>ORDONANTARE DE PLATA</div>
    </div>

    <div class="content">
        <p>Natura cheltuielii: {{ ordonantare.primareceptie.angajament.descriere }}</p>
        <p>Lista documente justificative:</p>
        <p>Factura nr. {{ ordonantare.primareceptie.nrfact }} din {{ formatDate(ordonantare.primareceptie.datafact) }}</p>
        <p>Nr./data angajamentului legal: {{ ordonantare.primareceptie.angajament.numar }} / {{ formatDate(ordonantare.primareceptie.angajament.data) }}</p>
        <p>Cod ang. legal: {{ ordonantare.codang_indic }}</p>
        <p>Modul de plata: virament</p>
        <p>Suma datorata beneficiarului: {{ formatAmount(ordonantare.valoare) }} lei</p>
        <p>Avansuri acordate si retinute beneficiarului: 0 lei</p>
        <p>Suma de plata (lei) : {{ formatAmount(ordonantare.valoare) }} </p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Subdiviziunea clasificatiei bugetare</th>
                <th>Disponibil inaintea efectuarii platii</th>
                <th>Suma de plata</th>
                <th>Disponibil dupa efectuarii platii</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>33.10.21.20.01.09</td>
                <td class="text-dreapta">26.370,00</td>
                <td class="text-dreapta">13.090,00</td>
                <td class="text-dreapta">13.280,00</td>
            </tr>
        </tbody>
    </table>
    <div class="document-info">
        <div class="content">
            <p><strong>Numele si adresa beneficiarului:</strong></p>
            <p>EXTRANET SRL</p>
            <p>STR AVRAM IANCU NR 54</p>
            <p>CLUJ NAPOCA</p>
        
        </div>
        <div class="content">
            <p><strong>Numarul de cont:</strong> </p>
        <p>RO32TREZ2165069XXX010391</p> 
        </div>
    </div>
    <div class="signature-line"></div>
    <div class="signatures">
        <div class="signature-block">
            <div class="boldat">Compartimentul</div>
            <div class="boldat">INFORMATICA</div>
         
            <div>Data: _____________</div>
        </div>
        <div class="signature-block">
            <div class="boldat">Compartimentul de contabilitate</div>
           
            <div>Data: ______________</div>
            <div>Semnatura: ________</div>
        </div>
        <div class="signature-block">
            <div class="boldat">Compartimentul financiar-contabilitate</div>
            <div class="boldat">CFPP</div>
          
            <div>Viza: 4-8863</div>
            <div>Semnatura: ________</div>
        </div>
    </div>
    <div class="signature-line"></div>
    <div class="semnatura-comandant">
            <div>Ordonator de credite,</div>
            <div>COMANDANTUL {{ institutie.denumire }}</div>
            <div>{{ institutie.reprezentant }}</div>


        </div>
        <div class="boldat">Data: 21/11/2024</div>
    </div>
</template>
<style>
/* A4 page setup */
@page {
    size: A4 portrait;
    margin: 0;
}

body {
    margin: 0;
    padding: 0;
    background: rgb(204,204,204);
}

.page {
    background: white;
    width: 210mm;
    height: 297mm;
    display: block;
    margin: 0 auto;
    padding: 20mm;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    font-size: 12pt;
}

@media print {
    body {
        background: none;
    }
    .page {
        margin: 0;
        box-shadow: none;
    }
}

/* Content styling */
.header {
    text-align: center;
    margin-bottom: 15mm;
}

.header p {
    margin: 2mm 0;
}

.document-info {
    display: flex;
    text-align: center;
    justify-content: space-between;
  
}

.title {
    text-align: center;
    font-weight: bold;
    margin: 10mm 0;
    border: 2px black solid;
}
.semnatura-comandant {
    text-align: center;
    font-weight: bold;
    margin: 10mm 0;

}
.text-dreapta {
    text-align: right;
}
.content {
    margin-bottom: 5mm;
}
.boldat {
    font-weight: bold;
}
.content p {
    margin: 2mm 0;
    line-height: 1.1;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin: 10mm 0;
}

.table th, .table td {
    border: 1px solid black;
    padding: 2mm;
  
}

.signatures {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10mm;
    margin-top: 2mm;
    margin-bottom: 8mm;
}

.signature-block {
    text-align: center;
}

.signature-line {
    border-top: 1px solid black;
    
}

.footer {
    position: absolute;
    bottom: 20mm;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 8pt;
}
</style>