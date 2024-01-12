<?php session_start();


if ($_SESSION['isadmin'] === '1') {
  // Vain admin voi tehdä toimintoja tällä sivulla

  // Importataan tietokantafunktiot
  include('../db_functions.php');

  // Avataan yhteys kantaan
  $connection = connect();

  // Haetaan kaikki lemmikit $data-muuttujaan
  $users = getAllusers($connection); ?>

  <html>

  <head>
    <title>Lemmikkirekisteri - Käyttäjänhallinta</title>
    <link rel="stylesheet" href="styles.css">
  </head>

  <body>
    <p><a href="../user_functions/logout.php">Kirjaudu ulos</a> | <a href="list.php">Palaa listaan </a> </p>
    <h2>Käyttäjienhallinta</h2>

    <?php foreach ($users as $user) { ?>

      <div class="listcontainer">Käyttäjänimi:
        <?php echo $user['username'] ?> | Admin:
        <?php echo $user['isadmin'] ?>

        <?php if ($user['username'] !== 'admin') { // Alkuperäistä admin-käyttäjää ei voi muokata tai poistaa ?>
          <div class="buttoncontainer">
            <form action="../user_functions/toggleadminstatus.php" method="post"><input type="hidden" name="username"
                value=<?php echo $user['username'] ?>><button type="submit">Vaihda admin-status</button></form>
            <form action="../user_functions/deleteuser.php" method="post"><input type="hidden" name="username" value=<?php echo $user['username'] ?>>
              <button type="submit">Poista</button>
            </form>
          </div>
        <?php } ?>
      </div>

      <?php
    }
} else {
  echo 'Sinulla ei ole käyttöoikeuksia tähän sivuun. Palaa listaan tästä: <a href="list.php">Palaa listaan</a> tai kirjaudu sisään tästä: <a href="../index.html">Kirjaudu sisään</a> ';
}

?>

</body>

</html>