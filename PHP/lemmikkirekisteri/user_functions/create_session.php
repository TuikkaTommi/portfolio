<?php
session_start();
// Aloitetaan sessio

// Otetaan kirjautumislomakkeelta tulevat tiedot talteen muuuttujiin
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

// Otetaan tietokantafunktiot käyttöön
include('../db_functions.php');

// Avataan tietokantayhteys
$connection = connect();

// Haetaan käyttäjänimellä käyttäjän tiedot kannasta
$user = getUser($username, $connection);

// Käyttäjän oikeellisuuden tarkistaminen sekä session asettaminen
if ($user && $password === $user['password']) {

  // Asetetaan session tietoihin kirjautuneen käyttäjän tunnus ja salasana
  $_SESSION['username'] = $username;
  $_SESSION['password'] = $password;
  $_SESSION['isadmin'] = $user['isadmin'];

  // Ohjataan käyttäjä seuraavalle sivulle
  header('Location: ../views/list.php');

  // echo $_SESSION['isadmin'];
} else if ($user && $password !== $user['password']) {
  echo 'Väärä salasana tai käyttäjätunnus. Kirjaudu sisään uudelleen tästä: <a href="../index.html">Kirjaudu sisään</a>';
} else {
  echo 'Käyttäjää ei löytynyt. Kirjaudu sisään uudelleen tästä: <a href="../index.html">Kirjaudu sisään</a>';
}

// var_dumpilla voidaan katsoa session tiedot
// var_dump($_SESSION);

?>