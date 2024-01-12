<?php
// Otetaan tietokantafunktiot käyttöön
include('../db_functions.php');

// Avataaan tietokantayhteys
$connection = connect();

// Jos kaikkia pakollisia tietoja ei tullut tänne asti (tai käyttäjä yrittää mennä suoraan addpet.php-tiedostoon), ilmoitetaan käyttäjälle virheestä. Muutoin tehdään lisäys
if (!$_POST['username'] || !$_POST['password'] || !$_POST['passwordverification']) {
  echo 'Virhe käyttäjän lisäämisessä. Palaa rekisteröitymislomakkeeseen tästä: <a href="../views/register_form.php">Palaa takaisin</a>';
} else if ($_POST['password'] !== $_POST['passwordverification']) {
  // Jos salasanan vahvistus väärin, annetaan virheilmoitus
  echo 'Salasanan vahvistus väärin. Palaa takaisin ja tarkista salasanojen oikeinkirjoitus: <a href="../views/register_form.php">Palaa takaisin</a>';
} else if (strip_tags($_POST['username']) !== $_POST['username'] || strip_tags($_POST['password']) !== $_POST['password']) {
  // Jos tunnukset sisältävät php- tai html-tageja, annetaan virheilmoitus
  echo 'Käyttäjänimi tai salasana sisältää kiellettyjä merkkejä. Poista niistä html- tai php-merkinnät ja kokeile uudestaan.';
} else {
  // Haetaan kannasta annetulla käyttäjätunnuksella käyttäjää, jotta voidaan tarkista onko tällä nimellä jo käyttäjä
  $user = getUser($_POST['username'], $connection);

  if ($user['username'] === $_POST['username']) {
    echo 'Tällä käyttäjänimellä on jo rekisteröity käyttäjä. Kirjaudu sisään tästä: <a href="../index.html">Kirjaudu sisään</a> tai palaa rekisteröitymislomakkeeseen tästä: <a href="../views/register_form.php">Palaa takaisin</a>';
  } else {
    // Kutsutaan createUser()-funktiota uuden käyttäjän tiedoilla
    createUser($_POST['username'], $_POST['password'], $connection);

    // Sirrytään takaisin listaan
    echo "Käyttäjä luotu onnistuneesti. Voit nyt kirjautua sisään täältä: <a href='../index.html'>Kirjaudu sisään</a>";
  }
}
?>