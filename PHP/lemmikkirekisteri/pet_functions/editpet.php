<?php
// Otetaan tietokantafunktiot käyttöön
include('../db_functions.php');

// Avataaan tietokantayhteys
$connection = connect();

// Jos kaikkia pakollisia tietoja ei tullut tänne asti (tai käyttäjä yrittää mennä suoraan editpet.php-tiedostoon), ilmoitetaan käyttäjälle virheestä. Muutoin tehdään muutos
if (!$_POST['name'] || !$_POST['species'] || !$_POST['owner_name'] || !$_POST['owner_phone']) {
  echo 'Virhe lemmikin muokkaamisessa. Palaa listaan tästä: <a href="../views/list.php">Palaa takaisin</a>';
} else {
  // Jos allergioita, lääkitystä tai syntymäaikaa ei ole annettu, asetetaan niille oletusarvot
  if ($_POST['allergies']) {
    $allergies = strip_tags($_POST['allergies']);
  } else {
    $allergies = 'Ei mitään';
  }

  if ($_POST['medication']) {
    $medication = strip_tags($_POST['medication']);
  } else {
    $medication = 'Ei mitään';
  }

  if ($_POST['dateofbirth']) {
    $dateofbirth = strip_tags($_POST['dateofbirth']);
  } else {
    $dateofbirth = '2000-01-01';
  }

  $name = strip_tags($_POST['name']);
  $species = strip_tags($_POST['species']);
  $owner_name = strip_tags($_POST['owner_name']);
  $owner_phone = strip_tags($_POST['owner_phone']);


  // Kutsutaan editPet()-funktiota uusilla tiedoilla
  editPet($_POST['pet_id'], $name, $species, $dateofbirth, $allergies, $medication, $owner_name, $owner_phone, $connection);

  // Sirrytään takaisin listaan
  echo "<meta http-equiv=refresh content='0; url=../views/list.php'>";
}

?>