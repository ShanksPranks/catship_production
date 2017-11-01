 <?php

$csv = array_map('str_getcsv', file('zipcodes.txt'));
$array = array(92636, 92646, 92656, 92666);
$found = 0;

$fname = $_GET['zipcode'];

for($i=0; $i<count($array); $i++) {
      if($fname == $array[i])
      {
      $found = 1;
      }
  }

if ($found == 1)
	{
echo $_GET['callback'] . '(' . "{'validation' : 'found'}" . ')';
}
else
{
echo $_GET['callback'] . '(' . "{'validation' : 'not found'}" . ')';
}


//$fname = $_GET['firstname'];
  //    if($fname=='Jeff')
    //  {
          //header("Content-Type: application/json");
      //   echo $_GET['callback'] . '(' . "{'fullname' : 'Jeff Hansen'}" . ')';

      //}
      
?>