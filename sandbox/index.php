<!doctype html>
<html>
	<head>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

 <?php

$array = array(92636, 92646, 92656, 92666);
//$csv = array_map('str_getcsv', file('zipcodes.csv'));

$file = file_get_contents("zipcodes.txt");
$data = array_map("str_getcsv", preg_split('/\r*\n+|\r+/', $file));



$myText = "";
$mytext = $data[5];

print_r($mytext);

//print_r($array);
//print_r($array[3]);

//print_r($data);
print_r($data[3]);

//print_r($csv);

$found = 0;

$fname = 92646;

//print_r ($data[5]);

//print_r (count($data));

for($i=0; $i<30; $i++) {
	$myText = (string)$data[i];
	//print_r ('Stuff: ' . $myText);

  }

  print_r('Not Found!');
  ?>

<script>
var zips;
var client = new XMLHttpRequest();
client.open('GET', 'zipcodes.txt');
client.onreadystatechange = function() {
}
client.send();

zips = client.response;
console.log (client);

var temp = new Array();
// this will return an array with strings "1", "2", etc.
temp = client.responseText.split(",");

console.log( 'This is the length: ' + temp);


var zipcode = 92646;

$.getJSON('http://www.catship.co.za/sandbox/server.php?callback=?','zipcode='+zipcode,function(res){
    alert('Your zipcode is '+res.validation);
});

</script>

		</script>
    </head>
    <body>
    <div id="zips"></div>
    </body>
</html>