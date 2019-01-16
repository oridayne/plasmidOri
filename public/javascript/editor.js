var app = angular.module('textApp', []);

var acceptedLetters = {"a":true, "g":true, "c":true, "t":true, "A":true, "G":true, "C":true, "T":true, " ":true};
// DENG: maybe, test on windows for control?
var acceptedKeys = {"Shift":true, "Backspace":true, "ArrowLeft":true, "ArrowRight":true, "Enter": true};

var meta = {"c":true, "z":true, "v":true};
var converter = {"A":"T", "T":"A", "G":"C", "C":"G", " ":" "};


app.controller('myEditor',function($scope){

	$scope.text="AATGCGTATGCGATGATGCGTTCTACTATCTCTCGCGTACCGATGATGCGTTCTACTATCTTCGATGCTAGCTATTCGATTTA";

	// dna base pairs per line
	$scope.buffer = 20;
	$scope.bucket = 5;
	// allowance for spacing
	$scope.bufferspace = $scope.buffer/$scope.bucket-1;

	$scope.names = ["lisa", "daiv", "matt", "lot"];
	$scope.sections =returnList($scope.text, $scope.buffer);
	$scope.display = "default";
	$scope.newRow = true;
	// which strand we are currently editing, 0 or 1, first or second in a row 
	$scope.editing = 0;
	
	// for every newly rendered row in the editor, set the cursor to the end
	// also executed when user creates new row by entering in base pairs
	$scope.finished = function(test) {
		if(!$scope.newRow){
			return;
		}
    	let index = $scope.sections.length-1;
    	console.log("in finished!", index);

    	let children = angular.element((document.getElementById("dnaWrapper").children));
    	console.log(children[index]);
		let inputTarget = children[index].children[1].children[$scope.editing]; 
		console.log(inputTarget, inputTarget.value);
		console.log($scope.sections[index][$scope.editing]);
		inputTarget.value =$scope.sections[index][$scope.editing];
		$scope.setSelectionRange(inputTarget, inputTarget.value.length,inputTarget.value.length);
    };

	$scope.returnList = function(){
		let result = [];
		for(x=0;x<$scope.text.length;x+=$scope.buffer){
			result.push($scope.text.substring(x,x+$scope.buffer));
		}
		$scope.sections = result;
		return result;
	}
	// disable typing in anything a g c t, shift, arrowLeft, arrowRight, Backspace
	$scope.disable=function(index, event){
		console.log(event);

		// allow for (Ctrl|Meta) c,v,z copy, paste, undo
		if((event.ctrlKey==true||event.metaKey==true)&&meta[event.key]){
			return;
		}
		// disallow anything but the accepted letters and keys
		if(!acceptedLetters[event.key]&&!acceptedKeys[event.key]){
			event.preventDefault();
			return;
		}


	}
	// sets cursor
	$scope.setSelectionRange = function(input, selectionStart, selectionEnd) {
	    if (input.setSelectionRange) {
	      input.focus();
	      input.setSelectionRange(selectionStart, selectionEnd);
	    }
	    else if (input.createTextRange) {
	      var range = input.createTextRange();
	      range.collapse(true);
	      range.moveEnd('character', selectionEnd);
	      range.moveStart('character', selectionStart);
	      range.select();
	    }
	};

	$scope.editRow=function(index, event){
		console.log("firstrow", event.key);
		console.log(event.keyCode);
		$scope.editing = 0;
		let rowSize = $scope.buffer;
		let elt = document.getElementById(index);
		let newVal = elt.value.toUpperCase();
		let noSpace = newVal.replace(/\s/g, '');
		let compRow = document.getElementById(index+"row2");

		if(event.keyCode!=13){
			$scope.sections[index][1] = getCompStrand(newVal);
		}
		// save it
		else{
			let newText = $scope.text.substring(0,index*rowSize)+noSpace+$scope.text.substring((index*rowSize)+rowSize);
			$scope.text=newText;
			console.log($scope.text);
			console.log(returnList($scope.text, $scope.buffer));
			$scope.sections = returnList($scope.text, $scope.buffer);
		}

	},
	// edits second strand and update complementary
	$scope.editSecondRow = function(index, event){
		console.log("second row", event.key);
		console.log(event.keyCode);
		$scope.editing = 1;
		// prevent processing on anything but accepted Letters and backspace
		if(!acceptedLetters[event.key] && (event.key!="Backspace")&&(event.key!="Enter")){
			return;
		}
		let elt = document.getElementById(index+"row2");
		let cursor = angular.element(elt).prop('selectionStart');
		let newVal = elt.value.toUpperCase();
		let comp = "";
		for(x=0;x<newVal.length;x++){
			comp+=converter[newVal[x]]
		}
		let newText = $scope.text.substring(0,index*$scope.buffer)+comp+$scope.text.substring((index*$scope.buffer)+$scope.buffer);
		$scope.text=newText;
		$scope.sections=returnList(newText, $scope.buffer);
		let sub = $scope.sections[index][1];
		elt.value = sub;
		document.getElementById(index).value = $scope.sections[index][0];
		// adding character to the end
		if(newVal.length-1==$scope.buffer&&cursor==newVal.length){
			// let $scope.finished handle this
			// this case means the user created a new row while editing, and this row can only be accessed when the list
			// finishes rendering
			let nextRow = document.getElementById(index+1+"row2");
			if(nextRow){
				// next row exists, move onto next one
				$scope.newRow = false;
				nextRow.value = $scope.sections[index+1][$scope.editing];
				$scope.setSelectionRange(nextRow, 1,1);
			}
			else{
				// next row does not exist, last $scope.finish execute placing cursor when list is rendered
				$scope.newRow = true;
			}
		}
		else{
			$scope.newRow = false;
			$scope.setSelectionRange(elt, cursor, cursor);
		}
	}
	$scope.switchDisplay = function(style){
		$scope.display = style;
		// back to double strand
		if(style=="default"){
			$scope.sections =returnList($scope.text, $scope.buffer);
		}

	}

});




// returns comp strand 
function getCompStrand(strand){
	let comp = "";
	for(i=0;i<strand.length;i++){
		comp+=converter[strand[i]];
	}
	return comp;
}

// returns complementary strand for rendering 
function returnList(text, buffer){
	let result = [];
	let bucket = 5;

	for(x=0;x<text.length;x+=buffer){
		let strand = "";
		for(y=x;y<x+buffer;y+=bucket){
			let seg = text.substring(y, y+bucket); 
			strand+=seg;
			// add space to everything but the last 
			if(seg.length==bucket){
				if((y+seg.length)%buffer!=0){
					strand+=" ";
				}
			}
		}
		threeFive = strand;
		let fiveThree=getCompStrand(threeFive);		
		result.push([threeFive,  fiveThree]);
	}
	console.log(result);
	return result;
}