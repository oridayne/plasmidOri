// var editorApp = angular.module('textApp', []);

var acceptedLetters = {"a":true, "g":true, "c":true, "t":true, "A":true, "G":true, "C":true, "T":true, " ":true};
// DENG: maybe, test on windows for control?
var acceptedKeys = {"Shift":true, "Backspace":true, "ArrowLeft":true, "ArrowRight":true, "Enter": true};

var meta = {"c":true, "z":true, "v":true, "s":true};
var converter = {"A":"T", "T":"A", "G":"C", "C":"G", " ":" "};


// TODO:
// - move cursor to end upon enter 
// - do copy button


app.controller('myEditor',function($scope){

	$scope.text="AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGA";
	$scope.textbuffer = $scope.text;
	// dna base pairs per line
	$scope.editStart = 0;
	$scope.buffer = 50;
	$scope.bucket = 10;
	$scope.row1 = 0;
	$scope.row2 = 1;
	$scope.rowIndices = generateIndices(50, 10);
	// allowance for spacing
	$scope.bufferspace = $scope.buffer/$scope.bucket-1;
	
	console.log(scope1.seq);
	$scope.sections =returnList(scope1.seq, $scope.buffer, $scope.bucket);
	$scope.display = "default";
	$scope.newRow = true;
	// which strand we are currently editing, 0 or 1, first or second in a row 
	$scope.editing = 0;
	$scope.lineDisplay = true;

	$scope.testIndices = [];
	$scope.switchLine = function(style){
		if(style=="on"){
			$scope.lineDisplay=true;
		}
		else{
			$scope.lineDisplay=false;
		}

	}


	$scope.setIndices = function(seqLen){
		for(x=0;x<seqLen;x+buffer){
			for(y=0;y<bucket;y++){
				
			}

		}
	}
	// for every newly rendered row in the editor, set the cursor to the end
	// also executed when user creates new row by entering in base pairs
	$scope.finished = function() {
		if(!$scope.newRow){
			return;
		}
    	let index = $scope.sections.length-1;
    	console.log("in finished!", index);

    	let children = angular.element((document.getElementById("dnaWrapper").children));
    	console.log(children, "child", children[index]);
		let inputTarget = children[index].children[1].children[1+$scope.editing]; 

		// console.log(inputTarget, inputTarget.value);
		inputTarget.value =$scope.sections[index][$scope.editing];
		console.log(inputTarget, inputTarget.value.length);

		// $scope.setSelectionRange(inputTarget, inputTarget.value.length,inputTarget.value.length);
		$scope.setSelectionRange(inputTarget, inputTarget.value.length,inputTarget.value.length);

    };

    $scope.startEditing = function(event){
    	document.getElementById("dnaWrapper").className = "unsaved";
    	document.getElementById("saveButton").className = "unsavedButton";
    	let elt = event.srcElement;
    	let cursor = angular.element(elt).prop('selectionStart');
    	let numSpaces = elt.value.length%$scope.buffer;
    	// $scope.editStart = index*$scope.buffer+cursor;
    	console.log("starting edit", $scope.editStart, elt.value.length);
    	console.log("cursor", cursor);
    },

    $scope.startEditingSingle = function(event){
    	let elt = event.srcElement;
		console.log(elt);    	
		document.getElementById("saveButton").className = "unsavedButton";
    	elt.classList.remove("saved");
    	elt.classList.add("unsaved");
    	// document.getElementById("saveButton").className = "unsavedButton";
    }
    $scope.stopEditingSingle = function(event){
    	let elt = event.srcElement;
    	elt.classList.remove("unsaved");
    	elt.classList.add("saved");
    	document.getElementById("saveButton").className = "savedButton";

    }
	$scope.returnList = function(){
		let result = [];
		for(x=0;x<$scope.text.length;x+=$scope.buffer){
			result.push($scope.text.substring(x,x+$scope.buffer));
		}
		$scope.sections = result;
		return result;
	}

	$scope.genSpace = function(num){
		let spaces = "";
		for(x=0;x<num;x++){
			spaces+=" ";
		}
		return spaces;
	}
	$scope.copyDNA = function(){
		const el = document.createElement('textarea');
		el.className = "single"; 
		let val = "";
		let indices = [];
		let subIndices = [];
		let subIndex;
		for(index=0;index<$scope.sections.length;index++){
			subIndices = "";
			for(subIndex=0;subIndex<$scope.buffer;subIndex+=$scope.bucket){
				let label = (index*$scope.buffer)+subIndex;
				// filler space
				let numSpaces = $scope.genSpace(11- String(label).length); 
				subIndices+=label+numSpaces;
			}
			indices.push(subIndices);
		}
		for(x=0;x<$scope.sections.length;x++){
			val+=indices[x]+"\n";
			val+=$scope.sections[x][0];
			val+="\n";
			val+=$scope.sections[x][1];
			val+="\n\n";
		}
		el.value =val;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);

	}
	// disable typing in anything a g c t, shift, arrowLeft, arrowRight, Backspace
	$scope.disable=function(event){
		// allow for (Ctrl|Meta) c,v,z copy, paste, undo
		// for saving
		if((event.ctrlKey==true||event.metaKey==true)&&event.key=="s"){
			$scope.saveProgress();
			return;
		}
		if((event.ctrlKey==true||event.metaKey==true)){
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
	// save all current progress permanently
	$scope.saveProgress = function(){

		document.getElementById("dnaWrapper").className = "saved";
		document.getElementById("saveButton").className = "savedButton";
		$scope.text = $scope.textbuffer;
	}

	// on a row blue, save to temporary buffer
	$scope.saveToBuffer = function(index, row){
		let rowSize = $scope.buffer;
		let elt=false;
		let newVal = "";
		if(row==$scope.row1){
			elt = document.getElementById(index);
			newVal = elt.value.toUpperCase().replace(/\s/g, '');
		}
		else{
			elt = document.getElementById(index+"row2");
			newVal = elt.value.toUpperCase().replace(/\s/g, '');
			newVal = getCompStrand(newVal);

		}
		let newText = $scope.textbuffer.substring(0,index*rowSize)+newVal+$scope.textbuffer.substring((index*rowSize)+rowSize);
		$scope.textbuffer = newText;
		$scope.sections = returnList($scope.textbuffer, $scope.buffer, $scope.bucket);
	},
	$scope.editSingleRow = function(event){
		// $scope.textbuffer= $scope.textbuffer.toUpperCase();
	},
	$scope.editRow=function(index, event){
		// console.log("firstrow", event.key);
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
			$scope.saveToBuffer(index, $scope.row1);
		}

	},
	// edits second strand and update complementary
	$scope.editSecondRow = function(index, event){
		$scope.editing = 1;
		let rowSize = $scope.buffer;
		let elt = document.getElementById(index+"row2");
		let newVal = elt.value.toUpperCase();
		let noSpace = newVal.replace(/\s/g, '');
		let compRow = document.getElementById(index);

		if(event.keyCode!=13){
			$scope.sections[index][0] = getCompStrand(newVal);
		}
		// save it
		else{
			$scope.saveToBuffer(index, $scope.row2);
		}
	}
	$scope.switchDisplay = function(style){
		$scope.display = style;
		// back to double strand
		if(style=="default"){
			$scope.textbuffer = $scope.textbuffer.toUpperCase();
			$scope.sections =returnList($scope.textbuffer, $scope.buffer, $scope.bucket);
		}

	}

});

function generateIndices(buffer, bucket){
	let result = [];
	for(x=0;x<buffer;x+=bucket){
		result.push(x);
	}
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
function returnList(text, buffer, bucket){
	let result = [];

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
	return result;
}