 <?php

$file = file_get_contents("zipcodes.txt");
$pieces = explode(",", $file);

$zipcode = $_GET['zipcode'];
$found = 0;

foreach ($pieces as &$value) {
    //print_r($value);
    //print_r('next one...');
	if ($zipcode == $value)
	{
		$found = 1;
	}
}


if ($found == 1)
	{
echo $_GET['callback'] . '(' . "{'validation' : 'true'}" . ')';
}
else
{
echo $_GET['callback'] . '(' . "{'validation' : 'false'}" . ')';
}


//$fname = $_GET['firstname'];
  //    if($fname=='Jeff')
    //  {
          //header("Content-Type: application/json");
      //   echo $_GET['callback'] . '(' . "{'fullname' : 'Jeff Hansen'}" . ')';

      //}
      
?>