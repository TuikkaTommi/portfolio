<?php
// Otetaan tietokantafunktiot käyttöön
include('../db_functions.php');

// Avataaan tietokantayhteys
$connection = connect();

// Jos käyttäjänimi ei tullut tänne asti (tai käyttäjä yrittää mennä suoraan php-tiedostoon), ilmoitetaan käyttäjälle virheestä. Muutoin tehdään poisto
if (!$_POST['username']) {
  echo 'Virhe käyttäjän poistamisessa. Palaa käyttäjänhallintaan tästä: <a href="../views/user_management.php">Palaa takaisin</a>';
} else {
  // Otetaan vastaan poistettavan käyttäjän tunnus
  $username = $_POST['username'];

  // Kutsutaan poistofunktiota käyttäjän tunnuksella
  deleteUser($username, $connection);

  // Sirrytään takaisin käyttäjänhallintaan
  echo "<meta http-equiv=refresh content='0; url=../views/user_management.php'>";
}

?>