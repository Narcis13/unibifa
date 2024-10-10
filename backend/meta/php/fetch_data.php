<?php
// Include the same database connection code as in the main file
$host = 'localhost';
$db   = 'adata';
$user = 'root';
$pass = 'q1w2e3r4';

// Create connection
$conn = mysql_connect($host, $user, $pass);
if (!$conn) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db($db, $conn);

$sql = "SELECT ord.nrdoc nrordonantare, ord.data dataordonantare, ord.suma suma, comp.denumire compartiment, f.denumire furnizor, ar.nrfact nrfact, ar.data datafact, antang.nrdoc nrangajament, antang.dataprop dataang, COALESCE(CONCAT(ap.numar,' din ',ap.data), 'NEACHITAT') AS plata 
        FROM adata.ordonantari ord
        left join antetfp afp on afp.valrec=ord.nrdoc
        left join adata.detaliifp dfp on afp.id=dfp.idAntet
        left join adata.detaliiplati dp on dp.idFP=dfp.id
        left join adata.antetplati ap on ap.id=dp.idOP
        INNER JOIN antetereceptii ar ON ar.idOrd = ord.id
        INNER JOIN furnizori f ON ar.furnizorID = f.id
        inner join anteteangajamente antang on antang.nrdoc=ord.idAng
        inner join compartimente comp on comp.id=antang.compID
        where ord.data>'2024-01-01'";

// Execute query
$result = mysql_query($sql);

if (!$result) {
    die('Could not query:' . mysql_error());
}

// Fetch data from the database
$data = array();
while ($row = mysql_fetch_assoc($result)) {
    $data[] = array(
        "nrordonantare" => $row['nrordonantare'],
        "dataordonantare" => $row['dataordonantare'],
        "suma" => $row['suma'],
        "compartiment" => $row['compartiment'],
        "furnizor" => $row['furnizor'],
        "nrfact" => $row['nrfact'],
        "datafact" => $row['datafact'],
        "nrangajament" => $row['nrangajament'],
        "dataang" => $row['dataang'],
        "plata" => $row['plata']
    );
}

// Output JSON for DataTables
echo json_encode(array("data" => $data));

// Close the connection
mysql_close($conn);