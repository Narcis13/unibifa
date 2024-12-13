<script setup >




definePageMeta({
    layout:'rapoarte'
})

const {idang}=useRoute().params
const institutie = await $fetch('/api/info/institutie')
const detalii = await $fetch(`/api/angajamente/${idang}/detalii`)
console.log(detalii)
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

</script>

<template>
   <div class="page">
        <div class="header">
            <div class="header-left">
                <div>ROMÂNIA</div>
                <div>MINISTERUL APĂRĂRII NAȚIONALE</div>
                <div>{{ institutie.denumire }}</div>
            </div>
            <div class="header-right">
                <div>Data emiterii: {{ formatDate(detalii.angajament.data) }}</div>
                <div> {{ detalii.compartiment.denumire }}</div>
                <div>Numar: {{ detalii.angajament.numar }}</div>
            </div>
        </div>

        <div class="title-box">
            PROPUNERE DE ANGAJARE A UNEI <br>CHELTUIELI
        </div>

        <div>
            <div>Scopul: {{ detalii.angajament.descriere }}</div>
            <div>Beneficiar: {{ institutie.denumire }}</div>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Subdiviziunea clasificatiei bugetului aprobat cap, subcap, titlu, art, alin.</th>
                        <th>Credite bugetare aprobate</th>
                        <th>Credite bugetare angajate</th>
                        <th>Disponibil de credite ce mai poate fi angajat</th>
                        <th>Suma angajata</th>
                        <th>Disponibil de credite ramas de angajat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="header-cell">0</td>
                        <td class="header-cell">1</td>
                        <td class="header-cell">2</td>
                        <td class="header-cell">3=1-2</td>
                        <td class="header-cell">4</td>
                        <td class="header-cell">5=3-4</td>
                    </tr>
                    <tr>
                        <td>{{ detalii.sursaFinantare.cod+'.'+detalii.articolBugetar.cod }}</td>
                        <td class="number-cell">{{ formatAmount(detalii.sumaBuget) }}</td>
                        <td class="number-cell">{{ formatAmount(parseFloat(detalii.sumaBuget)-parseFloat(detalii.disponibilBugetar)) }}</td>
                        <td class="number-cell">{{ formatAmount(detalii.disponibilBugetar) }}</td>
                        <td class="number-cell">{{ formatAmount(detalii.suma) }}</td>
                        <td class="number-cell">{{ formatAmount(parseFloat(detalii.disponibilBugetar)-parseFloat(detalii.suma)) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-caption text-simplu">TOTAL: {{ formatAmount(detalii.suma) }} lei</div>
        <div class="financial-section">
            <div class="left-section"></div>
            <div class="middle-section">
            <div class="header">
                <div class="">Compartimentul de contabilitate</div>
            </div>
            
                <div class="content">
                <div class="label">Data:</div>
                <div class="value">_______________</div>
                </div>
                <div class="content">
                <div class="label">Semnatura:</div>
                <div class="value">_______________</div>
                </div>
           
            </div>
            <div class="right-section">
            <div class="header">
                <div>Control financiar preventiv <br>CFPP</div>
              
            </div>
            <div class="">
                <div class="content">
                <div class="label">Data:</div>
                <div class="value">{{detalii.vizaCFPP?formatDate(detalii.dataCFPP) :''}}</div>
                </div>
                <div class="content">
                <div class="label">Semnatura:</div>
                <div class="value">{{ detalii.vizaCFPP?detalii.nr_viza:'' }}</div>
                </div>
            </div>
            </div>
        </div>

        <div class="semnatura-comandant">
            <div class="avans boldat">Ordonator de credite,</div>
            <div>COMANDANTUL {{ institutie.denumire }}</div>
            <div> {{ institutie.reprezentant }} </div>


        </div>
        <div class="boldat">Data: {{ formatDate(detalii.angajament.data) }}</div>

        <div class="header">
            <div class="header-left">

            </div>
            <div class="header-right">
                <div>Data emiterii: {{ formatDate(detalii.angajament.data) }}</div>
                <div>{{ detalii.compartiment.denumire }}</div>
                <div>Numar: {{ detalii.angajament.numar }}</div>
            </div>
        </div>

        <div class="title-box">
           ANGAJAMENT BUGETAR INDIVIDUAL/GLOBAL
        </div>
        <div class="q-mt-sm">Beneficiar: {{ institutie.denumire }}</div>
        <div class="container-sus">
            <div class="left-column-sus">
               <div class="header-cell underline">Înregistrarea bugetară</div>
               <div class="q-ml-sm">
                    cap.subcap.titlu.art.alin. {{ detalii.sursaFinantare.cod+'.'+detalii.articolBugetar.cod }}
                </div>
                <div class="q-mt-md header-cell">Suma totala</div>
                <div class="q-ml-sm">
                    Tip angajament:individual(global) {{ formatAmount(detalii.suma) }}
                </div>
            </div>
            <div class="right-column-sus">
               <div class="q-ml-sm underline">Suma</div>
               <div class="header-cell">{{ formatAmount(detalii.suma) }} lei</div>
            </div>
        </div>

        <div class="container-jos">
            <div class="left-column-jos">
               <div class="underline">Spatiu rezervat CFPP</div>
               <div class="q-ml-sm">
                   - Viza
                </div>
                <div class="q-ml-sm">
                   - Refuz de viza
                </div>
                <div class="q-ml-sm">
                   - Inregistrare individuala
                </div>

            </div>
            <div class="right-column-jos">
            
               <div class="header-cell">{{ detalii.vizaCFPP?detalii.nr_viza+' din '+formatDate(detalii.dataCFPP):'' }}</div>
            </div>
        </div>

        <div class="semnatura-comandant">
            <div class="avans boldat">Ordonator de credite,</div>
            <div>COMANDANTUL {{ institutie.denumire }}</div>
            <div> {{ institutie.reprezentant }} </div>


        </div>
        <div class="boldat">Data: {{ formatDate(detalii.angajament.data) }}</div>
        <!-- Rest of the content follows the same pattern -->
        <!-- Additional sections can be added following the same structure -->
    </div>
</template>
<style>
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
    padding: 10mm;
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
/* Header Styles [[3]] */
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.header-left {
    text-align: center;
}

.header-right {
    text-align: left;
}
.underline {
    text-decoration: underline;
}
/* Title Box [[4]] */
.title-box {
    border: 2px solid black;
    text-align: center;
    padding: 5px;
    margin: 0 auto;
    font-weight: bold;
    width:400px;
}

/* Table Styles [[5]] */
.table-wrapper {
    width: 100%;
    margin: 15px 0;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead th {
    background-color: white;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    padding: 4px;
    font-size: 11px;
    border: 1px solid black;
}

tbody td {
    padding: 4px;
    font-size: 11px;
    border: 1px solid black;
}

.number-cell {
    text-align: right;
}
.header-cell {
    text-align: center;
}
.text-simplu {
    margin-left: 500px;
}
/* Signature Section [[6]] */
.signature-section {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    gap: 20px;
}

.signature-box {
    border: 1px solid black;
    padding: 10px;
    flex: 1;
}


.financial-section {
  display: flex;
  font-family: Arial, sans-serif;
  font-size: 12pt;
}

.left-section {
    min-width: 150px;
    border: 1px solid black;
}
.left-section,
.middle-section,
.right-section {
  flex: 1;
  padding: 10px;
}

.middle-section,
.right-section {
  border: 1px solid black;
}

.financial-section .header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

}

.financial-section .content {
  display: flex;
  justify-content: space-between;
}

.financial-section .data,
.financial-section .semnatura {
  display: flex;
  align-items: center;
}

.financial-section .label {

  margin-right: 5px;
}

.semnatura-comandant {
    text-align: left;

  

}
.boldat {
    font-weight: bold;
}
.avans {
    margin-left:45px;
}
.margine-sus {
    margin-top: 10px;
}
.container-sus {
            display: flex;
            width: 100%;
           
            margin-top:10px;
        }
        
        .left-column-sus {
            width: 70%;
            border: 1px solid black;
        }
        
        .right-column-sus {
            width: 30%;
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            border-right: 1px solid black;
        }
        .container-jos {
            display: flex;
            width: 100%;
           
         
        }
        
        .left-column-jos {
            width: 70%;
            border: 1px solid black;
        }
        
        .right-column-jos {
            width: 30%;
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            border-right: 1px solid black;
        }        
/* Print Styles [[7]] */
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .document-container {
        padding: 0;
        margin: 0;
    }
}
</style>