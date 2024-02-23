# PHP pet-registry

This is a registry application that allows admins to add, modify and remove pets in the registry and regular users can only view them. Data is stored in a MySQL database. The user-authentication in this application is implemented using sessions. Specifications for the MySQL-database can be found [here.](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/db_specifications.txt)

The app is structured so that functionality for managing the pets are in the [pet_functions](https://github.com/TuikkaTommi/portfolio/tree/main/PHP/lemmikkirekisteri/pet_functions) folder, functionality for managing users is inside [user_functions](https://github.com/TuikkaTommi/portfolio/tree/main/PHP/lemmikkirekisteri/user_functions) folder, functions to interact with the database is in the [db_functions.php](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/db_functions.php) file and views are in the [views](https://github.com/TuikkaTommi/portfolio/tree/main/PHP/lemmikkirekisteri/views) folder.

The [db_functions.php](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/db_functions.php) file contains all the functions that interact with the database using the php mysqli -extension. These functions are then used by other files by including this file in them.

## Session based login

The app implements a session-based login-system. When a user enters their credentials, the data is sent to [user_functions/create_session.php](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/user_functions/create_session.php) file, that handles creating a session. The file checks for the user in the db, and if it exists, checks that the credentials are correct. With successful login, the credentials are saved in the $_SESSION variable and the user is redirected to the list-view. If the login fails, a notification is displayed for the user.

The saved session-details are then used to determine the login-status across the application and different content is showed/available depending on the status.

## Adding/updating a pet

Adding a new pet to the registry is done using the [views/pet_form.php](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/views/pet_form.php) form. Only admins are able to access this form. The form posts the entered data to [pet_functions/addpet.php] file, that sanitizes the inputs with strip_tags()-method and checks if all required data was received. If all is successful, the following addpet()-function from [db_functions.php](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/db_functions.php) is used to insert the pet into the db:


```
function addPet($name, $species, $dateOfBirth, $allergies, $medication, $ownerName, $ownerPhone, $conn)
{
  $sql = "INSERT INTO pets (name, species, date_of_birth, allergies, medication, owner_name, owner_phone) VALUES ('$name', '$species', '$dateOfBirth', '$allergies', '$medication', '$ownerName', '$ownerPhone');";

  mysqli_query($conn, $sql) or die('Lemmikin lisäys epäonnistui' . mysqli_error($conn));
}
```

Updating an existing pet is done through the same form, but the existing pet is fetched from the db by its id and the fields are pre-filled. When updating, the data is posted to the [pet_functions/editpet.php](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/pet_functions/editpet.php) file, that updates a pet in the db with the editPet()-function.

## List of pets in the registry

Listing of the pets currently in the database is handled by the [views/list.php](https://github.com/TuikkaTommi/portfolio/blob/main/PHP/lemmikkirekisteri/views/list.php) file. The list is only available for a logged in user, and all modifying actions are only available for admins. The file fetches all pets from the db, and then displays each of them inside their own div-element with foreach. The list can be filtered to show only specific species. The filtering is done with a radio-button, that sends its selection back to the same file, reloadinig it. The pet-array is then filtered based on that selection:

```
$data = array_filter($data, function ($pet) use ($filter) {
        return ($pet['species'] == $filter);
      });
```

Array_filter uses a callback, because the array is two dimensional. 'use' allows the usage of a variable outside the current scope.
