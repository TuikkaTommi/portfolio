<?php
// Otetaan tietokantafunktiot käyttöön
include('../db_functions.php');

// Avataaan tietokantayhteys
$connection = connect();

// Jos käyttäjänimi ei tullut tänne asti (tai käyttäjä yrittää mennä suoraan php-tiedostoon), ilmoitetaan käyttäjälle virheestä. Muutoin tehdään muokkaus
if (!$_POST['username']) {
  echo 'Virhe käyttäjän käyttöoikeuksien muokkaamisessa. Palaa käyttäjänhallintaan tästä: <a href="../views/user_management.php">Palaa takaisin</a>';
} else {
  // Otetaan vastaan muokattavan käyttäjän tunnus
  $username = $_POST['username'];

  // Kutsutaan muokkausfunktiota käyttäjän tunnuksella
  toggleAdminStatus($username, $connection);

  // Sirrytään takaisin käyttäjänhallintaan
  echo "<meta http-equiv=refresh content='0; url=../views/user_management.php'>";
}

?>