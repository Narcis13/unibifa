<?php


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordonantari Report</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.24/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.js"></script>
    <style>
        body { font-family: Arial, sans-serif; }
        #waiting { display: none; text-align: center; margin-top: 20px; }
        #dataTable { width: 100%; }
        @media print {
            body { width: 297mm; height: 210mm; }
        }
    </style>
</head>
<body>
    <div id="waiting">Waiting for data...</div>
    <table id="dataTable" class="display">
        <thead>
            <tr>
                <th>Nr. Ordonantare</th>
                <th>Data Ordonantare</th>
                <th>Suma</th>
                <th>Compartiment</th>
                <th>Furnizor</th>
                <th>Nr. Factura</th>
                <th>Data Factura</th>
                <th>Nr. Angajament</th>
                <th>Data Angajament</th>
                <th>Plata</th>
            </tr>
        </thead>
    </table>

    <script>
    $(document).ready(function() {
        $('#waiting').show();
        $('#dataTable').DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url": "fetch_data.php",
                "type": "POST"
            },
            "columns": [
                { "data": "nrordonantare" },
                { "data": "dataordonantare" },
                { "data": "suma" },
                { "data": "compartiment" },
                { "data": "furnizor" },
                { "data": "nrfact" },
                { "data": "datafact" },
                { "data": "nrangajament" },
                { "data": "dataang" },
                { "data": "plata" }
            ],
            "pageLength": 15,
            "lengthMenu": [[15, 30, 50, -1], [15, 30, 50, "All"]],
            "initComplete": function(settings, json) {
                $('#waiting').hide();
            }
        });
    });
    </script>
</body>
</html>
