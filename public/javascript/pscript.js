let defaultlen = 100;
let testStr = "";
let compStr = "";
const startCodon = "ATG";
const stopCodon = "ATT";

// testStr ="AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
testStr = "AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
// testStr="ATATAAATCGATATAAATCGATATAAATCGATATAAATCG";
var app = angular.module('myApp', ['angularplasmid']);
    app.controller('myCtrl', function($scope, $compile, $element, $templateCache) {
        $scope.myRad= 200;
        $scope.seq = testStr;
        $scope.comp = compStr;
        $scope.search = "";
        $scope.selected = "dna";
        $scope.title="Viewer";
        $scope.view = "";

        // search endpoints
        $scope.selectedStart = 0;
        $scope.selectedEnd = 0;
        $scope.searchResults = [];

        // highlight endpoints
        $scope.start = 0;
        $scope.end = 0;

        // annotation endpoints and values
        $scope.annotateStart = false;
        $scope.annotateEnd = false;
        $scope.annotateName = "default";
        $scope.annotations = [{start:5, end:7, name:"Annotated Frame"}];
        // plasmid attributes
        $scope.interval = Math.floor(Math.max($scope.seq.length/30, 1));
        $scope.minLength = 0;
        $scope.orfs = findAllORF($scope.seq, $scope.minLength);

        $scope.setSearchPoints = function(start,end){$scope.selectedStart=start; $scope.selectedEnd=end;};
        $scope.setAnnotatePoints = function(start,end, name){$scope.annotateStart=start; $scope.annotateEnd=end; $scope.annotateName=name;};
        $scope.toggle = function(newSelected){toggle(newSelected)};
        $scope.clear  = function(){
          $scope.search="";
          $scope.searchResults = [];
          $scope.selectedStart=false;
          $scope.selectedEnd=false;
          $scope.view="";
          $scope.title="Viewer";
        }
        $scope.searchDNA = function(){
          $scope.title="";
          $scope.searchResults = [];
          if($scope.search==""){return;}
          let index = $scope.seq.indexOf($scope.search, 0);
          while(index!=-1){
            $scope.searchResults.push({start:index, end:index+$scope.search.length});
            index = $scope.seq.indexOf($scope.search, index+1);
          }
          $scope.start = 0;
          $scope.end = 0;

        };
        $scope.annotate = function(start,end){
          // don't bother
          if(start==end){
            return;
          }
          if(start<0&&end<0){
            start+=$scope.seq.length;
            end+=$scope.seq.length;
          }
          let result = annotate(Math.min(start,end), Math.max(start,end));
          $scope.start=0;
          $scope.end=0;

          if(!result){return;}
          $scope.showDNA('Annotated Frame ', start, end); 
          $scope.toggle('annotate'); 
          $scope.setAnnotatePoints(start, end, 'Annotated Frame');
        };
        // reset highlighter
        $scope.reset = function(){
          $scope.start = 0;
          $scope.end = 0; 
          $scope.toggle("dna"); 
          $scope.title="";
          let scope2 = angular.element($("#editorModule")).scope();
          scope2.setEditor(0,0,$scope.seq);
        };
        $scope.resetView = function(){$scope.view="";};
        $scope.resetSearch = function(){$scope.selectedEnd = false;$scope.selectedStart = false;};
        // removes the marker for the annotation, doesn't alter the sequence
        $scope.removeAnnotation = function(start,end){
          for(x=0;x<$scope.annotations.length;x++){
            if($scope.annotations[x].start ==start&&$scope.annotations[x].end==end){
              $scope.view="";
              $scope.selected="viewer";
              $scope.title="Viewer";
              $scope.annotations.splice(x,1);
              return;
            }
          }
        };
        // deletes sequence in the annotation, shifts others over
        $scope.deleteAnnotation = function(start, end){
          deleteAnnotation(start,end);
        };
        $scope.showDNA = function(title, x1, x2){
          $scope.title=title+x1+"-"+x2;
          $scope.view = getNewSeqIn(x1,x2);
        };
        $scope.orfsFunc = function(){console.log("I was called!");$scope.orfsdata=findAllORF($scope.seq, $scope.minLength);};
        $scope.orfsdata = findAllORF($scope.seq, $scope.minLength);
        $scope.editAnnotation = function(){editAnnotation()};
        $scope.submitAnnotation = function(){submitAnnotation();};
        $scope.deleteSequence = function(){deleteSequence();};
        $scope.editName = function(){editName();};
        $scope.editKeys = function(e){editKeys(e)};
        $scope.editOrfMinLength = function(e){editOrfMinLength(e)};
        $scope.editInterval = function(e){editInterval(e)};
        $scope.editSequence = function(){editSequence();};
        $scope.submitSequence = function(start,end,e){submitSequence(Math.min(start,end),Math.max(start,end),e)};
    });


/*
* Removes focus on tabs title in the interface
*/
function deactivateTitle(){
  document.getElementById("searchAnnotate").classList.remove("active");
  document.getElementById("dna").classList.remove("active");
  document.getElementById("viewer").classList.remove("active");
}

/*
* Toggles focus on the tabs in the interface
* @param{string} newSelected - string representation of which tab to focus on
*/
function toggle(newSelected){
  var ann = angular.element($("#divider")).scope();
  ann.selected = newSelected;
  deactivateTitle();
  if(newSelected=="search"){
    document.getElementById("searchAnnotate").classList.add("active");
    ann.title="";
    ann.view="";
  }
  if(newSelected=="dna"){
    document.getElementById("dna").classList.add("active");
    let scope2 = angular.element($("#editorModule")).scope();
    scope2.setEditor(0,0,ann.seq);
  }
  if(newSelected=="viewer"||newSelected=="annotate"){
    document.getElementById("viewer").classList.add("active");
    let scope2 = angular.element($("#editorModule")).scope();
    scope2.setEditor(ann.start,ann.end,ann.seq.substring(ann.start,ann.end));
  }
}


/*
* Edits the dna sequence directly. Assumes start<end
* @param{int} start = start index within the sequence
* @param{int} end - end index within the sequence
* @param{event} event - event object on keydown
*/
function submitSequence(start,end, event){
   if(event.keyCode!=13){
    return;
  }
  console.log(start,end);
  event.preventDefault();
  var scope = angular.element($("#divider")).scope();
  var seq = scope.seq;
  var ann = scope.annotations;
  var newStr = document.getElementById("sampleeditor").innerText;
  console.log(newStr);
  if(start<0){
    let beg = newStr.substring(Math.abs(start));
    let mid = seq.substring(end, start+scope.seq.length);
    let last = newStr.substring(0, Math.abs(start));
    scope.seq = beg+mid+last;
  }
  // both indices are positive
  else{
    scope.seq = seq.substring(0,start)+newStr+seq.substring(end);
  }
  var oldEnd = scope.end;
  var diff = newStr.length-Math.abs(end-start);
  scope.end += diff;
  scope.title = "Sample Frame "+scope.start+"-"+scope.end;

  // shift annotations
  for(x=0;x<ann.length;x++){
    if(ann[x].start>=oldEnd){
      ann[x].start+=diff;
      ann[x].end+=diff;
    }
  }

  document.getElementById("sampleeditor").setAttribute("contentEditable", "false");
}




/*
* Allows for sequence editing
*/

function editSequence(){
  var scope = angular.element($("#divider")).scope();
  var editor = document.getElementById("sampleeditor");
  editor.setAttribute("contentEditable", "true");
}

/*
* Annotates section of the plasmid. Annotations may not overlap
* @param{int} start - start index of the annotation
* @param{int} end - end index of the annotation
*/
function annotate(start, end){
  let oldStart = start;
  let oldEnd = end;
  start = Math.min(oldStart, oldEnd);
  end = Math.max(oldStart, oldEnd);

  var ann = angular.element($("#divider")).scope().annotations;
  for(x=0;x<ann.length;x++){
    if(start<ann[x].end && start>=ann[x].start||end<=ann[x].end&&end>ann[x].start||start<=ann[x].start&&end>=ann[x].end){
      return false;
    }
  }
  ann.push({start:Math.min(start,end), end:Math.max(start,end), name:"Annotated Frame", set:false});
  return true;
}

/*
* Allows focus on editing the annotation
*/
function editAnnotation(){
  var scope = angular.element($("#divider")).scope();
  var editor = document.getElementById("annotationeditor");
  editor.setAttribute("contentEditable", "true");
  editor.focus();
}
/*
* After editing, submit the new annottation
* shifts all annotations behind edited annotation to addition or deletion
*/
function submitAnnotation(){
    var scope = angular.element($("#divider")).scope();
    var editor = document.getElementById("annotationeditor");
    editor.setAttribute("contentEditable", "false");
    var newAnn = editor.innerText;
    var diff = (editor.innerText.length-(scope.annotateEnd-scope.annotateStart));
    var newEnd = scope.annotateEnd + diff;
    var newStr = "";
    if(scope.annotateStart<0){
      let start = newAnn.substring(Math.abs(scope.annotateStart));
      let mid = scope.seq.substring(scope.annotateEnd, scope.annotateStart+scope.seq.length);
      let end = newAnn.substring(0, Math.abs(scope.annotateStart));
      newStr = start+mid+end;
    }
    else{
      newStr = scope.seq.substring(0,scope.annotateStart) + newAnn + scope.seq.substring(scope.annotateEnd);
    }
    scope.seq = newStr;
    let oldEnd = scope.annotateEnd;
    var ann = scope.annotations;

    // just move if the user deletes the whole sequence
    if(editor.innerText.length==0){
      ann = ann.filter(x=>x.start!=scope.annotateStart&&x.end!=scope.annotateEnd);
      scope.annotations = ann;
    }

    for(x=0;x<ann.length;x++){
      if(ann[x].start>=oldEnd){
        ann[x].start+=diff;
        ann[x].end+=diff;
      }
      // the current annotation to modify
      else if(ann[x].start==scope.annotateStart && ann[x].end==scope.annotateEnd){
        scope.annotateEnd = newEnd;
        ann[x].end = newEnd;
      }
    }
}

/*
* Given a start and end index, returns the subsection of the sequence within those indices
* factors in potential negative and positive start/end indices
* @param{int} start - start index in sequence string 
* @param{int} end - end index in sequence string
* @return{string} returns string within start end [start,end)
*/
function getNewSeqIn(start,end){
  let scope = angular.element($("#divider")).scope();
  let seq = scope.seq;

  if(start>=0&&end>=0){
   return seq.substring(start,end);
  }
  else if(start<0&&end>=0){
    start=seq.length+start;
    return seq.substring(start)+seq.substring(0,end);
  }
  else if(start>=0&&end<0){
    end=scope.seq.length+end;
    return seq.substring(end)+seq.substring(0,start);
  }
  else if(start<0&&end<0){
    start+=seq.length;
    end+=seq.length;
    return seq.substring(start,end);
  } 
}

/*
* Given a start and end index, returns the subsection of the sequence outside those indices
* factors in potential negative and positive start/end indices
* @param{int} start - start index in sequence string 
* @param{int} end - end index in sequence string
* @return{string} returns string outside start end [start,end)
*/
function getNewSeqOut(start,end){
  let scope = angular.element($("#divider")).scope();
  let seq = scope.seq;

  if(start>=0&&end>=0){
   return seq.substring(0,start)+seq.substring(end);
  }
  else if(start<0&&end>=0){
    start=seq.length+start;
    return seq.substring(start,end);
  }
  else if(start>=0&&end<0){
    end=scope.seq.length+end;
    return seq.substring(start,end);
  }
  else if(start<0&&end<0){
    start+=seq.length;
    end+=seq.length;
    return seq.substring(0,start)+seq.substring(end);
  } 
}

/*
* Deletes base pairs within start and end index of the sequence
* @param{int} start - starting index
* @param{int} end - ending index
*/
function deleteAnnotation(start,end){

  let scope = angular.element($("#divider")).scope();
  let seq = scope.seq;
  let diff = end-start;
  scope.seq = getNewSeqOut(start,end);
  if(start>=0&&end>=0){
    diff = end-start;
  }
  else if (start<0&&end>=0){
    diff = end-start-(Math.abs(start));
  }
  else if(start>=0&&end<0){
    diff = start;
  } 
  else if(start<0&&end<0){
    start += seq.length;
    end += seq.length;
    diff = end-start;
  }
  // shift following annotations
  for(x=0;x<scope.annotations.length;x++){
    if(end<=scope.annotations[x].start){
      scope.annotations[x].start-=diff;
      scope.annotations[x].end-=diff;
    }
  }
}

/*
* Finds all ORFs in the sequence, excludes all ORFS below the threshold length
* returns a list of all the orfs
* @param{string} seq - current DNA sequence
* @param{minLength} - minimum length of the ORF allowed
* @return[[start,end]]
*/
// finds all ORFs, excludes all ORFS below threshold length
function findAllORF(seq, minLength){
  let results = [];
  let index = 0;
  while(seq.indexOf(startCodon, index)!=-1){
    let start = seq.indexOf(startCodon, index);
    let end = seq.indexOf(stopCodon, start);
    // no end codon detected, break
    if(end==-1){
      // now check for ahead of the start codon
      // this is important, since our sequence is circular
      let ahead = seq.substring(0, start);
      let nextEnd = ahead.indexOf(stopCodon,0);
      // truly there is no stop
      if(nextEnd==-1){
        break;
      }
      end = nextEnd;
    }

    if(Math.abs(end-start)>=minLength){
      results.push([start, end+1]);
    }
    index = start+1;
  }
  // sort by orf length, easier for clicking on and rendering
  results.sort(function(a, b) {
    let x1 = Math.min(a[0], a[1]);
    let x2 = Math.max(a[0],a[1]);
    let y1 = Math.min(b[0], b[1]);
    let y2 = Math.max(b[0],b[1]);
    return Math.abs(x1-x2) - Math.abs(y1-y2);
  });
  return results;
}


// begin editing of annotation name
function editName(){
  var name = document.getElementById("name");
  name.readOnly=false;
}

// finish editing of name
function editKeys(e){
  var name = document.getElementById("name");
  var scope = angular.element($("#divider")).scope();

  if(e.keyCode==13){
    e.preventDefault();
    name.blur(); 
    scope.annotateName = name.value;
    name.readOnly=true;
    // update value in the annotations list
    var ann = scope.annotations;
    for(x=0;x<ann.length;x++){
      if(ann[x].start==scope.annotateStart&&ann[x].end==scope.annotateEnd){
        ann[x].name=name.value;
        ann[x].set=true;
      }
    }
    return;
  }
}

/*
* Edits the minimum ORF length required
* @param{event} e - event fired by editing 
*/
function editOrfMinLength(e){
  var orf = document.getElementById("orf");
  var scope = angular.element($("#divider")).scope();
  if(e.keyCode==13){
    e.preventDefault();
    orf.blur();
    scope.minLength = orf.value;
    scope.orfsdata = findAllORF(scope.seq, scope.minLength);
  }
}

/*
* Edits the interval length of tick marks
* @param{event} e - event fired by editing 
*/

function editInterval(e){
  var interval = document.getElementById("interval");
  var scope = angular.element($("#divider")).scope();
  if(e.keyCode==13){
    e.preventDefault();
    interval.blur();
    scope.interval = interval.value;
  }
}
