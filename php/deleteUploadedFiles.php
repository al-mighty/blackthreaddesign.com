<?php

  $cwd = getcwd();
  $path = $cwd."/uploads/";

  if( isset( $_POST ) and $_SERVER['REQUEST_METHOD'] == "POST" ){


    foreach ($_FILES['files']['name'] as $f => $name) {

      if( file_exists($path . $name) ){

          unlink( $path . $name );

      }

    }

  }

?>