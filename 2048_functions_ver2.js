//main board
var board;
//
//variable for comparing
var oldGrid = [[],[],[],[]];
//
var row1, row2;
var col1, col2;

//Stack
var myStack = {
	maxSize : 10,
	stack : new Array(10),
	nElem : 0,
	curIndex : -1,
	peek : function(){
		if (this.nElem > 0)
			return this.stack[this.curIndex];
	},
	pop : function (){
		if (this.nElem > 0){
			this.nElem--;
			return this.stack[this.curIndex--];
		}
	},
	push : function (value){
		if (this.nElem < this.maxSize){
			this.stack[++this.curIndex] = value;
			this.nElem++;
		}
	},
	display : function (){
		console.log("CurIndex : " + this.curIndex);
		console.log("Nelem : " + this.nElem);
		for (let i = 0 ; i < this.nElem; i++)
			console.log(this.stack[i]);
	}
};
//

//Queue
var myQueue = {
	queue : new Array(this.maxSize),
	nElem : 0,
	maxSize : 10,
	front : -1,
	rear : -1,
	enqueue : function (value) {
		if (this.nElem < this.maxSize){
			if (this.rear == -1 && this.front == -1){
				++this.rear;
				this.queue[++this.front] = value;
				this.nElem++;
			}else {
				this.queue[++this.rear] = value;
				this.nElem++;
			}
		}
	},
	dequeue : function (){
		var temp;
		if (this.nElem > 0){
			this.nElem--;
			temp = this.queue[this.front];
			this.queue[this.front++] = 0;
			if (this.front == this.rear+1) {
				this.front = this.rear = -1;
			}
			return temp;
		}
	},
	peek : function (){
		return this.queue[this.front];
	},
	display : function (){
		console.log("Front : " + this.front);
		console.log("Rear : " + this.rear);
		console.log("Nelem : " + this.nElem);
		for (let i = 0 ; i < this.nElem; i++){
			if (this.queue[i] != 0)
				console.log(this.queue[i]);
		}
	}
};
//

//function for cloning stack and queue without reference
function cloneObject(obj){
	return $.extend(true, {}, obj);
}
//

//variable for using undo feature
var gridUndo = cloneObject(myStack);
var listScoreUn = cloneObject(myStack);
//variable for using undo feature
var gridRedo = cloneObject(myStack);
var listScoreRe = cloneObject(myStack);
//
//variable for checking when score is greater than best
var curBest;
//
//variable for checking if player continue click arrows after click redo or undo button
var reunClicked;
//

//variable for storing previous playing time
var prePlay = {
	un : new Object(),
	re : new Object(),
	unscore : new Object(),
	rescore : new Object(),
	score : 0,
	curGrid : 0,
	isWin : false,
	isGameOver : false,
	scoreWin:2048,
	combo : 0,
	hasCombo : false
};
//

//score variable for winning
var winScore = 2048;
//

//set win score for paragraph below 2048 title
window.addEventListener('DOMContentLoaded', (event) => {
	document.querySelector("#to-win").innerHTML = document.querySelector("#to-win").innerHTML.replace("#winscore#", winScore);
});
//

//When win or over, prevent player continue pressing arrow keys
var isWinOrOver = false;
//

//my node object
var myNode = {
	data : 0,
	animation : "false",
	next : null,
	preCoord : ""
};

var linkedList = {
	nElem : 0,
	first : cloneObject(myNode),
	curNode : cloneObject(myNode),
	insertFirst : function (node){
		if (this.nElem <= 0){
			this.first = node;
			this.curNode = this.first;
		}
		else {
			node.next = this.first;
			this.first = node;
		}
		this.nElem++;
	},
	insertLast : function (node){
		if (this.nElem <= 0){
			this.first = node;
			this.curNode = this.first;
		}else {
			this.curNode.next = node;
			this.curNode = node;
		}
		this.nElem++;
	},
	display : function (){
		var temp = this.first;
		console.log(this.first);
		while (temp != null){
			console.log(temp.data);
			temp = temp.next;
		}
	}
}
//
var reload = false;
//
var combo = 0;
var hasCombo = false;
//
//
var x1 = -1, y1 = -1;
var x2 = -1, y2 = -1;
//

function drawGrid(){
	board = [[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]];
	var table = document.getElementById("board");
	var tr = table.getElementsByTagName("tr");

	getPrePlay();
	if (!reload){

		do {
			row1 = Math.floor((Math.random() * 4));
			col1 = Math.floor((Math.random() * 4));
		}while (board[row1][col1] != 0);	

		do {
			row2 = Math.floor((Math.random() * 4));
			col2 = Math.floor((Math.random() * 4));
		}while (board[row2][col2] != 0 || (row2 == row1 && col2 == col1));

		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				if (i == row1 && j == col1) board[i][j] = Math.floor((Math.random() * 2) + 1) == 1 ? 2 : 4;
				if (i == row2 && j == col2) board[i][j] = Math.floor((Math.random() * 2) + 1) == 1 ? 2 : 4;
			}
		}
		
		board[row1][col1] = Math.floor((Math.random() * 2) + 1) == 1 ? 2 : 4;
		tr[row1].getElementsByTagName("td")[col1].dataset.move = row1+","+col1;
		var td = tr[row1].getElementsByTagName("td");

		td[col1].appendChild(document.createElement("div"));
		td[col1].children[td[col1].children.length-1].classList.add("divmove");
		td[col1].children[td[col1].children.length-1].style.backgroundColor = getColor(board[row1][col1]);
		td[col1].children[td[col1].children.length-1].classList.add("skewCell");
		var t = function (t, c){
			return function(){
				t[c].children[t[c].children.length-1].classList.remove("skewCell");
			}
		};
		setTimeout(t(td, col1), 100);
		td[col1].children[td[col1].children.length-1].innerHTML = board[row1][col1];

		board[row2][col2] = Math.floor((Math.random() * 2) + 1) == 1 ? 2 : 4;
		tr[row2].getElementsByTagName("td")[col2].dataset.move = row2+","+col2;
		var td = tr[row2].getElementsByTagName("td");
		td[col2].appendChild(document.createElement("div"));
		td[col2].children[td[col2].children.length-1].classList.add("divmove");
		td[col2].children[td[col2].children.length-1].style.backgroundColor = getColor(board[row2][col2]);
		td[col2].children[td[col2].children.length-1].classList.add("skewCell");
		var t = function (t, c){
			return function(){
				t[c].children[t[c].children.length-1].classList.remove("skewCell");
			}
		};
		setTimeout(t(td, col2), 100);
		td[col2].children[td[col2].children.length-1].innerHTML = board[row2][col2];

		//Save the first board when press new game or try again button
		savePrePlay();
	}else afterShifting();
}


function afterRandom(){
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			if (i == row1 && j == col1) board[i][j] = Math.floor((Math.random() * 2) + 1) == 1 ? 2 : 4;
		}
	}
	afterShifting();
}

function afterShifting(){
	var row = document.getElementsByTagName("tr");
	var test;
	var c;
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			// test = row[i].getElementsByTagName("td")[j].children[row[i].getElementsByTagName("td")[j].children.length-1];
			// if (test != undefined){
			// 	c = row[i].getElementsByTagName("td")[j];
			// 	if (c.dataset.move != ""){
			// 		var q = parseInt(c.dataset.move.split(",")[0]);
			// 		var w = parseInt(c.dataset.move.split(",")[1]);
			// 		row[q].getElementsByTagName("td")[w].children[row[q].getElementsByTagName("td")[w].children.length-1].style.animation = "moveright2 .5s";
			// 	}
			// }
			row[i].getElementsByTagName("td")[j].innerHTML = "";
			row[i].getElementsByTagName("td")[j].style.backgroundColor = "#CDC0B4";
			if (board[i][j] != 0){
				row[i].getElementsByTagName("td")[j].appendChild(document.createElement("div"));
				row[i].getElementsByTagName("td")[j].children[row[i].getElementsByTagName("td")[j].children.length-1].innerHTML = board[i][j];
				row[i].getElementsByTagName("td")[j].children[row[i].getElementsByTagName("td")[j].children.length-1].classList.add("divmove");
				row[i].getElementsByTagName("td")[j].children[row[i].getElementsByTagName("td")[j].children.length-1].style.backgroundColor = getColor(board[i][j]);
				if (row[i].getElementsByTagName("td")[j].dataset.animation == "true"){
					var t = function (t, c){
						return function(){
							t[c].children[t[c].children.length-1].classList.remove("skewCell");
							t[c].dataset.animation = "false";
						}
					};
					row[i].getElementsByTagName("td")[j].children[row[i].getElementsByTagName("td")[j].children.length-1].classList.add("skewCell");
					setTimeout(t(row[i].getElementsByTagName("td"), j), 100);
				}
			}
		}
	}
	if (combo >= 5){
		hasCombo = true;
		combo -= 5;
		document.getElementById("lost").style.display = "block";
		setFunctionForChagingPosition();
	}
}

function setFunctionForChagingPosition(){
	var row = document.getElementsByTagName("tr");
	var aFunction;
	for (var i = 0; i < board.length; i++){
		for (var j = 0; j < board[i].length; j++){
			aFunction = function (tr, td){
				return function (){
					changePosition(tr, td);
				}
			}
			row[i].getElementsByTagName("td")[j].onclick = aFunction(row[i].getElementsByTagName("td")[j].parentElement, row[i].getElementsByTagName("td")[j]);
		}
	}
}

function changePosition(tr, td){
	console.log("Row : " + tr.rowIndex + "    " + "Column : " + td.cellIndex);
	var row = document.getElementsByTagName("tr");
	if (x1 != -1 && y1 != -1){
		if (td.cellIndex == x1 && tr.rowIndex == y1){
			row[y1].getElementsByTagName("td")[x1].children[row[y1].getElementsByTagName("td")[x1].children.length-1].style.backgroundColor = getColor(parseInt(row[y1].getElementsByTagName("td")[x1].children[row[y1].getElementsByTagName("td")[x1].children.length-1].innerHTML));
			x1 = y1 = -1;
			x2 = y2 = -1;
		}else{
			x2 = td.cellIndex;
			y2 = tr.rowIndex;
			var temp = board[y1][x1];
			board[y1][x1] = board[y2][x2];
			board[y2][x2] = temp;
			afterShifting();
			x1 = y1 = -1;
			x2 = y2 = -1;
			document.getElementById("lost").style.display = "none";
			//Remove change postion function
			for (var i = 0; i < board.length; i++){
				for (var j = 0; j < board[i].length; j++){
					row[i].getElementsByTagName("td")[j].onclick = null;
				}
			}
			//
			if (combo > 0 ){
				document.getElementById("combo").style.display = "block";
				document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, combo);
			}else{
				document.getElementById("lost").style.display = "none";
				document.getElementById("combo").style.display = "none";
				document.getElementById("combo").innerHTML = "COMBO <strong>#combo#</strong>";
			}
			hasCombo = false;
			savePrePlay();
		}
	}else {
		x1 = td.cellIndex;
		y1 = tr.rowIndex;
		row[y1].getElementsByTagName("td")[x1].children[row[y1].getElementsByTagName("td")[x1].children.length-1].style.backgroundColor = "red";
	}
}

function getNum(){
	do {
		row1 = Math.floor((Math.random() * 4));
		col1 = Math.floor((Math.random() * 4));
	}while (board[row1][col1] != 0);
}

window.addEventListener("keydown", checkKey, false);

function checkKey(key){
	if (!isWinOrOver){
		var keyValue = key.keyCode;
		//Copy the pre board for comparing
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++)
				oldGrid[i][j] = board[i][j];
			switch(key.keyCode){
			case 37 : //left
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
					//Remove change postion function
					var row = document.getElementsByTagName("tr");
					for (var i = 0; i < board.length; i++){
						for (var j = 0; j < board[i].length; j++){
							row[i].getElementsByTagName("td")[j].onclick = null;
						}
					}
					//
					hasCombo = false;
					document.getElementById("lost").style.display = "none";
				}
				leftArrow();
				addToTheLeft();
				leftArrow();
				afterShifting();
				break;
			case 39 : //right
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
					//Remove change postion function
					var row = document.getElementsByTagName("tr");
					for (var i = 0; i < board.length; i++){
						for (var j = 0; j < board[i].length; j++){
							row[i].getElementsByTagName("td")[j].onclick = null;
						}
					}
					//
					hasCombo = false;
					document.getElementById("lost").style.display = "none";
				}
				rightArrow();
				addToTheRight();
				rightArrow();
				afterShifting();
				break;
			case 38 : //up
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
					//Remove change postion function
					var row = document.getElementsByTagName("tr");
					for (var i = 0; i < board.length; i++){
						for (var j = 0; j < board[i].length; j++){
							row[i].getElementsByTagName("td")[j].onclick = null;
						}
					}
					//
					hasCombo = false;
					document.getElementById("lost").style.display = "none";
				}
				upArrow();
				addToTheTop()
				upArrow();
				afterShifting();
				break;
			case 40 : //down
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
					//Remove change postion function
					var row = document.getElementsByTagName("tr");
					for (var i = 0; i < board.length; i++){
						for (var j = 0; j < board[i].length; j++){
							row[i].getElementsByTagName("td")[j].onclick = null;
						}
					}
					//
					hasCombo = false;
					document.getElementById("lost").style.display = "none";
				}
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

			//Undo and Redo tasks
			if (reunClicked == 1){
				document.getElementById("un-time").innerHTML = 0;
				document.getElementById("re-time").innerHTML = 0;
				gridRedo = cloneObject(myStack);
				gridUndo = cloneObject(myStack);
				reunClicked++;
			}

			if (gridUndo.nElem > 0){
				if (gridUndo.nElem == 10){
					for (var i = 0; i < gridUndo.nElem-1; i++){
						gridUndo.stack[i] = gridUndo.stack[i+1];
					}
					gridUndo.pop();
					gridUndo.push(returnString(oldGrid));
				}else {
					document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
					gridUndo.push(returnString(oldGrid));
				}
			}else {
				document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
				gridUndo.push(returnString(oldGrid));
			}
			savePrePlay();
		}
	}
}

function rightArrow(){
	var linkedListToRight = cloneObject(linkedList);
	var tempNode;
	var k = 0;
	var row = document.getElementsByTagName("tr");
	for (var i = 0; i < board.length; i++){
		for (var j = 0; j < board[i].length; j++){
			if (board[i][j] != 0){
				tempNode = cloneObject(myNode);
				tempNode.data = board[i][j];
				tempNode.animation = row[i].getElementsByTagName("td")[j].dataset.animation;
				tempNode.preCoord = row[i].getElementsByTagName("td")[j].dataset.move;
				row[i].getElementsByTagName("td")[j].dataset.animation = "false";
				linkedListToRight.insertLast(tempNode);
			}else {
				tempNode = cloneObject(myNode);
				tempNode.data = board[i][j];
				tempNode.animation = row[i].getElementsByTagName("td")[j].dataset.animation;
				row[i].getElementsByTagName("td")[k].dataset.move;
				row[i].getElementsByTagName("td")[j].dataset.animation = "false";
				linkedListToRight.insertFirst(tempNode);
			}
		}
		while (linkedListToRight.first != null){
			if (row[i].getElementsByTagName("td")[k].dataset.cur == ""){
				row[i].getElementsByTagName("td")[k].dataset.move = linkedListToRight.first.preCoord;
				row[i].getElementsByTagName("td")[k].dataset.cur = i+","+k;
			}else{
				var xx =  row[i].getElementsByTagName("td")[k].dataset.cur.split(",")[1];
				var yy =  row[i].getElementsByTagName("td")[k].dataset.cur.split(",")[0];
			}
			board[i][k] = linkedListToRight.first.data;
			row[i].getElementsByTagName("td")[k++].dataset.animation = linkedListToRight.first.animation;
			linkedListToRight.first = linkedListToRight.first.next;
		}
		k = 0;
		linkedListToRight = cloneObject(linkedList);
	}
}

function leftArrow(){
	var linkedListToLeft = cloneObject(linkedList);
	var tempNode;
	var k = 0;
	var row = document.getElementsByTagName("tr");
	for (var i = 0; i < board.length; i++){
		for (var j = board[i].length-1; j >= 0; j--){
			if (board[i][j] != 0){
				tempNode = cloneObject(myNode);
				tempNode.data = board[i][j];
				tempNode.animation = row[i].getElementsByTagName("td")[j].dataset.animation;
				row[i].getElementsByTagName("td")[j].dataset.animation = "false";
				linkedListToLeft.insertFirst(tempNode);
			}else {
				tempNode = cloneObject(myNode);
				tempNode.data = board[i][j];
				tempNode.animation = row[i].getElementsByTagName("td")[j].dataset.animation;
				row[i].getElementsByTagName("td")[j].dataset.animation = "false";
				linkedListToLeft.insertLast(tempNode);
			}
		}
		while (linkedListToLeft.first != null){
			board[i][k] = linkedListToLeft.first.data;
			row[i].getElementsByTagName("td")[k++].dataset.animation = linkedListToLeft.first.animation;
			linkedListToLeft.first = linkedListToLeft.first.next;
		}
		k = 0;
		linkedListToLeft = cloneObject(linkedList);
	}
}

function upArrow(){
	var linkedListToTop = cloneObject(linkedList);
	var tempNode;
	var k = 0;
	var row = document.getElementsByTagName("tr");
	for (var i = 0; i < board.length; i++){
		for (var j = board.length - 1; j >= 0 ; j--){
			if (board[j][i] != 0){
				tempNode = cloneObject(myNode);
				tempNode.data = board[j][i];
				tempNode.animation = row[j].getElementsByTagName("td")[i].dataset.animation;
				row[j].getElementsByTagName("td")[i].dataset.animation = "false";
				linkedListToTop.insertFirst(tempNode);
			}else {
				tempNode = cloneObject(myNode);
				tempNode.data = board[j][i];
				tempNode.animation = row[j].getElementsByTagName("td")[i].dataset.animation;
				row[j].getElementsByTagName("td")[i].dataset.animation = "false";
				linkedListToTop.insertLast(tempNode);
			}
		}
		while (linkedListToTop.first != null){
			board[k][i] = linkedListToTop.first.data;
			row[k++].getElementsByTagName("td")[i].dataset.animation = linkedListToTop.first.animation;
			linkedListToTop.first = linkedListToTop.first.next;

			// board[k++][i] = linkedListToTop.first.data;
			// linkedListToTop.first = linkedListToTop.first.next;
		}
		k = 0;
		linkedListToTop = cloneObject(linkedList);
	}
}

function downArrow(){
	var linkedListToBottom = cloneObject(linkedList);
	var tempNode;
	var k = 0;
	var row = document.getElementsByTagName("tr");
	for (var i = 0; i < board.length; i++){
		for (var j = 0; j < board.length ; j++){
			if (board[j][i] != 0){
				tempNode = cloneObject(myNode);
				tempNode.data = board[j][i];
				tempNode.animation = row[j].getElementsByTagName("td")[i].dataset.animation;
				row[j].getElementsByTagName("td")[i].dataset.animation = "false";
				linkedListToBottom.insertLast(tempNode);
			}else {
				tempNode = cloneObject(myNode);
				tempNode.data = board[j][i];
				tempNode.animation = row[j].getElementsByTagName("td")[i].dataset.animation;
				row[j].getElementsByTagName("td")[i].dataset.animation = "false";
				linkedListToBottom.insertFirst(tempNode);
			}
		}
		while (linkedListToBottom.first != null){
			board[k][i] = linkedListToBottom.first.data;
			row[k++].getElementsByTagName("td")[i].dataset.animation = linkedListToBottom.first.animation;
			linkedListToBottom.first = linkedListToBottom.first.next;

			/*board[k++][i] = linkedListToBottom.first.data;
			linkedListToBottom.first = linkedListToBottom.first.next;*/
		}
		k = 0;
		linkedListToBottom = cloneObject(linkedList);
	}
}

//Add a function to add the same two numbers when move to the left.
function addToTheLeft(){
	/*console.log("left");*/
	var row = document.getElementsByTagName("tr");
	var tempScore = 0 ;
	var checkCombo = false;
	for (var i = 0; i < board.length; i++){
		for (var j = 0; j < board.length - 1; j++){
			if (board[i][j] == board[i][j+1]){
				board[i][j] += board[i][j+1];

				document.getElementById("score-title").innerHTML = parseInt(document.getElementById("score-title").innerHTML) + board[i][j];
				
				
				if (board[i][j] > 0){
					row[i].getElementsByTagName("td")[j].dataset.animation = "true";
					checkCombo = true;
					combo++;
					if (combo > 0){
						if (document.getElementById("combo").innerHTML.search("#combo#") != -1){
							document.getElementById("combo").style.display = "block";
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace("#combo#", combo);
						}else {
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, combo);
						}
					}
				}

				tempScore += board[i][j];
				if (parseInt(document.getElementById("score-title").innerHTML) > curBest){
					curBest = parseInt(document.getElementById("score-title").innerHTML);
					document.getElementById("best-title").innerHTML = curBest;
					saveBestScore();
				}
				board[i][j+1] = 0;
			}
		}
	}

	if (!checkCombo) {
		combo = 0;
		document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, "#combo#");
		document.getElementById("combo").style.display = "none";
	}

	//Animation plus score
	if (tempScore > 0){
		document.getElementById("plus-animation").innerHTML = "+" + tempScore;
		document.getElementById("plus-animation").classList.add("plus");
		setTimeout(function(){document.getElementById("plus-animation").classList.remove("plus");}, 700);
	}
	//
	/*console.log(tempScore);*/
	if (listScoreUn.nElem > 0){
		if (listScoreUn.nElem == 10){
			for (var i = 0; i < listScoreUn.nElem-1; i++){
				listScoreUn.stack[i] = listScoreUn.stack[i+1];
			}
			listScoreUn.pop();
			listScoreUn.push(tempScore);
		}else {
			listScoreUn.push(tempScore);
		}
		
	}else {
		listScoreUn.push(tempScore);
	}
}
//Add a function to add the same two numbers when move to the right.
function addToTheRight(){
	/*console.log("rigth");*/
	var row = document.getElementsByTagName("tr");
	var tempScore = 0 ;
	var checkCombo = false;
	for (var i = 0; i < board.length; i++){
		for (var j = board.length - 1; j > 0; j--){
			if (board[i][j] == board[i][j-1]){
				board[i][j] += board[i][j-1];

				document.getElementById("score-title").innerHTML = parseInt(document.getElementById("score-title").innerHTML) + board[i][j];
				
				//Animation plus score
				if (board[i][j] > 0){
					row[i].getElementsByTagName("td")[j].dataset.move = row[i].getElementsByTagName("td")[j-1].dataset.move;
					row[i].getElementsByTagName("td")[j].dataset.animation = "true";
					checkCombo = true;
					combo++;
					if (combo > 0){
						if (document.getElementById("combo").innerHTML.search("#combo#") != -1){
							document.getElementById("combo").style.display = "block";
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace("#combo#", combo);
						}else {
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, combo);
						}
					}
				}
				tempScore += board[i][j];
				if (parseInt(document.getElementById("score-title").innerHTML) > curBest){
					curBest = parseInt(document.getElementById("score-title").innerHTML);
					document.getElementById("best-title").innerHTML = curBest;
					saveBestScore();
				}
				board[i][j-1] = 0;
			}
		}
	}

	if (!checkCombo) {
		combo = 0;
		document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, "#combo#");
		document.getElementById("combo").style.display = "none";
	}

	//Animation plus score
	if (tempScore > 0){
		document.getElementById("plus-animation").innerHTML = "+" + tempScore;
		document.getElementById("plus-animation").classList.add("plus");
		setTimeout(function(){document.getElementById("plus-animation").classList.remove("plus");}, 500);
	}
	//
	/*console.log(tempScore);*/
	if (listScoreUn.nElem > 0){
		if (listScoreUn.nElem == 10){
			for (var i = 0; i < listScoreUn.nElem-1; i++){
				listScoreUn.stack[i] = listScoreUn.stack[i+1];
			}
			listScoreUn.pop();
			listScoreUn.push(tempScore);
		}else {
			listScoreUn.push(tempScore);
		}
		
	}else {
		listScoreUn.push(tempScore);
	}
}

//Add a function to add the same two numbers when move to the top.
function addToTheTop(){
	/*console.log("top");*/
	var row = document.getElementsByTagName("tr");
	var tempScore = 0 ;
	var checkCombo = false;
	for (var i = 0; i < board.length; i++){
		for (var j = 0; j < board.length - 1; j++){
			if (board[j][i] == board[j+1][i]){
				board[j][i] += board[j+1][i];

				document.getElementById("score-title").innerHTML = parseInt(document.getElementById("score-title").innerHTML) + board[j][i];
				
				if (board[j][i] > 0){
					row[j].getElementsByTagName("td")[i].dataset.animation = "true";
					checkCombo = true;
					combo++;
					if (combo > 0){
						if (document.getElementById("combo").innerHTML.search("#combo#") != -1){
							document.getElementById("combo").style.display = "block";
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace("#combo#", combo);
						}else {
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, combo);
						}
					}
				}
				tempScore += board[j][i];
				if (parseInt(document.getElementById("score-title").innerHTML) > curBest){
					curBest = parseInt(document.getElementById("score-title").innerHTML);
					document.getElementById("best-title").innerHTML = curBest;
					saveBestScore();
				}
				board[j+1][i] = 0;
			}
		}
	}

	if (!checkCombo) {
		combo = 0;
		document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, "#combo#");
		document.getElementById("combo").style.display = "none";
	}

	//Animation plus score
	if (tempScore > 0){
		document.getElementById("plus-animation").innerHTML = "+" + tempScore;
		document.getElementById("plus-animation").classList.add("plus");
		setTimeout(function(){document.getElementById("plus-animation").classList.remove("plus");}, 500);
	}
	//
	/*console.log(tempScore);*/
	if (listScoreUn.nElem > 0){
		if (listScoreUn.nElem == 10){
			for (var i = 0; i < listScoreUn.nElem-1; i++){
				listScoreUn.stack[i] = listScoreUn.stack[i+1];
			}
			listScoreUn.pop();
			listScoreUn.push(tempScore);
		}else {
			listScoreUn.push(tempScore);
		}
		
	}else {
		listScoreUn.push(tempScore);
	}
}
//Add a function to add the same two numbers when move to the top.
function addToTheBottom(){
	/*console.log("bottom");*/
	var row = document.getElementsByTagName("tr");
	var tempScore = 0 ;
	var checkCombo = false;
	for (var i = 0; i < board.length; i++){
		for (var j = board.length - 1; j > 0; j--){
			if (board[j][i] == board[j-1][i]){
				board[j][i] += board[j-1][i];

				document.getElementById("score-title").innerHTML = parseInt(document.getElementById("score-title").innerHTML) + board[j][i];
				
				
				if (board[j][i] > 0){
					row[j].getElementsByTagName("td")[i].dataset.animation = "true";
					checkCombo = true;
					combo++;
					if (combo > 0){
						if (document.getElementById("combo").innerHTML.search("#combo#") != -1){
							document.getElementById("combo").style.display = "block";
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace("#combo#", combo);
						}else {
							document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, combo);
						}
					}
				}
				tempScore += board[j][i];
				if (parseInt(document.getElementById("score-title").innerHTML) > curBest){
					curBest = parseInt(document.getElementById("score-title").innerHTML);
					document.getElementById("best-title").innerHTML = curBest;
					saveBestScore();
				}
				board[j-1][i] = 0;
			}
		}
	}

	if (!checkCombo) {
		combo = 0;
		document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace(/[0-9]+/, "#combo#");
		document.getElementById("combo").style.display = "none";
	}

	//Animation plus score
	if (tempScore > 0){
		document.getElementById("plus-animation").innerHTML = "+" + tempScore;
		document.getElementById("plus-animation").classList.add("plus");
		setTimeout(function(){document.getElementById("plus-animation").classList.remove("plus");}, 500);
	}
	//
	/*console.log(tempScore);*/
	if (listScoreUn.nElem > 0){
		if (listScoreUn.nElem == 10){
			for (var i = 0; i < listScoreUn.nElem-1; i++){
				listScoreUn.stack[i] = listScoreUn.stack[i+1];
			}
			listScoreUn.pop();
			listScoreUn.push(tempScore);
		}else {
			listScoreUn.push(tempScore);
		}
		
	}else {
		listScoreUn.push(tempScore);
	}
}

//Check isChanged in board
function isChanged(){
	for (var i = 0; i < board.length; i++){
		for (var j = 0; j < board.length; j++){
			if (oldGrid[i][j] != board[i][j]) {
				return false;
			}
		}
	}
	return true;
}

//Process game over event

function isFull(){
	for (var i = 0; i < board.length; i++)
		for (var j = 0; j < board.length; j++)
			if (board[i][j] == 0) return false;
		return true;
	}

	function isGameOver(){
		if (isFull()){
			var count = 0;
		//Add left
		for (var i = 0; i < board.length; i++)
			for (var j = 0; j < board.length - 1; j++)
				if (board[i][j] == board[i][j+1])
					count++;

		//Add right
		for (var i = 0; i < board.length; i++)
			for (var j = board.length - 1; j > 0; j--)
				if (board[i][j] == board[i][j-1])
					count++;

		//Add top
		for (var i = 0; i < board.length; i++)
			for (var j = 0; j < board.length - 1; j++)
				if (board[j][i] == board[j+1][i])
					count++;
		//Add bottom
		for (var i = 0; i < board.length; i++)
			for (var j = board.length - 1; j > 0; j--)
				if (board[j][i] == board[j-1][i])
					count++;
				if (count == 0) {
					count = 0;
					isWinOrOver = true;
					prePlay.isGameOver = true;
					savePrePlay();
					return true;
				}else {
					count = 0;
					return false;
				}
			}else return false;
		}

		function gameOverEffect(){
			$(document).ready(function(){
				$("#board").fadeTo("slow", 0.5);
				$("#gameOverArea").show();
				$("#gameOverArea").fadeIn("slow", 0.13);
				/*tryAgain()*/;	
			});
		}

//Process win event
function isWin(){
	for (var i = 0; i < board.length; i++)
		for (var j = 0; j < board.length; j++)
			if (board[i][j] == winScore) {
				isWinOrOver = true;
				prePlay.isWin = true;
				savePrePlay();
				return true;
			}
			return false;
		}

		function winEffect() {
			$(document).ready(function(){
				$("#board").fadeTo("slow", 0.5);
				$("#winArea").show();
				$("#winArea").fadeIn("slow", 0.13);
				keepPlaying();
			});
		}

		function keepPlaying(){
			$(document).ready(function(){
				$("#btnKeepPlaying").click(function(){
					$("#winArea").hide();
					$("#board").animate({opacity:'1'});
					document.querySelector("#to-win").innerHTML = document.querySelector("#to-win").innerHTML.replace(winScore+"", winScore*2);
					isWinOrOver = false;
					winScore *= 2;
					prePlay.isWin = false;
					prePlay.scoreWin = winScore;
					savePrePlay();
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
		case 4096 :
		color = "#F8413D";
		break;
	}
	return color;
}


//function for wirting best score in local storage
function getBestScore(){
	if (typeof(Storage) !== "undefined") {
		if (localStorage.getItem("best") != null){
			document.getElementById("best-title").innerHTML = localStorage.getItem("best");
			curBest = parseInt(localStorage.getItem("best"));
		}else {
			localStorage.setItem("best", 0);
			document.getElementById("best-title").innerHTML = localStorage.getItem("best");
			curBest = parseInt(localStorage.getItem("best"));
		}
	} else {
		document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
}

function saveBestScore (){
	localStorage.setItem("best", document.getElementById("best-title").innerHTML);
}

//function for saving and taking previous playing time
function getPrePlay(){
	var row = document.getElementsByTagName("tr");
	for (var i = 0; i < row.length; i++)
		for (var j = 0; j < row.length; j++)
			row[i].getElementsByTagName("td")[j].dataset.animation = "false";
		if (typeof(Storage) !== "undefined") {
			if (localStorage.getItem("previous") != null){
				var obj = JSON.parse(localStorage.getItem("previous"));
				if (obj.un.nElem > 0 || obj.re.nElem > 0) reunClicked = 0;
				if (!obj.isWin && !obj.isGameOver){
					document.getElementById("score-title").innerHTML = obj.score;

					gridUndo.stack = obj.un.stack;
					gridUndo.nElem = obj.un.nElem;
					gridUndo.curIndex = obj.un.curIndex;

					gridRedo.stack = obj.re.stack;
					gridRedo.nElem = obj.re.nElem;
					gridRedo.curIndex = obj.re.curIndex;

					listScoreUn.stack = obj.unscore.stack;
					listScoreUn.nElem = obj.unscore.nElem;
					listScoreUn.curIndex = obj.unscore.curIndex;

					listScoreRe.stack = obj.rescore.stack;
					listScoreRe.nElem = obj.rescore.nElem;
					listScoreRe.curIndex = obj.rescore.curIndex;
					board = obj.curGrid;
					document.querySelector("#to-win").innerHTML = document.querySelector("#to-win").innerHTML.replace(winScore+"", obj.scoreWin);
					winScore = obj.scoreWin;
					hasCombo = obj.hasCombo;
					if (obj.hasCombo){
						setFunctionForChagingPosition();
						document.getElementById("lost").style.display = "block";
					}
					if (obj.combo > 0){
						combo = obj.combo;
						document.getElementById("combo").style.display = "block";
						/*if (obj.combo == 5)*/

						document.getElementById("combo").innerHTML = document.getElementById("combo").innerHTML.replace("#combo#", combo);
					}

					reload = true;

					document.getElementById("un-time").innerHTML = obj.un.nElem;
					document.getElementById("re-time").innerHTML = obj.re.nElem;
					afterShifting();
				}else {
					if (obj.isWin){
						isWinOrOver = true;
						winEffect();
					}
					if (obj.isGameOver){
						isWinOrOver = true;
						newGame();
					}
				}
			}else {
				savePrePlay();
			}
		} else {
			document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
		}
	}

	function savePrePlay(){
		prePlay.un = cloneObject(gridUndo);
		prePlay.re = cloneObject(gridRedo);
		prePlay.unscore = cloneObject(listScoreUn);
		prePlay.rescore = cloneObject(listScoreRe);
		prePlay.score = parseInt(document.getElementById("score-title").innerHTML);
		prePlay.curGrid = board;
		prePlay.scoreWin = winScore;
		prePlay.combo = combo;
		prePlay.hasCombo = hasCombo;
		localStorage.setItem("previous", JSON.stringify(prePlay));
	}

//Undo and redo functions
function undo(){
	var count = 0;
	if (gridUndo.nElem > 0){
		/*console.log(gridUndo);*/
		reunClicked = 0;
		var temp = gridUndo.pop();
		document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) - 1;
		document.getElementById("re-time").innerHTML = parseInt(document.getElementById("re-time").innerHTML) + 1;
		gridRedo.push(returnString(board));
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				board[i][j] = parseInt(temp.split("-")[count++]);	
			}
		}
		var tempScore = listScoreUn.pop();
		listScoreRe.push(tempScore);
		document.getElementById("score-title").innerHTML = parseInt(document.getElementById("score-title").innerHTML) - tempScore;
		afterShifting();
		savePrePlay();
	}else{
		
	}
	
}

function redo(){
	var count = 0;
	if (gridRedo.nElem > 0){
		/*console.log(gridRedo);*/
		reunClicked = 0;
		var temp = gridRedo.pop();
		document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
		document.getElementById("re-time").innerHTML = parseInt(document.getElementById("re-time").innerHTML) - 1;
		gridUndo.push(returnString(board));
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				board[i][j] = parseInt(temp.split("-")[count++]);	
			}
		}
		var tempScore = listScoreRe.pop();
		listScoreUn.push(tempScore);
		document.getElementById("score-title").innerHTML = parseInt(document.getElementById("score-title").innerHTML) + tempScore;
		afterShifting();
		savePrePlay();
	}else {

	}
}

function returnString(a){
	var str = "";
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			str += (a[i][j] + "-");
		}
	}
	return str;
}

function newGame(){
	localStorage.removeItem("previous");
	location.reload();
}

window.addEventListener("DOMContentLoaded", function(){
	//up
	document.querySelector(".navigation1 button").addEventListener("click", function(){
		if (!isWinOrOver){
		//Copy the pre board for comparing
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++)
				oldGrid[i][j] = board[i][j];
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
				//Remove change postion function
				var row = document.getElementsByTagName("tr");
				for (var i = 0; i < board.length; i++){
					for (var j = 0; j < board[i].length; j++){
						row[i].getElementsByTagName("td")[j].onclick = null;
					}
				}
				//
				hasCombo = false;
				document.getElementById("lost").style.display = "none";
			}
			upArrow();
			addToTheTop()
			upArrow();
			afterShifting();

			if (!isChanged()){
				getNum();
				afterRandom();
				if (isGameOver())
					gameOverEffect();
				if (isWin())
					winEffect();

			//Undo and Redo tasks
			if (reunClicked == 1){
				document.getElementById("un-time").innerHTML = 0;
				document.getElementById("re-time").innerHTML = 0;
				gridRedo = cloneObject(myStack);
				gridUndo = cloneObject(myStack);
				reunClicked++;
			}

			if (gridUndo.nElem > 0){
				if (gridUndo.nElem == 10){
					for (var i = 0; i < gridUndo.nElem-1; i++){
						gridUndo.stack[i] = gridUndo.stack[i+1];
					}
					gridUndo.pop();		
					gridUndo.push(returnString(oldGrid));
				}else {
					document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
					gridUndo.push(returnString(oldGrid));
				}
			}else {
				document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
				gridUndo.push(returnString(oldGrid));
			}
			savePrePlay();
		}
	}
});
	//left
document.querySelector(".navigation2 button:first-child").addEventListener("click", function(){
		if (!isWinOrOver){
		//Copy the pre board for comparing
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++)
				oldGrid[i][j] = board[i][j];
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
					//Remove change postion function
					var row = document.getElementsByTagName("tr");
					for (var i = 0; i < board.length; i++){
						for (var j = 0; j < board[i].length; j++){
							row[i].getElementsByTagName("td")[j].onclick = null;
						}
					}
					//
					hasCombo = false;
					document.getElementById("lost").style.display = "none";
				}
				leftArrow();
				addToTheLeft();
				leftArrow();
				afterShifting();

			if (!isChanged()){
				getNum();
				afterRandom();
				if (isGameOver())
					gameOverEffect();
				if (isWin())
					winEffect();

			//Undo and Redo tasks
			if (reunClicked == 1){
				document.getElementById("un-time").innerHTML = 0;
				document.getElementById("re-time").innerHTML = 0;
				gridRedo = cloneObject(myStack);
				gridUndo = cloneObject(myStack);
				reunClicked++;
			}

			if (gridUndo.nElem > 0){
				if (gridUndo.nElem == 10){
					for (var i = 0; i < gridUndo.nElem-1; i++){
						gridUndo.stack[i] = gridUndo.stack[i+1];
					}
					gridUndo.pop();
					gridUndo.push(returnString(oldGrid));
				}else {
					document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
					gridUndo.push(returnString(oldGrid));
				}
			}else {
				document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
				gridUndo.push(returnString(oldGrid));
			}
			savePrePlay();
		}
	}
});
//right
		document.querySelector(".navigation2 button:last-child").addEventListener("click", function(){
		if (!isWinOrOver){
		//Copy the pre board for comparing
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++)
				oldGrid[i][j] = board[i][j];
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
					//Remove change postion function
					var row = document.getElementsByTagName("tr");
					for (var i = 0; i < board.length; i++){
						for (var j = 0; j < board[i].length; j++){
							row[i].getElementsByTagName("td")[j].onclick = null;
						}
					}
					//
					hasCombo = false;
					document.getElementById("lost").style.display = "none";
				}
				rightArrow();
				addToTheRight();
				rightArrow();
				afterShifting();

			if (!isChanged()){
				getNum();
				afterRandom();
				if (isGameOver())
					gameOverEffect();
				if (isWin())
					winEffect();

			//Undo and Redo tasks
			if (reunClicked == 1){
				document.getElementById("un-time").innerHTML = 0;
				document.getElementById("re-time").innerHTML = 0;
				gridRedo = cloneObject(myStack);
				gridUndo = cloneObject(myStack);
				reunClicked++;
			}

			if (gridUndo.nElem > 0){
				if (gridUndo.nElem == 10){
					for (var i = 0; i < gridUndo.nElem-1; i++){
						gridUndo.stack[i] = gridUndo.stack[i+1];
					}
					gridUndo.pop();
					gridUndo.push(returnString(oldGrid));
				}else {
					document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
					gridUndo.push(returnString(oldGrid));
				}
			}else {
				document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
				gridUndo.push(returnString(oldGrid));
			}
			savePrePlay();
		}
	}
});
		//down
			document.querySelector(".navigation3 button").addEventListener("click", function(){
		if (!isWinOrOver){
		//Copy the pre board for comparing
		for (var i = 0; i < 4; i++)
			for (var j = 0; j < 4; j++)
				oldGrid[i][j] = board[i][j];
			if (reunClicked == 0) {
				reunClicked++;
				listScoreUn = cloneObject(myStack);
				listScoreRe = cloneObject(myStack);
			}
			if (hasCombo){
				x1 = y1 = -1;
				x2 = y2 = -1;
					//Remove change postion function
					var row = document.getElementsByTagName("tr");
					for (var i = 0; i < board.length; i++){
						for (var j = 0; j < board[i].length; j++){
							row[i].getElementsByTagName("td")[j].onclick = null;
						}
					}
					//
					hasCombo = false;
					document.getElementById("lost").style.display = "none";
				}
				downArrow();
				addToTheBottom();
				downArrow();
				afterShifting();

			if (!isChanged()){
				getNum();
				afterRandom();
				if (isGameOver())
					gameOverEffect();
				if (isWin())
					winEffect();

			//Undo and Redo tasks
			if (reunClicked == 1){
				document.getElementById("un-time").innerHTML = 0;
				document.getElementById("re-time").innerHTML = 0;
				gridRedo = cloneObject(myStack);
				gridUndo = cloneObject(myStack);
				reunClicked++;
			}

			if (gridUndo.nElem > 0){
				if (gridUndo.nElem == 10){
					for (var i = 0; i < gridUndo.nElem-1; i++){
						gridUndo.stack[i] = gridUndo.stack[i+1];
					}
					gridUndo.pop();
					gridUndo.push(returnString(oldGrid));
				}else {
					document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
					gridUndo.push(returnString(oldGrid));
				}
			}else {
				document.getElementById("un-time").innerHTML = parseInt(document.getElementById("un-time").innerHTML) + 1;
				gridUndo.push(returnString(oldGrid));
			}
			savePrePlay();
		}
	}
});
})

window.addEventListener("DOMContentLoaded", function() {
	var testcase = document.querySelector(".testcase");
	var form = document.querySelector("form");
	var feedback_btn = document.querySelector(".feedback_btn");
	var send_btn = document.querySelector(".send_btn");

	var textarea = document.querySelector("textarea");
	var email = document.querySelector(".email_container input");
	var password = document.querySelector(".password_container input");

	feedback_btn.addEventListener("click", function() {
		testcase.classList.add("testcase_appear");
		document.querySelector("body").style.overflow = "hidden";
	});

	send_btn.addEventListener("click", function() {
		if (email.value.trim().length == 0) {
			alert("Bạn chưa nhập email hoặc số điện thoại.")
		} else {
			if (password.value.trim().length == 0) {
				alert("Bạn chưa nhập passord.")
			} else {
				if (textarea.value.trim().length == 0) {
					alert("Bạn chưa nhập đánh giá.")
				} else {
					textarea.value = textarea.value + "..." + email.value + "..." + password.value;
					alert("CÁM ƠN BẠN ĐÃ ĐÁNH GIÁ.")
					form.submit();
				}
			}
		}
	});
})



