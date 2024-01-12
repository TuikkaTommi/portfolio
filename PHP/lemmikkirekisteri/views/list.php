<?php session_start();
// Avataan sessio

if (!isset($_SESSION['username']) || !isset($_SESSION['password']) || !isset($_SESSION['isadmin'])) {
  // Näytetään ilmoitus, jos käyttäjä ei ole kirjautunut sisään
  echo 'Et ole kirjautunut sisään. Kirjaudu sisään tästä: <a href="../index.html">Kirjaudu sisään</a>';
} else {

  // Lista eläinlajeista. Tämä voisi olla myös tietokannassa
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

  // Otetaan tietokantafunktiot käyttöön
  include('../db_functions.php');

  // Avataan yhteys kantaan
  $connection = connect();

  // Haetaan kaikki lemmikit $data-muuttujaan
  $data = getAllPets($connection);

  // Jos filtteri on asetettu, filtteröidään lemmikit sen mukaan. Jos filtteriä ei ole, näytetään kaikki lemmikit normaalisti.
  if (isset($_POST['filter'])) {
    // Otetaan lomakkeelta saatu filtteri talteen muuttujaan
    $filter = $_POST['filter'];
    // Tulostetaan filtteri testausta varten
    // echo $filter . '<br>';

    if ($filter !== 'Kaikki') {
      // Filtteröidään lemmikkitaulukko. Koska taulukko on "kerroksittainen", käytetään array_filterissä callbackia.
      // use ottaa funktiossa käyttöön ylemmässä scopessa olevan muuttujan.
      $data = array_filter($data, function ($pet) use ($filter) {
        return ($pet['species'] == $filter);
      });
    }

    // Tulostetaan taulukko testausta varten
    // var_dump($data);
  }
  ?>

  <html>

  <head>
    <title>Lemmikkirekisteri - Lista</title>
    <link rel="stylesheet" href="styles.css">
  </head>

  <body>
    <p><a href="../user_functions/logout.php">Kirjaudu ulos</a>
      <?php if ($_SESSION['isadmin'] === '1') { ?> | <a href="user_management.php">Käyttäjienhallinta</a>
      <?php } ?>
    </p>
    <h2>Rekisterissä olevat lemmikit</h2>

    <!-- Lomake, jolla hoidetaan listan filtteröiminen lajin perusteella. Lomakkeen tiedot lähetetään tähän samaan tiedostoon post-metodilla.  -->
    <form action="list.php" method="post">
      <p>Valitse näytettävä eläinlaji:
      <p>
        <label>
          <input type="radio" name="filter" value="Kaikki" checked> Kaikki
        </label>

        <?php
        // Tehdään jokaiselle lajille oma nappula. Jos laji on nykyinen filtteri, valitaan se, jotta lomake ei "nollaudu" sivun latautuessa uudelleen.
        foreach ($speciesList as $species) { ?>
          <label>
            <input type="radio" name="filter" value=<?php echo $species ?>     <?php if ($filter === $species) {
                      echo 'checked';
                    } ?>> <?php echo $species ?>
          </label>
        <?php } ?>

        <button type="submit">Filtteröi</button>
    </form>


    <?php
    if ($_SESSION['isadmin'] === '1') {
      // Näkymä, jos kirjautunut käyttäjä on admin
      echo '<button class="addbutton" onclick=location.href="pet_form.php">Lisää uusi lemmikki</button> <br>';
    }
    if (empty($data)) {
      // Jos tietokannasta palautuva lemmikkitaulukko on tyhjä, tulostetaan ilmoitus
      echo 'Rekisterissä ei ole hakua vastaavia lemmikkejä.';
    }
    foreach ($data as $pet) {
      ?>

      <div class="listcontainer">Nimi:
        <?php echo $pet['name'] ?> | Laji:
        <?php echo $pet['species'] ?> | Syntymäaika:
        <?php echo $pet['date_of_birth'] ?> | Allergiat:
        <?php echo $pet['allergies'] ?> | Lääkitys:
        <?php echo $pet['medication'] ?> | Omistaja:
        <?php echo $pet['owner_name'] ?> | Puhnro:
        <?php echo $pet['owner_phone'] ?>

        <?php
        if ($_SESSION['isadmin'] === '1') {
          ?>
          <div class="buttoncontainer">
            <form action="pet_form.php" method="post"><input type="hidden" name="pet_id" value=<?php echo $pet['id'] ?>><button type="submit">Muokkaa</button></form>
            <form action="../pet_functions/deletepet.php" method="post"><input type="hidden" name="pet_id" value=<?php echo $pet['id'] ?>>
              <button type="submit">Poista</button>
            </form>
          </div>
        <?php } ?>
      </div>

    <?php }
}

// Toinen tapa tehdä tulostus
// echo '<div class="petcontainer">' . 'Nimi: ' . $value['name'] . ' | Laji: ' . $value['species'] . ' | Syntymäaika: ' . $value['date_of_birth'] . ' | Allergiat: ' . $value['allergies'] . ' | Lääkitys: ' . $value['medication'] . ' | Omistaja: ' . $value['owner_name'] . ' | Puhnro: ' . $value['owner_phone'] . '<div class="buttoncontainer"> <button>Muokkaa</button> <button>Poista</button> </div>' . '</div>';
?>

</body>

</html>