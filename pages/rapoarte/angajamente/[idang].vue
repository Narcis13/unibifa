<script setup >




definePageMeta({
    layout:'rapoarte'
})

const {idang}=useRoute().params


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
   <div class="document-container">
        <div class="header">
            <div class="header-left">
                <div>ROMÂNIA</div>
                <div>MINISTERUL APĂRĂRII NAȚIONALE</div>
                <div>U.M. 02497 Pitești</div>
            </div>
            <div class="header-right">
                <div>Data emiterii: 01/11/2024</div>
                <div>Compartiment: INFO</div>
                <div>Numar: 7003</div>
            </div>
        </div>

        <div class="title-box">
            PROPUNERE DE ANGAJARE A UNEI CHELTUIELI
        </div>

        <div>
            <div>Scopul: servicii reparare centrala tel</div>
            <div>Beneficiar: U.M. 02497 Pitești</div>
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
                        <td>33.10.21.20.01.09</td>
                        <td class="number-cell">2.772.000,0</td>
                        <td class="number-cell">2.724.752,0</td>
                        <td class="number-cell">47.248,00</td>
                        <td class="number-cell">5.700,00</td>
                        <td class="number-cell">41.548,00</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Rest of the content follows the same pattern -->
        <!-- Additional sections can be added following the same structure -->
    </div>
</template>
<style>
/* A4 Page Setup [[1]] */
@page {
    size: A4;
    margin: 0;
}

html, body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
}

/* Document Container [[2]] */
.document-container {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 20mm;
    background: white;
    box-sizing: border-box;
    font-family: "Times New Roman", Times, serif;
    font-size: 12px;
    line-height: 1.3;
    position: relative;
}

/* Header Styles [[3]] */
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.header-left {
    text-align: left;
}

.header-right {
    text-align: left;
}

/* Title Box [[4]] */
.title-box {
    border: 1px solid black;
    text-align: center;
    padding: 5px;
    margin: 15px 0;
    font-weight: bold;
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