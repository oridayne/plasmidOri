
let testStr = "";
const startCodon = "ATG";
const stopCodon = "ATT";

// testStr ="AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
testStr = "AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
// testStr="ATATAAATCGATATAAATCGATATAAATCGATATAAATCG";
var app = angular.module('myApp', ['angularplasmid']);
    app.controller('myCtrl', function($scope, $compile, $element, $templateCache) {
        $scope.myRad= 200;
        $scope.seq = testStr;
        $scope.search = "";
        $scope.selected = "dna";

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
        }

        $scope.viewSearch = function(start,end){
          $scope.toggle('search');
          $scope.setSearchPoints(start, end); 
          let editorScope = angular.element($("#editorModule")).scope();
          editorScope.setEditor(start,end,$scope.seq.substring(start,end));
        }
        $scope.searchDNA = function(){
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

        // annotats a selected region
        $scope.annotate = function(start,end){
          // don't bother
          if(start==end){
            return;
          }
          if(start<0&&end<0){
            start+=$scope.seq.length;
            end+=$scope.seq.length;
          }
          // helper function, handles all the computation, returns true if annotated correctly, false if it did not
          let result = annotate(Math.min(start,end), Math.max(start,end));
          $scope.start=0;
          $scope.end=0;

          if(!result){return;}
          $scope.toggle('annotate'); 
          $scope.setAnnotatePoints(start, end, 'Annotated Frame');
          let editorScope = angular.element($("#editorModule")).scope();
          editorScope.setEditor(start,end,$scope.seq.substring(start,end));


        };
        // reset highlighter
        $scope.reset = function(){
          $scope.start = 0;
          $scope.end = 0; 
          $scope.toggle("dna"); 
          let editorScope = angular.element($("#editorModule")).scope();
          editorScope.setEditor(0,$scope.seq.length,$scope.seq);
        };
        // resets the search params
        $scope.resetSearch = function(){$scope.selectedEnd = false;$scope.selectedStart = false;};
        // changes editor according to annotation
        $scope.focusAnnotation = function(start,end){
          let editorScope = angular.element($("#editorModule")).scope();
          editorScope.setEditor(start,end,$scope.seq.substring(start,end));
        }
        // removes the marker for the annotation, doesn't alter the sequence
        $scope.removeAnnotation = function(start,end){
          for(x=0;x<$scope.annotations.length;x++){
            if($scope.annotations[x].start ==start&&$scope.annotations[x].end==end){
              $scope.selected="viewer";
              $scope.annotations.splice(x,1);
              return;
            }
          }
        };
        // deletes sequence in the annotation, shifts others over
        $scope.deleteAnnotation = function(start, end){
          deleteAnnotation(start,end);
        };
        $scope.orfsFunc = function(){$scope.orfsdata=findAllORF($scope.seq, $scope.minLength);};
        $scope.orfsdata = findAllORF($scope.seq, $scope.minLength);
        $scope.editAnnotation = function(){editAnnotation()};
        $scope.submitAnnotation = function(){submitAnnotation();};
        $scope.deleteSequence = function(){deleteSequence();};
        $scope.editName = function(){editName();};
        $scope.editKeys = function(e){editKeys(e)};
        $scope.editOrfMinLength = function(e){editOrfMinLength(e)};
        $scope.editInterval = function(e){editInterval(e)};
        $scope.viewORF = function(start,end){
          let scope2 = angular.element($("#editorModule")).scope();
          scope2.setEditor(start,end+2,$scope.seq.substring(start,end+2));
        }
        $scope.rid=false;
        $scope.blastResults = getBlast();
        $scope.blastMatch = [10,50];
        // $scope.hspList = [{"bitscore":300, "score":300, "expect": "test", "identities":150, "align":150, "gaps":0}];
        $scope.setBlast = function(start,end){
          $scope.blastMatch = [Math.min(start-1,end-1),Math.max(start-1,end-1)];
        }
        $scope.hspList =  getHSPList();

    });

async function getBlast(){
  let results = await getBlastText("5S0DJ4N6113");
  // console.log("results are in!", results);
  var ann = angular.element($("#divider")).scope();
  ann.blastResults = results;
  ann.hspList = await getHSPList();
  // return results
}


console.log(getBlast());


/*
* Removes focus on tabs title in the interface
*/
function deactivateTitle(){
  // document.getElementById("searchAnnotate").classList.remove("active");
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
  if(newSelected=="dna"){
    document.getElementById("dna").classList.add("active");
    let editorScope = angular.element($("#editorModule")).scope();
    editorScope.setEditor(0,ann.seq.length,ann.seq);
    // editorScope.switchtoDNA();
  }
  if(newSelected=="viewer"||newSelected=="annotate"){
    document.getElementById("viewer").classList.add("active");
    // editorScope.switchtoPartial();
    let scope2 = angular.element($("#editorModule")).scope();
    scope2.setEditor(ann.start,ann.end,ann.seq.substring(ann.start,ann.end)); 
  }
  if(newSelected=="orf"){
    document.getElementById("viewer").classList.add("active");
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
  console.log("sorting???");

  // sort by orf length, easier for clicking on and rendering
  results.sort(function(a, b) {
    let x1 = Math.min(a[0], a[1]);
    let x2 = Math.max(a[0],a[1]);
    let y1 = Math.min(b[0], b[1]);
    let y2 = Math.max(b[0],b[1]);
    return Math.abs(Math.abs(x1-x2) - Math.abs(y1-y2));
  });
  console.log(results);
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
