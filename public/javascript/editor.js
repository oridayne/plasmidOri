var app = angular.module('textApp', []);

var acceptedLetters = {"a":true, "g":true, "c":true, "t":true, "A":true, "G":true, "C":true, "T":true};
var acceptedKeys = {"Shift":true, "Backspace":true, "ArrowLeft":true, "ArrowRight":true};
var converter = {"A":"T", "T":"A", "G":"C", "C":"G"};

app.controller('myEditor',function($scope){

	$scope.text="AATGCGTATGCGATGATGCG";
	$scope.len=20;
	$scope.buffer = 5;
	$scope.names = ["lisa", "daiv", "matt", "lot"];
	$scope.sections =returnList($scope.text);
	$scope.returnList = function(){
		let result = [];
		for(x=0;x<$scope.text.length;x+=5){
			result.push($scope.text.substring(x,x+5));
		}
		$scope.sections = result;
		return result;
	}
	// disable typing in anything a g c t, shift, arrowLeft, arrowRight, Backspace
	$scope.disable=function(event){
		if(!acceptedLetters[event.key]&&!acceptedKeys[event.key]){
			event.preventDefault();
			return;
		}
	}

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
		console.log(event.key);
		console.log(event.keyCode);
		// prevent processing on anything but accepted Letters and backspace
		if(!acceptedLetters[event.key] && (event.key!="Backspace")){
			return;
		}
		let elt = document.getElementById(index);
		let test = angular.element(elt);
		let cursor = angular.element(elt).prop('selectionStart');
		let newVal = elt.value.toUpperCase();

		let newText = $scope.text.substring(0,index*5)+newVal+$scope.text.substring((index*5)+5);
		console.log(newVal, newText);
		$scope.text=newText;
		console.log(newText);
		$scope.sections=returnList(newText);
		console.log($scope.sections);
		let sub = $scope.sections[index][0];
		elt.value = sub;
		$scope.setSelectionRange(elt, cursor, cursor);
	}

});


function returnList(text){
	let result = [];

	for(x=0;x<text.length;x+=5){
		let threeFive = text.substring(x,x+5);
		let fiveThree="";
		for(y=0;y<5;y++){
			if(!threeFive[y]){
				break;
			}
			fiveThree+=converter[threeFive[y]];
		}
		result.push([threeFive,  fiveThree]);
	}
	return result;
}