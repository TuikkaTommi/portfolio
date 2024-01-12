<?php
session_start();
// Avataaan sessio
?>

<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css">
  <title>Lemmikkirekisteri - Lisää uusi lemmikki rekisteriin</title>
</head>

<body>
  <?php
  // Importataan tietokantafunktiot
  include('../db_functions.php');

  // Lista valittavista eläinlajeista. Tämä voisi olla myös tietokannassa
  $speciesList = [
    'Chinchilla',
    'Hamsteri',
    'Hevonen',
    'Hiiri',
    'Hämähäkki',
    'Kala',
    'Kissa',
    'Koira',
    'Käärme'
  ];


  // Jos lomakkeelle on lähetetty id, eli olemassa olevaa lemmikkiä halutaan muokata, suoritetaan tämä koodi
  if ($_POST['pet_id']) {
    $id = $_POST['pet_id'];

    // Avataan yhteys kantaan
    $connection = connect();
    // Haetaan oikean lemmikin tiedot id:n perusteella
    $pet = getPetById($id, $connection);

  }

  if ($_SESSION['isadmin'] === '1') {
    // Jos käyttäjä on admin, näytetään hänelle lemmikin lisäys/muokkauslomake
  
    ?>
    <p><a href="../user_functions/logout.php">Kirjaudu ulos</a> | <a href="list.php">Palaa listaan</a> | <a
        href="user_management.php">Käyttäjienhallinta</a> </p>
    <h2>Lisää uusi lemmikki rekisteriin </h2>

    <form class="petform" <?php if ($pet) {
      // Jos muokataan lemmikkiä, lomakkeen tiedot lähetetään editpet.php -tiedostoon
      echo 'action="../pet_functions/editpet.php"';
    } else {
      // Uutta lemmikkiä lisätessä lomakkeen tiedot lähetetään addpet.php -tiedostoon
      echo 'action="../pet_functions/addpet.php"';
    } ?> method="post">
      <h3>Lemmikin tiedot</h3>
      <input type="hidden" name="pet_id" value=<?php echo $id ?>>
      <label>Lemmikin nimi*:
        <input type="text" name="name" placeholder="Syötä nimi" <?php if ($pet) {
          echo 'value=' . $pet['name'];
        } ?>
          required=true minlength="2" maxlength="50">
      </label>
      <br>
      <label>Valitse lemmikin laji*:
        <select name="species" required=true>
          <?php
          foreach ($speciesList as $species) {
            // Laji asetetaan valituksi, jos muokattavan lemmikin laji on kyseinen laji
            ?>
            <option value="<?php echo $species ?>" <?php if ($pet['species'] === $species) {
                 echo 'selected';
               } ?>><?php echo $species ?> </option>
            <?php
          }
          ?>
        </select>
      </label>
      <br>
      <label>
        Lemmikin syntymäaika:
        <!-- Max-arvo estää valitsemasta sitä suurempia päivämääriä. Sen arvoksi on asetettu PHP:llä nykyinen päivämäärä. -->
        <input type="date" name="dateofbirth" max="<?php echo date("Y-m-d"); ?>" <?php if ($pet) {
             echo 'value=' . $pet['date_of_birth'];
           } ?>>
      </label>
      <br>
      <label>Lemmikin allergiat:
        <input type="text" name="allergies" maxlength="200" <?php if ($pet) {
          echo 'value="' . $pet['allergies'] . '"';
        } ?>>
      </label>
      <br>
      <label>Lemmikin lääkitys:
        <input type="text" name="medication" maxlength="200" <?php if ($pet) {
          echo 'value="' . $pet['medication'] . '"';
        } ?>>
      </label>
      <h3>Omistajan tiedot</h3>
      <label>
        Omistajan nimi*:
        <input type="text" name="owner_name" required=true minlength="2" maxlength="50" <?php if ($pet) {
          echo 'value=' . $pet['owner_name'];
        } ?>>
      </label>
      <br>
      <label>
        Omistajan puhelinnumero*:
        <input type="text" name="owner_phone" required=true minlength="4" maxlength="13" <?php if ($pet) {
          echo 'value=' . $pet['owner_phone'];
        } ?>>
      </label>
      <br>
      <input type="submit" value="Tallenna">
    </form>

    <?php

  } else {
    // Jos tavallinen käyttäjä yrittää päästä sivulle, näytetään ilmoitus käyttöoikeuksien puuttumisesta.
    echo 'Sinulla ei ole käyttöoikeuksia tähän sivuun. Palaa tästä listaan: <a href="list.php">Palaa listaan</a> tai kirjaudu sisään tästä: <a href="../user_functions/logout.php">Kirjaudu sisään</a> ';
  } ?>

</body>

</html>