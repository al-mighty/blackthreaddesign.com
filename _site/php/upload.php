<?php

  // Output JSON
  function outputJSON($msg, $status = 'error'){
      header('Content-Type: application/json');
      echo json_encode( array(
          'data' => $msg,
          'status' => $status
      ) );
  }


  function check_file_uploaded_name ($name)
  {
      (bool) ((preg_match("`^[-0-9A-Z_\.]+$`i",$name)) ? true : false);
  }

  function check_file_uploaded_length ($name)
  {
      return (bool) ((mb_strlen($name,"UTF-8") > 225) ? true : false);
  }

  $cwd = getcwd();
  $path = $cwd."/uploads/";

  if( isset( $_POST ) and $_SERVER['REQUEST_METHOD'] == "POST" ){

    $filenames = array();
    $num = 0;
    foreach ($_FILES['files']['name'] as $f => $name) {

      if( check_file_uploaded_name ($name) ) continue;
      if( check_file_uploaded_length ($name) ) continue;
      if( file_exists($path . $name) ){

          unlink( $path . $name );

      }

      if( move_uploaded_file( $_FILES["files"]["tmp_name"][$f], $path.$name ) ) {

        $filenames[ $num ] = $name;
        $num++;

      }


    }

    outputJSON($filenames, 'success' );

  }


?>