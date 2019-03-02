var acceptedLetters = {"a":true, "g":true, "c":true, "t":true, "A":true, "G":true, "C":true, "T":true, " ":true, "-":true};
var acceptedKeys = {"Shift":true, "Backspace":true, "ArrowLeft":true, "ArrowRight":true, "Enter": true};
var converter = {"A":"T", "T":"A", "G":"C", "C":"G", " ":" ", "-":"-"};


// TODO:
// - move cursor to end upon enter 
// optimated toggle between full and partial editor
// disallow editing for annotation

app.controller('blastViewer',function($scope){
	$scope.DNA = angular.element($("#divider")).scope().seq;
	$scope.textbuffer = $scope.DNA;
	$scope.blastOn = true;
	
	// dna base pairs per line
	$scope.buffer = 50;
	$scope.bucket = 10;

	// matched blast from other scope
	$scope.editorBlastMatch = {};
	$scope.showBlast = false;
	$scope.blastSections=[];
	$scope.blastMisses = []; // mismatched indices shower
	$scope.shownBlast = [];
	// start and end points, but not for display, are 0 and 0 when the editor is displays full sequence
	$scope.offsetStart = 0;
	$scope.offsetEnd = $scope.DNA.length;

	$scope.rowIndices = generateIndices(50, 10);
	// allowance for spacing
	$scope.sections =returnList($scope.DNA, $scope.buffer, $scope.bucket);
	$scope.display = "default";

	// which strand we are currently editing, 0 or 1, first or second in a row 
	$scope.editing = 0;

	// whether or not to display indices
	$scope.indiceDisplay = true;

	$scope.showBlast = function(toggle){
		$scope.blastOn = toggle;
	}
	$scope.setEditor = function(start, end, text){
		$scope.offsetStart = Math.min(start,end);
		$scope.offsetEnd = Math.max(start,end);
		$scope.textbuffer = text;
		$scope.sections = returnList(text, $scope.buffer, $scope.bucket);
		$scope.formatBlast();

	}
	// toggle indice Display
	$scope.toggleIndice = function(toggle){
		$scope.indiceDisplay=toggle;
	}

	// TODO: if most people do not like copying the indices with it, this can be expedited...
	$scope.copyDNA = function(){

		const el = document.createElement('textarea');
		el.className = "single"; 
		let val = "";
		let indices = [];
		let subIndices = "";	

		// copy indices if the user wants to
		if($scope.indiceDisplay){
			// generating indices	
			for(index=0;index<$scope.sections.length;index++){
				subIndices = "";
				for(subIndex=0;subIndex<$scope.buffer;subIndex+=$scope.bucket){
					let label = (index*$scope.buffer)+subIndex;
					// filler space
					// 10(characters per bucket)
					let numSpaces = genSpace(11- String(label).length); 
					subIndices+=label+numSpaces;
				}
				indices.push(subIndices);
			}

		}

		// putting it all together
		for(x=0;x<$scope.sections.length;x++){
			if($scope.indiceDisplay){
				val+=indices[x]+"\n";
			}
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

	$scope.switchDisplay = function(style){
		$scope.display = style;
		// back to double strand
		if(style=="default"){
			$scope.sections =returnList($scope.textbuffer, $scope.buffer, $scope.bucket);
		}
	}

	// formats the blast match to match in the editor
	$scope.formatBlast = function(){
		console.log("calling formatBlast?", $scope.editorBlastMatch);
		if(!$scope.editorBlastMatch.qseq){return;}
		let hfrom = Math.min($scope.editorBlastMatch.hfrom, $scope.editorBlastMatch.hto);
		let hto = Math.max($scope.editorBlastMatch.hfrom, $scope.editorBlastMatch.hto);
		let qseq = $scope.editorBlastMatch.qseq;
		let hseq = $scope.editorBlastMatch.qseq;
		let misses = $scope.editorBlastMatch.indexmismatch;
		console.log("qseq is--------------------!", qseq.length, qseq);
		// TODO: check for off by one errors?
		//obj.hfrom, obj.hto
		let start = hfrom;
		let end = hto;
		let results = [];
		let rowValue = "";

		console.log("st, ", start,",",end, hfrom, hto);
		// let qcounter = $scope.editorBlastMatch.qfrom;
		let qcounter = 0;
		let counter = 0;
		let segment = [];
	
	
		// DENG - needs to be more efficient......
		// generate mismatch indicator strand
		let missCounter = 0;
		let lastIndex = 0;
		let bufferCounter = $scope.buffer;
		let mismatchSegment = "";
		// let emptyString = ' '.repeat(qseq.length);
		let emptyString = "";
		console.log("length is!! ", emptyString.length);
		let missResults = [];
		// for(counter=0;counter<qseq.length;counter+=$scope.buffer){
		// 	console.log(misses[0], counter, "m");

		// 	if(misses.length==0){break;}
		// 	while(misses[0]<counter){
		// 		console.log(misses[0]);
		// 		emptyString+=genSpace(misses[0]-lastIndex);
		// 		emptyString+="!";
		// 		lastIndex = misses[0];
		// 		misses.shift();
		// 		if(misses.length==0){break;}

		// 	}
			
		// }
		lastIndex=-1;
		for(const missIndex of misses){
			console.log(missIndex, missIndex-lastIndex-1);
			emptyString+=genSpace(missIndex-lastIndex-1)+'!';
			lastIndex=missIndex;

		}
		
		console.log("empyString is?", emptyString, emptyString.length);
		// generate blast qseq strand, and mismatch strand
		for(counter=0;counter<qseq.length;counter+=$scope.buffer){
			let segment = qseq.substring(counter, counter+$scope.buffer);
			segment = breakUpRow($scope.bucket, segment);
			let missSegments = emptyString.substring(counter, counter+$scope.buffer);
			console.log(missSegments, "missSegments", missSegments.length);
			if(missSegments.length>0){
				missSegments = breakUpRow($scope.bucket, missSegments);
				
			}
			else{
				missSegments="";
			}
			missResults.push(missSegments);
			results.push(segment);
		}

		$scope.sections =returnList($scope.textbuffer, $scope.buffer, $scope.bucket);
		$scope.blastSections=results;
		$scope.blastMisses = missResults;
		console.log("FINISHED---------", results);
		console.log(missResults)
	}
});



// given a string of length buffer, break it up into buckets of bucket, with 1 space every bucket
function breakUpRow(bucket, text){
	let segments = "";
	// bc "     "==false.
	if(text==false&&text.length>0){
		return "";
	}
	if(text.length==0||text===false){
		console.log("error, bad text!", text, text.length);
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