<?php
// Avataan sessio 
session_start();

// Tuhotaan avattu sessio
session_destroy();

// Ohjataan käyttäjä takaisin etusivulle
header("Location: ../index.html");

?>