// var editorApp = angular.module('textApp', []);

var acceptedLetters = {"a":true, "g":true, "c":true, "t":true, "A":true, "G":true, "C":true, "T":true, " ":true};
var acceptedKeys = {"Shift":true, "Backspace":true, "ArrowLeft":true, "ArrowRight":true, "Enter": true};
var converter = {"A":"T", "T":"A", "G":"C", "C":"G", " ":" ", "-":"-"};


// TODO:
// - move cursor to end upon enter 
// optimated toggle between full and partial editor
// disallow editing for annotation

app.controller('myEditor',function($scope){
	$scope.DNA = angular.element($("#divider")).scope().seq;
	$scope.text="AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGA";
	$scope.textbuffer = $scope.DNA;
	$scope.blastOn = true;
	

	// dna base pairs per line
	$scope.editStart = 0;
	$scope.buffer = 50;
	$scope.bucket = 10;
	$scope.row1 = 0;
	$scope.row2 = 1;

	// matched blast from other scope
	$scope.editorBlastMatch = {};
	$scope.showBlast = false;
	$scope.blastSections=[];
	$scope.shownBlast = [];
	// start and end points, but not for display, are 0 and 0 when the editor is displays full sequence
	$scope.offsetStart = 0;
	$scope.offsetEnd = $scope.DNA.length;


	$scope.rowIndices = generateIndices(50, 10);
	// allowance for spacing
	$scope.sections =returnList($scope.DNA, $scope.buffer, $scope.bucket);
	$scope.display = "default";
	$scope.newRow = true;
	// which strand we are currently editing, 0 or 1, first or second in a row 
	$scope.editing = 0;
	$scope.lineDisplay = true;
	$scope.showBlast = function(toggle){
		$scope.blastOn = toggle;
	}
	$scope.setEditor = function(start, end, text){
		console.log("called", start,end);
		$scope.offsetStart = Math.min(start,end);
		$scope.offsetEnd = Math.max(start,end);
		$scope.textbuffer = text;
		$scope.sections = returnList(text, $scope.buffer, $scope.bucket);
	}

	$scope.switchLine = function(style){
		$scope.lineDisplay=(style=="on");
	}
	// for every newly rendered row in the editor, set the cursor to the end
	// also executed when user creates new row by entering in base pairs
	$scope.finished = function() {
		if(!$scope.newRow){
			return;
		}
    	let index = $scope.sections.length-1;
    	let children = angular.element((document.getElementById("dnaWrapper").children));
		let inputTarget = children[index].children[1].children[1+$scope.editing]; 
		inputTarget.value =$scope.sections[index][$scope.editing];
		$scope.setSelectionRange(inputTarget, inputTarget.value.length,inputTarget.value.length);
    };

    $scope.startEditing = function(event){
    	document.getElementById("dnaWrapper").className = "unsaved";
    	document.getElementById("saveButton").className = "unsavedButton";
    },
    $scope.startEditingSingle = function(event){
    	let elt = event.srcElement;
		document.getElementById("saveButton").className = "unsavedButton";
    	elt.classList.remove("saved");
    	elt.classList.add("unsaved");
    }
    $scope.stopEditingSingle = function(event){
    	let elt = event.srcElement;
    	elt.classList.remove("unsaved");
    	elt.classList.add("saved");
    	document.getElementById("saveButton").className = "savedButton";
    }

	$scope.copyDNA = function(){
		const el = document.createElement('textarea');
		el.className = "single"; 
		let val = "";
		let indices = [];
		let subIndices = "";	

		// generating indices	
		for(index=0;index<$scope.sections.length;index++){
			subIndices = "";
			for(subIndex=0;subIndex<$scope.buffer;subIndex+=$scope.bucket){
				let label = (index*$scope.buffer)+subIndex;
				// filler space
				// 10(characters per bucket)
				let numSpaces = genSpace(7-String(label).length); 
				// 4 spaces
				// let numSpaces = genSpace(11- String(label).length); 
				// subIndices+=label+numSpaces;
			}
			indices.push(subIndices);
		}
		// putting it all together
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
		//disallow enter for single editor
		if($scope.display=="single"&&event.key=="Enter"||$scope.display=="single"&&event.key==" "){
			event.preventDefault();
			return;
		}
		if((event.ctrlKey==true||event.metaKey==true)&&event.key=="s"){
			$scope.saveToBuffer(document.activeElement.id, $scope.editing);
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
		console.log("saving progress??");
		document.getElementById("dnaWrapper").className = "saved";
		document.getElementById("saveButton").className = "savedButton";
		let scope = angular.element($("#divider")).scope();
		let editorScope = angular.element($("#editorModule")).scope();
		let diff = $scope.textbuffer.length-($scope.offsetEnd-$scope.offsetStart);
		let newEnd = $scope.offsetEnd + diff;
		let newStr = "";
		if($scope.offsetStart<0){
			let start = $scope.textbuffer.substring(Math.abs($scope.offsetStart));
			let mid = editorScope.seq.substring($scope.offsetEnd, $scope.offsetStart+editorScope.seq.length);
			let end = $scope.textbuffer.substring(0, Math.abs($scope.offsetStart));
			newStr = start+mid+end;
		}
		else{
			console.log("now am here???");
			newStr = editorScope.seq.substring(0,$scope.offsetStart)+$scope.textbuffer+editorScope.seq.substring($scope.offsetEnd);
		}
		// newStr = newStr.toUpperCase().replace(/-/g, '');
		scope.seq = newStr;
		$scope.offsetEnd = $scope.offsetStart+$scope.textbuffer.length;
		scope.orfsFunc();
	}

	// on a row blue, save to temporary buffer
	$scope.saveToBuffer = function(index, row){
		console.log("save to buffer called!", index, row);
		let rowSize = $scope.buffer;
		let elt=false;
		let newVal = "";
		if(row==$scope.row1){
			elt = document.getElementById(index);
			newVal = elt.value.toUpperCase().replace(/\s/g, '');
			// newVal = newVal.toUpperCase().replace(/-/g, '');

		}
		else{
			elt = document.getElementById(index+"row2");
			newVal = elt.value.toUpperCase().replace(/\s/g, '');
			newVal = getCompStrand(newVal);
			// newVal = newVal.toUpperCase().replace(/-/g, '');


		}
		let newText = $scope.textbuffer.substring(0,index*rowSize)+newVal+$scope.textbuffer.substring((index*rowSize)+rowSize);
		$scope.textbuffer = newText;
		// $scope.sections = returnList($scope.textbuffer, $scope.buffer, $scope.bucket);

	},
	$scope.editSingleRow = function(event){
		console.log("edit single row called ", event.key);
		if(event.keyCode==13||event.key=="Space"){
			event.preventDefault();
			console.log("I was here!!!", event.key);
		}
	},
	$scope.editRow=function(index, event){
		$scope.editing = 0;
		let elt = document.getElementById(index);
		let newVal = elt.value.toUpperCase();
		if(event.keyCode!=13){
			$scope.sections[index][1] = getCompStrand(newVal);
		}
		// save it
		else{
			$scope.saveToBuffer(index, $scope.row1);
			$scope.sections = returnList($scope.textbuffer, $scope.buffer, $scope.bucket);
		}
	},
	// edits second strand and update complementary
	$scope.editSecondRow = function(index, event){
		$scope.editing = 1;
		let elt = document.getElementById(index+"row2");
		let newVal = elt.value.toUpperCase();
		if(event.keyCode!=13){
			$scope.sections[index][0] = getCompStrand(newVal);
		}
		// save it
		else{
			$scope.saveToBuffer(index, $scope.row2);
			$scope.sections = returnList($scope.textbuffer, $scope.buffer, $scope.bucket);

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

	// is it possible for the query string to be larger????
	$scope.blastSections = [];

});


function breakUpRow(bucket, text){
	let segments = "";
	if(text.length<=0||text==false){
		console.log("error, bad text!", text);
		return;
	}
	for(i=0;i<text.length;i+=bucket){
		// console.log("in break up row?", i, text, bucket);
		// DENG: 4 space norm
		// segments+=text.substring(i,i+bucket)+"    ";
		segments+=text.substring(i,i+bucket)+" ";

	}
	return segments;
}

function genSpace(num){
	let spaces = "";
	for(x=0;x<num;x++){
		spaces+=" ";
	}
	return spaces;
}

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