var app = angular.module('textApp', []);

var acceptedLetters = {"a":true, "g":true, "c":true, "t":true, "A":true, "G":true, "C":true, "T":true, " ":true};
var acceptedKeys = {"Shift":true, "Backspace":true, "ArrowLeft":true, "ArrowRight":true};
var converter = {"A":"T", "T":"A", "G":"C", "C":"G", " ":" "};
function setCaret() {
    var el = document.getElementById("editable");
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], 10);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
}
app.controller('myEditor',function($scope){

	$scope.text="AATGCGTATGCGATGATGCGTTCTACTATCTCTC";
	$scope.complement = "";
	$scope.savedSections = [];
	$scope.len=20;
	// dna base pairs per line
	$scope.buffer = 20;
	$scope.bucket = 5;
	// allowance for spacing
	$scope.bufferspace = $scope.buffer/$scope.bucket-1;

	$scope.names = ["lisa", "daiv", "matt", "lot"];
	$scope.sections =returnList($scope.text, $scope.buffer);
	$scope.spaced = generateSpace($scope.text, $scope.buffer, $scope.bucket)
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
		$scope.setSelectionRange(inputTarget, 1,1);
    };

	$scope.returnList = function(){
		let result = [];
		for(x=0;x<$scope.text.length;x+=$scope.buffer){
			result.push($scope.text.substring(x,x+$scope.buffer));
		}
		$scope.sections = result;
		return result;
	},
	$scope.startEditing = function(){
		$scope.savedSections = $scope.sections;
	}
	// disable typing in anything a g c t, shift, arrowLeft, arrowRight, Backspace
	$scope.disable=function(event){
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
	// // edits first strand and updates complementary
	// $scope.editRow=function(index, event){
	// 	console.log("firstrow", event.key);
	// 	console.log(event.keyCode);
	// 	$scope.editing = 0;
	// 	// prevent processing on anything but accepted Letters and backspace
	// 	if(!acceptedLetters[event.key] && (event.key!="Backspace")){
	// 		return;
	// 	}
	// 	let elt = document.getElementById(index);
	// 	let cursor = angular.element(elt).prop('selectionStart');
	// 	let newVal = elt.value.toUpperCase();
	// 	let newText = $scope.text.substring(0,index*$scope.buffer)+newVal+$scope.text.substring((index*$scope.buffer)+$scope.buffer);
	// 	$scope.text=newText;
	// 	$scope.sections=returnList(newText, $scope.buffer);
	// 	let sub = $scope.sections[index][0];
	// 	elt.value = sub; // reset if exceeds character overflow
	// 	// adding character to the end
	// 	if(newVal.length-1==$scope.buffer&&cursor==newVal.length){
	// 		let nextRow = document.getElementById(index+1);
	// 		if(nextRow){
	// 			// next row exists, move onto next one
	// 			$scope.newRow = false;
	// 			nextRow.value = $scope.sections[index+1][$scope.editing];
	// 			$scope.setSelectionRange(nextRow, 1,1);
	// 		}
	// 		else{
	// 			// next row does not exist, last $scope.finish execute placing cursor when list is rendered
	// 			$scope.newRow = true;
	// 		}
	// 	}
	// 	else{
	// 		$scope.newRow = false;
	// 		$scope.setSelectionRange(elt, cursor, cursor);
	// 	}
	// },
	// // edits first strand and updates complementary
	$scope.setCaretPosition = function(elt, pos){
		elt.focus();
		var range = document.createRange();
		var sel = window.getSelection();
		let focus = sel.focusNode;
		range.selectNode(focus);
		range.setStart(focus, pos);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		elt.focus();
	}
	$scope.setCaretPositionEnd = function(elt){
		elt.focus();
		var range = document.createRange();
		var sel = window.getSelection();
		let focus = sel.focusNode;
		range.selectNode(focus);
		range.collapse(false);
		sel.removeAllRanges();
		sel.addRange(range);
		elt.focus();
	}
	$scope.editRow=function(index, event){
		console.log("firstrow", event.key);
		console.log(event.keyCode);
		$scope.editing = 0;
		let rowSize = $scope.buffer;
		// prevent processing on anything but accepted Letters and backspace
		if(!acceptedLetters[event.key] && (event.key!="Backspace")){
			return;
		}
		let elt = document.getElementById(index);
		console.log(elt, elt.innerText);
		let newVal = elt.value.toUpperCase();
		console.log("newVal", newVal);
		let cursor = angular.element(elt).prop('selectionStart');
		let noSpace = newVal.replace(/\s/g, '');
		let newText = $scope.text.substring(0,index*rowSize)+noSpace+$scope.text.substring((index*rowSize)+rowSize);
		$scope.text=newText;
		let compStrand = getCompStrand(newVal);
		console.log("comp strand", compStrand);


		$scope.sections=returnList(newText, $scope.buffer);
		let sub = $scope.sections[index][0];
		elt.value = sub;
		// adding character to the end
		console.log("newVal", newVal.length, "cursor", cursor, "buffer", $scope.buffer, "buffer space", $scope.bufferspace);
		console.log(newVal.length-1, ($scope.buffer+$scope.bufferspace));

		if(newVal.length-1==($scope.buffer+$scope.bufferspace)&&cursor==newVal.length){
			console.log("made it in here!");
			let nextRow = document.getElementById(index+1);
			if(nextRow){
				console.log("new row exists!");
				// next row exists, move onto next one
				$scope.newRow = false;
				nextRow.value = $scope.sections[index+1][$scope.editing];
				nextRow.focus();
				$scope.setSelectionRange(nextRow, 1,1);

			}
			else{
				console.log("couldn't find the new row?");
				// next row does not exist, last $scope.finish execute placing cursor when list is rendered
				$scope.newRow = true;
			}
		}
		else{
			console.log("sections?", $scope.sections);
			console.log($scope.sections[index][0]);
			$scope.newRow = false;
			console.log("cursor position", cursor);
			if((cursor+1)%6==0){
				cursor+=1;
			}
			elt.value = $scope.sections[index][$scope.editing];
			$scope.setSelectionRange(elt, cursor,cursor);

			// $scope.setCaretPositionEnd(elt);
		}

		
	},
	// on enter
	$scope.saveRow = function(index, event){
		if(event.keyCode!=13){return;}

	},
	// edits second strand and update complementary
	$scope.editSecondRow = function(index, event){
		console.log("second row", event.key);
		console.log(event.keyCode);
		$scope.editing = 1;
		// prevent processing on anything but accepted Letters and backspace
		if(!acceptedLetters[event.key] && (event.key!="Backspace")){
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
		if(style=="space"){
			$scope.spaced = generateSpace($scope.text, $scope.buffer, $scope.bucket);
		}
	}

});

function returnCompRow(text){
	let strand = "";
	for(x=0;x<text.length;x++){
		strand+=converter[text[x]];
	}
	return strand;
}
// console.log("generating the space!");
// console.log(generateSpace("AATGCGTATGCGATGATGCGTT", 10, 5));

function generateSpace(text, buffer, bucket){
	let result = [];

	for(x=0;x<text.length;x+=buffer){
		let strand = [];
		let comp = [];
		let line = text.substring(x,x+buffer);
		for(y=0;y<buffer; y+=bucket){
		    let seg = line.substring(y, y+bucket);
		    if(seg.length==0){break;}
			strand.push(seg);
			comp.push(getCompStrand(seg));
		}
		result.push([strand,comp]);
	}
	console.log("resuot", result);
	return result;
}

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
		// uncomment when I want to work on spacing
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
		// let threeFive = text.substring(x,x+buffer);
		let fiveThree=getCompStrand(threeFive);
		
		
		result.push([threeFive,  fiveThree]);
	}
	console.log(result);
	return result;
}