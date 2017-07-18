<?php

  $path = "/assets/uploads/loader/";
  $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

  if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST"){

    // Loop $_FILES to exeicute all files
    foreach ($_FILES['files']['name'] as $f => $name) {     
      
        if ($_FILES['files']['error'][$f] == 4) {

            continue; // Skip file if any error found

        }	       
        else{ // No error found! Move uploaded files 

            //checking if file exsists
            if(file_exists($path.$name)) unlink($path.$name);

            move_uploaded_file($_FILES["files"]["tmp_name"][$f], $path.$name)
    
        }

    }

  }

?>