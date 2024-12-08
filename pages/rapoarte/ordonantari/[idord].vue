<script setup >
definePageMeta({
    layout:'rapoarte'
})

const {idord}=useRoute().params
const { data} = await $fetch('/api/ordonantari/'+idord)
//console.log(data)
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
            <div>Unitatea Militara 02497 Pitesti</div>
        </div>
        <div>
            <div>Compartiment: INFO</div>
            <div>Numar: {{ ordonantare.numar }}</div>
            <div>Data emiterii: 21/11/2024</div>
        </div>
    </div>

    <div class="title">
        <div>ORDONANTARE DE PLATA</div>
    </div>

    <div class="content">
        <p>Natura cheltuielii: CONTRACT EXTRANET 2024</p>
        <p>Lista documente justificative:</p>
        <p>Factura nr. 241100017 din 21/11/2024</p>
        <p>Nr./data angajamentului legal: 6341 / 2024-03-18</p>
        <p>Cod ang. bug.: AAAREX3KK87</p>
        <p>Modul de plata: virament</p>
        <p>Suma datorata beneficiarului: 13.090,00 lei</p>
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
                <td>26.370,00</td>
                <td>13.090,00</td>
                <td>13.280,00</td>
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

    <div class="signatures">
        <div class="signature-block">
            <p>Compartimentul INFO</p>
            <div class="signature-line"></div>
            <p>Data: _____________</p>
        </div>
        <div class="signature-block">
            <p>Compartimentul de contabilitate</p>
            <div class="signature-line"></div>
            <p>Data: Viza 4-8863</p>
        </div>
        <div class="signature-block">
            <p>Ordonator de credite,</p>
            <p>COMANDANTUL UM 02497 PITESTI</p>
            <p>Col. Gheorghe TUDOR</p>
            <div class="signature-line"></div>
            <p>Data: 21/11/2024</p>
        </div>
    </div>


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
    margin-bottom: 10mm;
}

.title {
    text-align: center;
    font-weight: bold;
    margin: 10mm 0;
    border: 2px black solid;
}

.content {
    margin-bottom: 10mm;
}

.content p {
    margin: 2mm 0;
    line-height: 1.4;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin: 10mm 0;
}

.table th, .table td {
    border: 1px solid black;
    padding: 2mm;
    text-align: left;
}

.signatures {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10mm;
    margin-top: 20mm;
}

.signature-block {
    text-align: center;
}

.signature-line {
    border-top: 1px solid black;
    margin-top: 15mm;
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