<?php
// Otetaan tietokantafunktiot käyttöön
include('../db_functions.php');

// Avataaan tietokantayhteys
$connection = connect();

// Jos id ei tullut tänne asti (tai käyttäjä yrittää mennä suoraan deletepet.php-tiedostoon), ilmoitetaan käyttäjälle virheestä. Muutoin tehdään poisto
if (!$_POST['pet_id']) {
  echo 'Virhe lemmikin poistamisessa. Palaa listaan tästä: <a href="../views/list.php">Palaa takaisin</a>';
} else {
  // Otetaan vastaan poistettavan lemmikin id
  $id = $_POST['pet_id'];

  // Kutsutaan poistofunktiota lemmikin id:llä
  deletePet($id, $connection);

  // Sirrytään takaisin listaan
  echo "<meta http-equiv=refresh content='0; url=../views/list.php'>";
}

?>