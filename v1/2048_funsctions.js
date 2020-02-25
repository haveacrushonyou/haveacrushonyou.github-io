var grid;
var oldGrid = [[],[],[],[]];
var girdForCheckOver = [[],[],[],[]];
var row1, row2;
var col1, col1;

function drawGrid(){
	grid = [[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]];
	var table = document.getElementById("grid");
	var tr = table.getElementsByTagName("tr");
	getNum();
	grid[row1][col1] = Math.floor((Math.random() * 2) + 1) == 1 ? 2 : 4;
	var td = tr[row1].getElementsByTagName("td");
	td[col1].innerHTML = grid[row1][col1];
	td[col1].style.backgroundColor = getColor(grid[row1][col1]);
}

function afterRandom(){
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			if (i == row1 && j == col1) grid[i][j] = Math.floor((Math.random() * 2) + 1) == 1 ? 2 : 4;
		}
	}
	afterShifting();
}

function afterShifting(){
	var row = document.getElementsByTagName("tr");
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
				row[i].getElementsByTagName("td")[j].innerHTML = "";
				row[i].getElementsByTagName("td")[j].style.backgroundColor = "#CDC0B4";
		}
	}

	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			if (grid[i][j] != 0)
				row[i].getElementsByTagName("td")[j].innerHTML = grid[i][j];
				var color = getColor(grid[i][j]);
				row[i].getElementsByTagName("td")[j].style.backgroundColor = color;
		}
	}
}

function getNum(){
	do {
		row1 = Math.floor((Math.random() * 4));
		col1 = Math.floor((Math.random() * 4));
	}while (grid[row1][col1] != 0);
}

window.addEventListener("keydown", checkKey, false);

function checkKey(key){
	var keyValue = key.keyCode;
	//Copy the pre grid to compare
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			oldGrid[i][j] = grid[i][j];
	switch(key.keyCode){
		case 37 : //left
			leftArrow();
			addToTheLeft();
			leftArrow();
			afterShifting();
		break;
		case 39 : //right
			rightArrow();
			addToTheRight();
			rightArrow();
			afterShifting();
		break;
		case 38 : //up
			upArrow();
			addToTheTop()
			upArrow();
			afterShifting();
		break;
		case 40 : //down
			downArrow();
			addToTheBottom();
			downArrow();
			afterShifting();
		break;
		default :
		break;
	}
	
	if (!isChanged()){
		getNum();
		afterRandom();
		if (isGameOver())
			gameOverEffect();
		if (isWin())
			winEffect();
	}
}

function rightArrow(){
	var shift;
	for (var i = 0; i < grid.length; i++){
		shift = new Array();
		for (var j = 0; j < grid[i].length; j++){
			if (grid[i][j] != 0) shift.push(grid[i][j]);
			else shift.unshift(grid[i][j]);
		}
		grid[i] = shift;
	}
}

function leftArrow(){
	var shift;
	for (var i = 0; i < grid.length; i++){
		shift = new Array();
		for (var j = grid[i].length - 1; j >= 0; j--){
			if (grid[i][j] != 0) shift.unshift(grid[i][j]);
			else shift.push(grid[i][j]);
		}
		grid[i] = shift;
	}
}

function upArrow(){
	var shift;
	for (var i = 0; i < grid.length; i++){
		shift = new Array();
		for (var j = grid.length - 1; j >= 0 ; j--){
			if (grid[j][i] != 0) shift.unshift(grid[j][i]);
			else shift.push(grid[j][i]);
		}
		for (var k = 0; k < grid.length; k++){
			grid[k][i] = shift[k];
		}
	}
}

function downArrow(){
	var shift;
	for (var i = 0; i < grid.length; i++){
		shift = new Array();
		for (var j = 0; j < grid.length ; j++){
			if (grid[j][i] != 0) shift.push(grid[j][i]);
			else shift.unshift(grid[j][i]);
		}
		for (var j = 0; j < grid.length; j++){
			grid[j][i] = shift[j];
		}
	}
}

//Add a function to add the same two numbers when move to the left.
function addToTheLeft(){
	for (var i = 0; i < grid.length; i++){
		for (var j = 0; j < grid.length - 1; j++){
			if (grid[i][j] == grid[i][j+1]){
				grid[i][j] += grid[i][j+1];
				document.getElementById("mark").innerHTML = parseInt(document.getElementById("mark").innerHTML) + grid[i][j];
				grid[i][j+1] = 0;
			}
		}
	}
}
//Add a function to add the same two numbers when move to the right.
function addToTheRight(){
	for (var i = 0; i < grid.length; i++){
		for (var j = grid.length - 1; j > 0; j--){
			if (grid[i][j] == grid[i][j-1]){
				grid[i][j] += grid[i][j-1];
				document.getElementById("mark").innerHTML = parseInt(document.getElementById("mark").innerHTML) + grid[i][j];
				grid[i][j-1] = 0;
			}
		}
	}
}

//Add a function to add the same two numbers when move to the top.
function addToTheTop(){
	for (var i = 0; i < grid.length; i++){
		for (var j = 0; j < grid.length - 1; j++){
			if (grid[j][i] == grid[j+1][i]){
				grid[j][i] += grid[j+1][i];
				document.getElementById("mark").innerHTML = parseInt(document.getElementById("mark").innerHTML) + grid[j][i];
				grid[j+1][i] = 0;
			}
		}
	}
}

//Add a function to add the same two numbers when move to the top.
function addToTheBottom(){
	for (var i = 0; i < grid.length; i++){
		for (var j = grid.length - 1; j > 0; j--){
			if (grid[j][i] == grid[j-1][i]){
				grid[j][i] += grid[j-1][i];
				document.getElementById("mark").innerHTML = parseInt(document.getElementById("mark").innerHTML) + grid[j][i];
				grid[j-1][i] = 0;
			}
		}
	}
}

//Check isChanged in grid
function isChanged(){
	for (var i = 0; i < grid.length; i++){
		for (var j = 0; j < grid.length; j++){
			if (oldGrid[i][j] != grid[i][j]) {
				return false;
			}
		}
	}
	return true;
}

//Process game over event

function isFull(){
	for (var i = 0; i < grid.length; i++)
		for (var j = 0; j < grid.length; j++)
			if (grid[i][j] == 0) return false;
	return true;
}

function isGameOver(){
	if (isFull()){
		var count = 0;
		//Add left
		for (var i = 0; i < grid.length; i++)
			for (var j = 0; j < grid.length - 1; j++)
				if (grid[i][j] == grid[i][j+1])
					count++;

		//Add right
		for (var i = 0; i < grid.length; i++)
			for (var j = grid.length - 1; j > 0; j--)
				if (grid[i][j] == grid[i][j-1])
					count++;

		//Add top
		for (var i = 0; i < grid.length; i++)
			for (var j = 0; j < grid.length - 1; j++)
				if (grid[j][i] == grid[j+1][i])
					count++;
		//Add bottom
		for (var i = 0; i < grid.length; i++)
			for (var j = grid.length - 1; j > 0; j--)
				if (grid[j][i] == grid[j-1][i])
					count++;
		if (count == 0) {
			count = 0;
			return true;
		}else {
			count = 0;
			return false;
		}
	}else return false;
}

function gameOverEffect(){
	$(document).ready(function(){
		$("#main").fadeTo("slow", 0.5);
		$("#gameOverArea").show();
		$("#gameOverArea").fadeIn("slow", 0.13);
		tryAgain();	
	});
}

function tryAgain() {
	$(document).ready(function(){
		$("#btnTryAgain").click(function(){
			$("#gameOverArea").hide();
			//play again
			$(location).attr('href', '2048_ver1.html')
		});
	});
}

//Process win event
function isWin(){
	for (var i = 0; i < grid.length; i++)
		for (var j = 0; j < grid.length; j++)
			if (grid[i][j] == 2048) return true;
	return false;
}

function winEffect() {
	$(document).ready(function(){
		$("#main").fadeTo("slow", 0.5);
		$("#winArea").show();
		$("#winArea").fadeIn("slow", 0.13);
		keepPlaying();
	});
}

function keepPlaying(){
	$(document).ready(function(){
		$("#btnKeepPlaying").click(function(){
			$("#winArea").hide();
			$("#main").fadeIn("fast");
		});
	});
}

//Color of different numbers : 
// 2 : #EEE4DA
// 4 : #EDE0C8
// 8 : #F2B179
// 16 : #F59563
// 32 : #F67C5F
// 64 : #EF613B
// 128 : #ECCF73
// 256 : #E9CD62
// 512 : #EBC850
// 1024 : #FCEEC9
// 2048 : #EAC22D
// 4096 : #F8413D
// 8192 : #F7211F	
// 16384 : #F6221F
// 32768 : #F72320
// 65536 : #171717
function getColor(num){
	var color;
	switch (num){
		case 2 : 
			color = "#EEE4DA";
			break;
		case 4 :
			color = "#EDE0C8";
			break;
		case 8 :
			color = "#F2B179";
			break;
		case 16 :
			color = "#F59563";
			break;
		case 32 :
			color = "#F67C5F";
			break;
		case 64 :
			color = "#EF613B";
			break;
		case 128 :
			color = "#ECCF73";
			break;
		case 256 :
			color = "#E9CD62";
			break;
		case 512 :
			color = "#EBC850";
			break;
		case 1024 :
			color = "#FCEEC9";
			break;
		case 2048 :
			color = "#EAC22D";
			break;
	}
	return color;
}

