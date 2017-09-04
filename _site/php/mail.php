<?php
/* Set e-mail recipient */
$myemail  = "looeee@gmail.com";

/* Check all form inputs using check_input function */
$name = check_input($_POST['name'], "Please enter your name");
$email    = check_input($_POST['email']);
$message  = check_input($_POST['message'], "No message entered");
$subject = "Black Thread Message";
$mailheader = "From: $email \r\n";

/* If e-mail is not valid show error message */
if (!preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/", $email))
{
    show_error("E-mail address not valid");
}

/* Let's prepare the message for the e-mail */
$emailContent = "Black Thread Message

Name: $name
E-mail: $email
Message: $message

";

/* Send the message using mail() function */
mail( $myemail, $subject, $emailContent, $mailheader ) or die("Error!");

/* Redirect visitor to the thank you page */
header('Location: /thanks.html');
exit();


function check_input($data, $problem='')
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    if ($problem && strlen($data) == 0)
    {
        show_error($problem);
    }
    return $data;
}

function show_error($myError)
{
?>
    <html>
    <body>

    <b>Please correct the following error:</b><br />
    <?php echo $myError; ?>

    </body>
    </html>
<?php
exit();
}
?>
