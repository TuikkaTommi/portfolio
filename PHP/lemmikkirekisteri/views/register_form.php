<html>

<head>
  <meta charset="UTF-8" />
  <title>Lemmikkirekisteri - Rekisteröityminen</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <h2>Luo käyttäjätunnus</h2>
  <form action="../user_functions/register_user.php" method="post">
    <!--Kirjautumislomake lähetetään register_user.php-tiedostoon -->
    <label>
      Käyttäjänimi:
      <input type="text" name="username" placeholder="Syötä käyttäjätunnus" required="true" minlength="5"
        maxlength="20" />
    </label>
    <label>
      Salasana:
      <input type="password" name="password" placeholder="Syötä salasana" required="true" minlength="5"
        maxlength="20" />
    </label>
    <label>
      Vahvista salasana:
      <input type="password" name="passwordverification" placeholder="Syötä salasana uudestaan" required="true"
        minlength="5" maxlength="20" />
    </label>
    <input type="submit" value="Rekisteröidy" />
  </form>

  <p>
    Onko sinulla jo tunnukset?
    <a href="../index.html">Kirjaudu sisään tästä</a>
  </p>
</body>

</html>