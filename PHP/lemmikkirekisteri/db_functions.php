<?php
/* 
CREATE TABLE `pet_db`.`pets` (
`id` INT NOT NULL AUTO_INCREMENT,
`name` VARCHAR(100) NOT NULL,
`species` VARCHAR(100) NOT NULL,
`date_of_birth` DATE NULL,
`allergies` VARCHAR(400) NULL,
`medication` VARCHAR(400) NULL,
`owner_name` VARCHAR(100) NOT NULL,
`owner_phone` VARCHAR(45) NOT NULL,
PRIMARY KEY (`id`),
UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);
*/

// Connect() -funktio ottaa yhteyden tietokantaan ja palauttaa yhteyden
function connect()
{
  $user = "****";
  $password = "********";
  $host = "*********";
  $db = "pet_db";

  // Otetaan yhteys tietokantaan mysqli_connect()-funktiolla
  $connection = mysqli_connect($host, $user, $password)
    // die()lopettaa skriptin suorituksen jos yhdistäminen ei onnistunut
    or die("Yhdistäminen ei onnistunut" . mysqli_error($connection));

  // Otetaan yhteys tiettyyn tietokantaan mysqli_select_db()-funktiolla.
  mysqli_select_db($connection, $db) or die("Tietokannan valita epäonnistui" . mysqli_error($connection));

  // Palautetaan yhteysolio
  return $connection;
}

// Funktio, jolla haetaan kaikkien lemmikkien tiedot kannasta
function getAllPets($conn)
{
  // Haetaan lemmikit $result-objektiin sql-lausekkeella
  $result = $conn->query("SELECT * FROM pets") or die("Tietokantahaku epäonnistui" . mysqli_error($conn));
  // Luodaan taulukko, johon saatu data voidaan laittaa
  $resultarray = array();

  // Kaikki taulun rivit taulukkoon
  while ($row = $result->fetch_assoc()) {
    $resultarray[] = $row;
  }

  // Palautetaan data
  return $resultarray;
}

// Funktio, jolla haetaan yksi lemmikki id:n perusteella
function getPetById($id, $conn)
{
  $sql = "SELECT * FROM pets WHERE id='$id';";

  $result = mysqli_query($conn, $sql) or die('Lemmikin haku epäonnistui' . mysqli_error($conn));
  // Fetch assoc palauttaa rivin assosiatiivisena taulukkona
  $pet = mysqli_fetch_assoc($result);

  return $pet;
}

// Funktio, jolla lisätään uusi lemmikki kantaan
function addPet($name, $species, $dateOfBirth, $allergies, $medication, $ownerName, $ownerPhone, $conn)
{
  $sql = "INSERT INTO pets (name, species, date_of_birth, allergies, medication, owner_name, owner_phone) VALUES ('$name', '$species', '$dateOfBirth', '$allergies', '$medication', '$ownerName', '$ownerPhone');";

  mysqli_query($conn, $sql) or die('Lemmikin lisäys epäonnistui' . mysqli_error($conn));
}

// Funktio, jolla muokataan olemassa olevaa lemmikkiä 
function editPet($id, $name, $species, $dateOfBirth, $allergies, $medication, $ownerName, $ownerPhone, $conn)
{
  $sql = "UPDATE pets SET name = '$name', species = '$species', date_of_birth = '$dateOfBirth', allergies = '$allergies', medication = '$medication', owner_name = '$ownerName', owner_phone = '$ownerPhone' WHERE id = $id;";

  mysqli_query($conn, $sql) or die('Lemmikin muokkaus epäonnistui' . mysqli_error($conn));
}

// Funktio, jolla poistetaan lemmikki kannasta
function deletePet($id, $conn)
{
  $sql = "DELETE FROM pets WHERE id= $id";

  mysqli_query($conn, $sql) or die('Lemmikin poisto epäonnistui' . mysqli_error($conn));
}

// Funktio, jolla haetaan kaikki käyttäjät tietokannasta
function getAllUsers($conn)
{
  // Haetaan käyttäjät $result-objektiin sql-lausekkeella
  $result = $conn->query("SELECT * FROM users") or die("Tietokantahaku epäonnistui" . mysqli_error($conn));
  // Luodaan taulukko, johon saatu data voidaan laittaa
  $resultarray = array();

  // Kaikki taulun rivit taulukkoon
  while ($row = $result->fetch_assoc()) {
    $resultarray[] = $row;
  }

  // Palautetaan data
  return $resultarray;
}

// Funktio, jolla haetaan tietyn käyttäjän tiedot kannasta
function getUser($username, $conn)
{
  $sql = "SELECT * FROM users WHERE username='$username';";

  $result = mysqli_query($conn, $sql) or die('Käyttäjän haku epäonnistui' . mysqli_error($conn));
  // Fetch assoc palauttaa rivin assosiatiivisena taulukkona
  $user = mysqli_fetch_assoc($result);

  return $user;
}

// Funktio, jolla luodaan uusi käyttäjä
function createUser($username, $password, $conn)
{
  $sql = "INSERT INTO users (username, password, isadmin) VALUES ('$username', '$password', 0)";

  mysqli_query($conn, $sql) or die('Käyttäjän lisäys epäonnistui' . mysqli_error($conn));
}

// Funktio, jolla muokataan käyttäjän käyttöoikeuksia
function toggleAdminStatus($username, $conn)
{
  // Tinyint-arvo voidaan vaihtaa antamalla arvoksi 1 - nykyinen arvo. (jos käyttäjä on jo admin, 1 - 1 eli uusi arvo on nolla)
  $sql = " UPDATE users SET isadmin = 1 - isadmin WHERE username='$username'";

  mysqli_query($conn, $sql) or die('Käyttäjän muokkaus epäonnistui' . mysqli_error($conn));
}

// Funktio, jolla poistetaan käyttäjä
function deleteUser($username, $conn)
{
  $sql = "DELETE FROM users WHERE username='$username'";

  mysqli_query($conn, $sql) or die('Käyttäjän poisto epäonnistui' . mysqli_error($conn));
}

?>