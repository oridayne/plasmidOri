
let testStr = "";
const startCodon = "ATG";
const stopCodon = "ATT";
startUp();

// list of prototypes 
var prototypes = [];
// prototypes = getProto();

// let matchedProto = getMatchedPrototypes();
// testStr ="AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
//testStr = "AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
// testStr = "TTCTCTGTCACAGAATGAAAATTTTTCTGTCATCTCTTCGTTATTAATGTTTGTAATTGACTGAATATCAACGCTTATTTGCAGCCTGAATGGCGAATGGGACGCGCCCTGTAGCGGCGCATTAAGCGCGGCGGGTGTGGTGGTTACGCGCAGCGTGACCGCTACACTTGCCAGCGCCCTAGCGCCCGCTCCTTTCGCTTTCTTCCCTTCCTTTCTCGCCACGTTCGCCGGCTTTCCCCGTCAAGCTCTAAATCGGGGGCTCCCTTTAGGGTTCCGATTTAGTGCTTTACGGCACCTCGACCCCAAAAAACTTGATTAGGGTGATGGTTCACGTAGTGGGCCATCGCCCTGATAGACGGTTTTTCGCCCTTTGACGTTGGAGTCCACGTTCTTAATAGTGGACTCTTGTTCCAAACTGGAACAACACTCAACCCTATCTCGGTCTATTCTTTTGATTTATAAGGGATTTTGCCGATTTCGGCCTATTGGTTAAAAAATGAGCTGATTTAACAAAAATTTAACGCGAATTTTAACAAAATATTAACGCTTACAATTTAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTATCCGCTCATGAGACAATAACCCTGATAAATGCTTCAATAATATTGAAAAAGGAAGAGTATGAGTATTCAACATTTCCGTGTCGCCCTTATTCCCTTTTTTGCGGCATTTTGCCTTCCTGTTTTTGCTCACCCAGAAACGCTGGTGAAAGTAAAAGATGCTGAAGATCAGTTGGGTGCACGAGTGGGTTACATCGAACTGGATCTCAACAGCGGTAAGATCCTTGAGAGTTTTCGCCCCGAAGAACGTTTTCCAATGATGAGCACTTTTAAAGTTCTGCTATGTGGCGCGGTATTATCCCGTATTGACGCCGGGCAAGAGCAACTCGGTCGCCGCATACACTATTCTCAGAATGACTTGGTTGAGTACTCACCAGTCACAGAAAAGCATCTTACGGATGGCATGACAGTAAGAGAATTATGCAGTGCTGCCATAACCATGAGTGATAACACTGCGGCCAACTTACTTCTGACAACGATCGGAGGACCGAAGGAGCTAACCGCTTTTTTGCACAACATGGGGGATCATGTAACTCGCCTTGATCGTTGGGAACCGGAGCTGAATGAAGCCATACCAAACGACGAGCGTGACACCACGATGCCTGTAGCAATGGCAACAACGTTGCGCAAACTATTAACTGGCGAACTACTTACTCTAGCTTCCCGGCAACAATTAATAGACTGGATGGAGGCGGATAAAGTTGCAGGACCACTTCTGCGCTCGGCCCTTCCGGCTGGCTGGTTTATTGCTGATAAATCTGGAGCCGGTGAGCGTGGGTCTCGCGGTATCATTGCAGCACTGGGGCCAGATGGTAAGCCCTCCCGTATCGTAGTTATCTACACGACGGGGAGTCAGGCAACTATGGATGAACGAAATAGACAGATCGCTGAGATAGGTGCCTCACTGATTAAGCATTGGTAACTGTCAGACCAAGTTTACTCATATATACTTTAGATTGATTTAAAACTTCATTTTTAATTTAAAAGGATCTAGGTGAAGATCCTTTTTGATAATCTCATGACCAAAATCCCTTAACGTGAGTTTTCGTTCCACTGAGCGTCAGACCCCGTAGAAAAGATCAAAGGATCTTCTTGAGATCCTTTTTTTCTGCGCGTAATCTGCTGCTTGCAAACAAAAAAACCACCGCTACCAGCGGTGGTTTGTTTGCCGGATCAAGAGCTACCAACTCTTTTTCCGAAGGTAACTGGCTTCAGCAGAGCGCAGATACCAAATACTGTTCTTCTAGTGTAGCCGTAGTTAGGCCACCACTTCAAGAACTCTGTAGCACCGCCTACATACCTCGCTCTGCTAATCCTGTTACCAGTGGCTGCTGCCAGTGGCGATAAGTCGTGTCTTACCGGGTTGGACTCAAGACGATAGTTACCGGATAAGGCGCAGCGGTCGGGCTGAACGGGGGGTTCGTGCACACAGCCCAGCTTGGAGCGAACGACCTACACCGAACTGAGATACCTACAGCGTGAGCTATGAGAAAGCGCCACGCTTCCCGAAGGGAGAAAGGCGGACAGGTATCCGGTAAGCGGCAGGGTCGGAACAGGAGAGCGCACGAGGGAGCTTCCAGGGGGAAACGCCTGGTATCTTTATAGTCCTGTCGGGTTTCGCCACCTCTGACTTGAGCGTCGATTTTTGTGATGCTCGTCAGGGGGGCGGAGCCTATGGAAAAACGCCAGCAACGCGGCCTTTTTACGGTTCCTGGCCTTTTGCTGGCCTTTTGCTCACATGTTCTTTCCTGCGTTATCCCCTGATTCTGTGGATAACCGTATTACCGCCTTTGAGTGAGCTGATACCGCTCGCCGCAGCCGAACGACCGAGCGCAGCGAGTCAGTGAGCGAGGAAGCGGAAGAGCGCCTGATGCGGTATTTTCTCCTTACGCATCTGTGCGGTATTTCACACCGCATAGACCAGCCGCGTAACCTGGCAAAATCGGTTACGGTTGAGTAATAAATGGATGCCCTGCGTAAGCGGGTGTGGGCGGACAATAAAGTCTTAAACTGAACAAAATAGATCTAAACTATGACAATAAAGTCTTAAACTAGACAGAATAGTTGTAAACTGAAATCAGTCCAGTTATGCTGTGAAAAAGCATACTGGACTTTTGTTATGGCTAAAGCAAACTCTTCATTTTCTGAAGTGCAAATTGCCCGTCGTATTAAAGAGGGGCGTGGCCAAGGGCATGGTAAAGACTATATTCGCGGCGTTGTGACAATTTACCGAACAACTCCGCGGCCGGGAAGCCGATCTCGGCTTGAACGAATTGTTAGGTGGCGGTACTTGGGTCGATATCAAAGTGCATCACTTCTTCCCGTATGCCCAACTTTGTATAGAGAGCCACTGCGGGATCGTCACCGTAATCTGCTTGCACGTAGATCACATAAGCACCAAGCGCGTTGGCCTCATGCTTGAGGAGATTGATGAGCGCGGTGGCAATGCCCTGCCTCCGGTGCTCGCCGGAGACTGCGAGATCATAGATATAGATCTCACTACGCGGCTGCTCAAACTTGGGCAGAACGTAAGCCGCGAGAGCGCCAACAACCGCTTCTTGGTCGAAGGCAGCAAGCGCGATGAATGTCTTACTACGGAGCAAGTTCCCGAGGTAATCGGAGTCCGGCTGATGTTGGGAGTAGGTGGCTACGTCTCCGAACTCACGACCGAAAAGATCAAGAGCAGCCCGCATGGATTTGACTTGGTCAGGGCCGAGCCTACATGTGCGAATGATGCCCATACTTGAGCCACCTAACTTTGTTTTAGGGCGACTGCCCTGCTGCGTAACATCGTTGCTGCTGCGTAACATCGTTGCTGCTCCATAACATCAAACATCGACCCACGGCGTAACGCGCTTGCTGCTTGGATGCCCGAGGCATAGACTGTACAAAAAAACAGTCATAACAAGCCATGAAAACCGCCACTGCGCCGTTACCACCGCTGCGTTCGGTCAAGGTTCTGGACCAGTTGCGTGAGCGCATACGCTACTTGCATTACAGTTTACGAACCGAACAGGCTTATGTCAACTGGGTTCGTGCCTTCATCCGTTTCCACGGTGTGCGTCACCCGGCAACCTTGGGCAGCAGCGAAGTCGAGGCATTTCTGTCCTGGCTGGCGAACGAGCGCAAGGTTTCGGTCTCCACGCATCGTCAGGCATTGGCGGCCTTGCTGTTCTTCTACGGCAAGGTGCTGTGCACGGATCTGCCCTTGCTTCAGGAGATCGGTAGACCTCGGCCGTCGCGGCGCTTGCCGGTGGTGCTGACCCCGGATGAAGTGGTTCGCATCCTCGGTTTTCTGGAAGGCGAGCATCGTTTGTTCGCCCAGGACTCTAGCTATAGTTCTAGTGGTTGGCTACGTACCCGTAGTGGCTATGGCAGGGCTTGCCGCCCCGACGTTGGCTGCGAGCCCTGGGCCTTCACCCGAACTTGGGGGTTGGGGTGGGGAAAAGGAAGAAACGCGGGCGTATTGGTCCCAATGGGGTCTCGGTGGGGTATCGACAGAGTGCCAGCCCTGGGACCGAACCCCGCGTTTATGAACAAACGACCCAACACCCGTGCGTTTTATTCTGTCTTTTTATTGCCGTCATAGCGCGGGTTCCTTCCGGTATTGTCTCCTTCCGTGTTTCAGTTAGCCTCCCCCATCTCCCGGTTCCGCATGCTATGCATCCTTGTACAGCTCGTCCATGCCGAGAGTGATCCCGGCGGCGGTCACGAACTCCAGCAGGACCATGTGATCGCGCTTCTCGTTGGGGTCTTTGCTCAGCTTGGACTGGGTGCTCAGGTAGTGGTTGTCGGGCAGCAGCACGGGGCCGTCGCCGATGGGGGTGTTCTGCTGGTAGTGGTCGGCGAGCTGCACGCTGCCGTCCTCGATGTTGTGGCGGATCTTGAAGTTCACCTTGATGCCGTTCTTCTGCTTGTCGGCCATGATATAGACGTTGTGGCTGTTGTAGTTGTACTCCAGCTTGTGCCCCAGGATGTTGCCGTCCTCCTTGAAGTCGATGCCCTTCAGCTCGATGCGGTTCACCAGGGTGTCGCCCTCGAACTTCACCTCGGCGCGGGTCTTGTAGTTGCCGTCGTCCTTGAAGAAGATGGTGCGCTCCTGGACGTAGCCTTCGGGCATGGCGGACTTGAAGAAGTCGTGCTGCTTCATGTGGTCGGGGTAGCGGCTGAAGCACTGCACGCCGTAGGTCAGGGTGGTCACGAGGGTGGGCCAGGGCACGGGCAGCTTGCCGGTGGTGCAGATGAACTTCAGGGTCAGCTTGCCGTAGGTGGCATCGCCCTCGCCCTCGCCGGACACGCTGAACTTGTGGCCGTTTACGTCGCCGTCCAGCTCGACCAGGATGGGCACCACCCCGGTGAACAGCTCCTCGCCCTTGCTCACCGGGTGATCAAGTCTTCGTCGAGTGATTGTAAATAAAATGTAATTTACAGTATAGTATTTTAATTAATATACAAATGATTTGATAATAATTCTTATTTAACTATAATATATTGTGTTGGGTTGAATTAAAGGTCCGTATACTCCGGAATATTAATAGGATCCCGGTCCGAGCGCGCGGAATTCAATATTGGCCATTAGCCATATTATTCATTGGTTATATAGCATAAATCAATATTGGCTATTGGCCATTGCATACGTTGTATCTATATCATAATATGTACATTTATATTGGCTCATGTCCAATATGACCGCCATGTTGGCATTGATTATTGACTAGTTATTAATAGTAATCAATTACGGGGTCATTAGTTCATAGCCCATATATGGAGTTCCGCGTTACATAACTTACGGTAAATGGCCCGCCTGGCTGACCGCCCAACGACCCCCGCCCATTGACGTCAATAATGACGTATGTTCCCATAGTAACGCCAATAGGGACTTTCCATTGACGTCAATGGGTGGAGTATTTACGGTAAACTGCCCACTTGGCAGTACATCAAGTGTATCATATGCCAAGTCCGCCCCCTATTGACGTCAATGACGGTAAATGGCCCGCCTGGCATTATGCCCAGTACATGACCTTACGGGACTTTCCTACTTGGCAGTACATCTACGTATTAGTCATCGCTATTACCATGGTGATGCGGTTTTGGCAGTACACCAATGGGCGTGGATAGCGGTTTGACTCACGGGGATTTCCAAGTCTCCACCCCATTGACGTCAATGGGAGTTTGTTTTGGCACCAAAATCAACGGGACTTTCCAAAATGTCGTAATAACCCCGCCCCGTTGACGCAAATGGGCGGTAGGCGTGTACGGTGGGAGGTCTATATAAGCAGAGCTCGTTTAGTGAACCGTCAGATCACTAGAAGCTTTATTGCGGTAGTTTATCACAGTTAAATTGCTAACGCAGTCAGTGCTTCTGACACAACAGTCTCGAACTTAAGCTGCAGAAGTTGGTCGTGAGGCACTGGGCAGGTAAGTATCAAGGTTACAAGACAGGTTTAAGGAGACCAATAGAAACTGGGCTTGTCGAGACAGAGAAGACTCTTGCGTTTCTGATAGGCACCTATTGGTCTTACTGACATCCACTTTGCCTTTCTCTCCACAGGTGTCCACTCCCAGTTCAATTACAGCTCTTAAGGCTAGAGTACTTAATACGACTCACTATAGGCTAGCCTCGAGGCGGCCGCGACTGCAGGGATCCGAGGTACCAAGCTTAATCAACCTCTGGATTACAAAATTTGTGAAAGATTGACTGGTATTCTTAACTATGTTGCTCCTTTTACGCTATGTGAATACGCTGCTTTAATGCCTTTGTATCATGCTATTGCTTCCCGTATGGCTTTCATTTTCTCCTCCTTGTATAAATCCTGGTTGCTGTCTCTTTATGAGGAGTTGTGGCCCGTTGTCAGGCAACGTGGCGTGGTGTGCACTGTGTTTGCTGACGCAACCCCCACTGGTTGGGGCATTGCCACCACCTGTCAGCTCCTTTCCGGGACTTTCGCTTTCCCCCTCCCTATTGCCACGGCGGAACTCATCGCCGCCTGCCTTGCCCGCTGCTGGACAGGGGCTCGGCTGTTGGGCACTGACAATTCCGTGGTGTTGTCGGGGAAGCTGACGTCCTTTCCATGGCTGCTCGCCTGTGTTGCCACCTGGATTCTGCGCGGGACGTCCTTCTGCTACGTCCCTTCGGCCCTCAATCCAGCGGACCTTCCTTCCCGCGGCCTGCTGCCGGCTCTGCGGCCTCTTCCGCGTCTTCGCCTTCGCCCTCAGACGAGTCGGATCTCCCTTTGGGCCGCCTCCCCGCCTGCAGTCTGACAAGCTTGTCGAGAAGTACTAGAGGATCATAATCAGCCATACCACATTTGTAGAGGTTTTACTTGCTTTAAAAAACCTCCCACACCTCCCCCTGAACCTGAAACATAAAATGAATGCAATTGTTGTTGTTAACTTGTTTATTGCAGCTTATAATGGTTACAAATAAAGCAATAGCATCACAAATTTCACAAATAAAGCATTTTTTTCACTGCATTCTAGTTGTGGTTTGTCCAAACTCATCAATGTATCTTATCATGTCTGGATCTGATCACTGCTTGAGCCTAGGAGATCCGAACCAGATAAGTGAAATCTAGTTCCAAACTATTTTGTCATTTTTAATTTTCGTATTAGCTTACGACGCTACACCCAGTTCCCATCTATTTTGTCACTCTTCCCTAAATAATCCTTAAAAACTCCATTTCCACCCCTCCCAGTTCCCAACTATTTTGTCCGCCCACAGCGGGGCATTTTTCTTCCTGTTATGTTTTTAATCAAACATCCTGCCAACTCCATGTGACAAACCGTCATCTTCGGCTACTTT"
// TODO: idiot proof search bar
testStr="";
// createPlasmid({sequence:testStr, plasmidName:"test", interval:30, minLength:0, annotations:"[]"});

var app = angular.module('myApp', ['angularplasmid']);
    app.controller('myCtrl', function($scope, $compile, $element, $templateCache) {
        $scope.myRad= 200;
        $scope.seq = testStr;
        $scope.search = "";
        $scope.selected = "dna";
        $scope.plasmidName = "plasmid";
        $scope.testing = function(e){
          console.log("ive been clicked!", e);
        }

        $scope.plasmidID = false;
        $scope.searchResults = [];

        // highlight endpoints
        $scope.start = 0;
        $scope.end = 0;

        // annotation endpoints and values
        $scope.annotationHighlight="";
        $scope.annotateStart = false;
        $scope.annotateEnd = false;
        $scope.annotateName = "default";
        $scope.annotations = [{start:5, end:7, name:"Annotated Frame", annotationSeq:""}];
        $scope.annotationData = {"CACGGG":true};
        $scope.currentAnnotationSeq = "";
        $scope.updateAnnotations = function(){updateAnnotations()};
        // plasmid attributes
        $scope.interval = Math.floor(Math.max($scope.seq.length/30, 1));
        $scope.minLength = 0;
        $scope.orfs = findAllORF($scope.seq, $scope.minLength);

        $scope.awaitingMatch = false;
        $scope.matchedEnzymes = [];
        $scope.searchEnz = "";
        $scope.blastQuery = "";

        // indicator of when blast API results are loading
        $scope.loading = false;

        // start and end markers for indicating blast on plasmid svg
        $scope.blastStart = 0;
        $scope.blastEnd = 0;

        // XML objects returned by blast API get request
        $scope.hspList = [];

        // request ID of blast request, returned by blast API post request
        $scope.rid=false;
        // sets editor paramters here
        $scope.changeEditor = function(start,end){
          let editorScope = angular.element($("#editorModule")).scope();

          editorScope.setEditor(start,end);
        }

        // annotate plasmid
        $scope.setAnnotatePoints = function(start,end, name){$scope.annotateStart=start; $scope.annotateEnd=end; $scope.annotateName=name;};
        
        // toggles between views
        $scope.toggle = function(newSelected){toggle(newSelected)};

        // clears search results 
        $scope.clearSearch  = function(){
          $scope.search="";
          $scope.searchResults = [];
          let editorScope = angular.element($("#editorModule")).scope();
          editorScope.setEditor(0,$scope.seq.length,$scope.seq);
          deactivateTitle();
          $scope.toggle("option");
        }

        // clicking on search highlight pulls up text editor of that search
        $scope.viewSearch = function(start,end){
          $scope.toggle('search');
          $scope.changeEditor(start,end);
        }

        // function for searching the DNA
        $scope.searchDNA = function(){
          $scope.searchResults = [];
          $scope.search = $scope.search.toUpperCase();
          if($scope.search==""){return;}
          $scope.searchResults=searchDNA($scope.seq, $scope.search);
          $scope.start = 0;
          $scope.end = 0;
        };


        // reset highlighter
        $scope.reset = function(){
          $scope.start = 0;
          $scope.end = 0; 
          $scope.toggle("dna"); 
          // $scope.changeEditor(0,$scope.seq.length);
          let editorScope = angular.element($("#editorModule")).scope();
          editorScope.showAllText();
        };
        // changes editor according to annotation
        $scope.focusAnnotation = function(start,end){
          console.log("here!", start, end);
          $scope.currentAnnotationSeq = $scope.seq.substring(start,end);
          $scope.changeEditor(start,end);
        }

        $scope.annotateSearchResults = function(){
          let results = $scope.searchResults;
          console.log($scope.searchResults);
          let newAnnotationSeq = $scope.search;
          let newAnn = $scope.annotations;
          let defaultName = "Gene"+Object.keys($scope.annotationData).length;
          for(var index in results){
            let elt = results[index];
            newAnn.push({start:elt.start, end: elt.end, name:defaultName, annotationSeq: newAnnotationSeq});
          }
          newAnn.sort(compareAnnotations);
          $scope.annotations = newAnn;
          $scope.annotationData[newAnnotationSeq]=defaultName;
          console.log("new", $scope.annotationData);

        }
          // disable typing in anything a g c t, shift, arrowLeft, arrowRight, Backspace
        $scope.disable=function(event){
          // allow for (Ctrl|Meta) c,v,z copy, paste, undo
          // for saving
          //disallow enter for single editor

          if((event.ctrlKey==true||event.metaKey==true)){
            return;
          }
          if(event.key=="Enter"||event.key==" "){
            event.preventDefault();
            return;
          }
          // disallow anything but the accepted letters and keys
          if(!acceptedLetters[event.key]&&!acceptedKeys[event.key]){
            event.preventDefault();
            return;
          }
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
        // removes all annotations with that gene seq
        $scope.removeAllAnnotations = function(geneSeq){
          delete $scope.annotationData[geneSeq];
          $scope.annotations = $scope.annotations.filter(ann=>ann.annotationSeq!=geneSeq);
        }
        $scope.highlightAllAnnotations = function(geneSeq, name){
          let anns = document.getElementsByClassName("annotationWrapper");
          $scope.deHighlightAllAnnotations();
          $scope.annotationHighlight=geneSeq;
          document.getElementById(name).classList.remove("silverOutline")
          document.getElementById(name).classList.add("activeBlast");
        }
        $scope.deHighlightAllAnnotations = function(){
          let anns = document.getElementsByClassName("annotationWrapper");
          console.log("anns", anns, anns.length);
          for(index=0; index<anns.length; index++){
            let elt = anns[index];
            anns[index].classList.remove("activeBlast");
            anns[index].classList.add("silverOutline")
          }       
          $scope.annotationHighlight="";
        }
        // deletes sequence in the annotation, shifts others over
        $scope.deleteAnnotation = function(start, end){
          deleteAnnotation(start,end);
        };

        // recomputes orfs
        $scope.orfsFunc = function(){$scope.orfsdata=findAllORF($scope.seq, $scope.minLength);
          console.log("loading in orfs, ", $scope.orfsdata)};

        // list of all orfs
        $scope.orfsdata = findAllORF($scope.seq, $scope.minLength);
        $scope.submitAnnotationName = function(event){submitAnnotationName(event);};

        // begin editing of annotation name
        $scope.editAnnotationName = function(event){editAnnotationName(event);};

        // submit editing of annotation names
        $scope.editKeys = function(e){editKeys(e)};
        $scope.editOrfMinLength = function(e){editOrfMinLength(e)};
        $scope.editInterval = function(e){editInterval(e)};
        $scope.viewORF = function(start,end){
          console.log("view orf", start, end);
          // special case, for when an ORF wraps around the 'start' and 'end' of the dna sequence
          if(start>end){
            start-=$scope.seq.length;
          }
          $scope.changeEditor(start,end+2);
        }

        // removes blast marker from the plasmid svg
        // resets blast editor, but not blast results
        $scope.resetBlast = function(){
          $scope.blastStart = 0;
          $scope.blastEnd = 0;
          let blastScope = angular.element($("#blastModule")).scope();
          blastScope.editorBlastMatch = {};
          blastScope.blastSections=[];
          blastScope.textbuffer = "";
        }

        // clears blast results completely
        $scope.clearBlast = function(){
          $scope.rid = false;
          $scope.blastQuery = "";
          $scope.loading = false;
          $scope.hspList = [];
          $scope.blastMatch = {};
          $scope.resetBlast();
        }

        // sets loading to true and awaits api call
        $scope.blastSequence = async function(){
          $scope.loading = true;
          let result = await BlastAlign($scope.blastQuery, $scope.seq);
          // TODO: what if the query fails?
          $scope.$apply(function () {
            $scope.rid = result;

          });
          await getBlast($scope.rid);
          $scope.$apply(function () {
            $scope.loading = false;

          });
        }
        $scope.blastMatch = {};
        $scope.setBlast = function(blastObj){
          $scope.blastMatch = blastObj;
          let start = Math.min($scope.blastMatch.hfrom, $scope.blastMatch.hto);
          let end =  Math.max($scope.blastMatch.hfrom, $scope.blastMatch.hto);
          $scope.blastStart=start;
          $scope.blastEnd=end;
          $scope.blastMatch.hfrom = start;
          $scope.blastMatch.hto = end;

          console.log("blast match", blastObj);
          let blastScope = angular.element($("#blastModule")).scope();
          blastScope.editorBlastMatch = blastObj;
          blastScope.setEditor(start,end, blastObj.hseq);

        }
        $scope.deactivateAllHsp = function(){
          let hsps = document.getElementsByClassName("blastHSP");
          for(x=0;x<hsps.length;x++){
            hsps[x].classList.remove("activeBlast");
          }
        }
        $scope.activateHsp = function(index){
          $scope.deactivateAllHsp();
          document.getElementById("hsp"+index).classList.add("activeBlast");
          $scope.testToggle=index;
        };

        $scope.sortMatchedEnz = function(key){
          if(key=="index"){
            $scope.matchedEnzymes = $scope.matchedEnzymes.sort(function(a,b){
              return a.index-b.index;
            });
          }
          // sort by alphabetical position
          else{
            $scope.matchedEnzymes = $scope.matchedEnzymes.sort(compareEnzymes);
          }
        }
        // TODO: switch this to local storage in future....
        $scope.generateEnzymes = async function(){
          console.log('generating enzymes called');
          let text = angular.element($("#editorModule")).scope().textbuffer;
          let matched = await generateEnzymes(text);
          console.log("finished gen");
          $scope.$apply(function(){
            $scope.matchedEnzymes = matched;

          })
        }
        $scope.selectAllEnz = function(){
          for(index=0;index<$scope.matchedEnzymes.length;index++){
            $scope.matchedEnzymes[index].show=true;
          }
        }
        $scope.deselectAllEnz = function(){
          for(index=0;index<$scope.matchedEnzymes.length;index++){
            $scope.matchedEnzymes[index].show=false;
          }
        }
        $scope.peekEnzyme = function(index){
          $scope.matchedEnzymes[index].peek=true;
        }
        // only deselect if it wasn't deselected before
        $scope.unpeekEnzyme = function(index){
          $scope.matchedEnzymes[index].peek=false;
        }
        $scope.toggleEnzyme = function(index){
          if(!($scope.matchedEnzymes[index].hasOwnProperty('show'))){
            $scope.matchedEnzymes[index].show=false;
          }
          $scope.matchedEnzymes[index].show = !($scope.matchedEnzymes[index].show);
        }
    });


// testing 
// 52d7d8b2-0392-4b12-939c-74d85741a17b
// 9f48a0b6-8866-43c2-a815-5054c8b7200c plasmid1
async function getSpecificPlasmid(plasmidID){
  let plasmid = await loadSpecificPlasmid(plasmidID);
  console.log("this plasmid is ", plasmid);
  if(plasmid.response){
    console.log("in this place");
    let uuid = plasmid.response[0].uuid;
    let plasmidName = plasmid.response[0].plasmidName;
    let interval = plasmid.response[0].interval;
    let minLength = plasmid.response[0].minLength;
    let annotations = JSON.parse(plasmid.response[0].annotations);
    let sequence = plasmid.response[0].sequence;
    var scope = angular.element($("#divider")).scope();
     
    scope.$apply(function(){
      scope.plasmidID = uuid;
      scope.plasmidName = plasmidName;
      scope.interval = interval;
      scope.minLength = minLength;
      scope.annotations = annotations;
      scope.sequence = sequence;
    });
    scope.orfsFunc();

    // remake the editor
    // TODO: clear all the blast?
    let editorScope = angular.element($("#editorModule")).scope();
    editorScope.showAllText();
  }
  else{
    // TODO: error response?
  }
}

async function loadInPlasmid(plasmidID){
  let plasmid = await loadCurrentPlasmid();
  let matchedProto= await getMatchedPrototypes();
  console.log("loading in plasmid this plasmid is ", plasmid);
  if(plasmid.response){
    let uuid = plasmid.response[0].uuid;
    let plasmidName = plasmid.response[0].plasmidName;
    let interval = plasmid.response[0].interval;
    let minLength = plasmid.response[0].minLength;
    let annotations = JSON.parse(plasmid.response[0].annotations);
    let sequence = plasmid.response[0].sequence;
    var scope = angular.element($("#divider")).scope();
    var genes = JSON.parse(plasmid.response[0].annotationData);

    scope.$apply(function(){
      scope.plasmidID = uuid;
      scope.plasmidName = plasmidName;
      scope.interval = interval;
      scope.minLength = minLength;
      scope.annotations = annotations.sort(compareAnnotations);
      scope.annotationData = genes;
      scope.seq = sequence;
      scope.orfsdata=findAllORF(sequence, minLength);
      scope.toggle('dna');
      if(matchedProto.response){
        scope.matchedEnzymes = matchedProto.response.sort(compareEnzymes);
        // scope.deselectAllEnz();
      }
    });
    // remake the editor
    // TODO: clear all the blast?
      let editorScope = angular.element($("#editorModule")).scope();
      editorScope.$apply(function(){
        editorScope.textbuffer = sequence;
        editorScope.showAllText();
      })
    // scope.changeEditor(0, sequence.length);
  }
  else{
    // TODO: error response?
  }
}


// for testing
async function startUp(){
  console.log("calling StartUP")
  // await createUser({username:"lisa", password:"deng"});
  await signInUser({username:"lisa", password:"deng"});
  // let response = await createPlasmid({sequence:testStr, plasmidName:null, interval:30, minLength:0, annotations:"[]"}); 
  // console.log("this is the response ", response);
  // let allPlasmids = await getPlasmidsForUser();
  // getSpecificPlasmid("9f48a0b6-8866-43c2-a815-5054c8b7200c");
  await loadInPlasmid();
}

/*
* Given a request ID, get the blast results associated with it
* @param{int} start = start index within the sequence
* @param{int} end - end index within the sequence
* @param{event} event - event object on keydown
*/
// TODO: what happens if the request ID has not been computed yet/results are sitll computing
async function getBlast(RID){
  var ann = angular.element($("#divider")).scope();
  let hspList = await getHSPList(RID);
  ann.$apply(function(){
    ann.hspList = hspList;
  })
}


/*
* Removes focus on tabs title in the interface
*/
function deactivateTitle(){
  // document.getElementById("searchAnnotate").classList.remove("active");
  document.getElementById("dna").classList.remove("active");
  document.getElementById("viewer").classList.remove("active");
  document.getElementById("blast").classList.remove("active");

}

/*
* Toggles focus on the tabs in the interface
* @param{string} newSelected - string representation of which tab to focus on
*/
function toggle(newSelected){
  let scope = angular.element($("#divider")).scope();
  scope.selected = newSelected;
  deactivateTitle();
  if(newSelected=="dna"){
    document.getElementById("dna").classList.add("active");
    let editorScope = angular.element($("#editorModule")).scope();
    editorScope.showAllText();
    // scope.changeEditor(0,scope.seq.length);
  }
  if(newSelected=="viewer"||newSelected=="annotate"){
    document.getElementById("viewer").classList.add("active");
    scope.changeEditor(scope.start,scope.end);
  }
  if(newSelected=="orf"){
    document.getElementById("viewer").classList.add("active");
  }
  if(newSelected=="blast"){
    document.getElementById("blast").classList.add("active");
  }
  if(newSelected=="search"){
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
  event.preventDefault();
  var scope = angular.element($("#divider")).scope();
  var seq = scope.seq;
  var ann = scope.annotations;
  var newStr = document.getElementById("sampleeditor").innerText;
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
    return Math.abs(Math.abs(x1-x2) - Math.abs(y1-y2));
  });
  return results;
}




// begin editing of annotation name
function editAnnotationName(event){
  console.log(event, "event!")
  // var name = document.getElementById("name");
  let name = event.srcElement;
  name.readOnly=false;
}

// finish editing of name
// TODO: make this more obvious please??
function submitAnnotationName(e){
  let name = e.srcElement;
  var scope = angular.element($("#divider")).scope();
  if(e.keyCode==13){
    e.preventDefault();
    name.blur(); 
    scope.annotateName = name.value;
    name.readOnly=true;
    // update value in the annotations list
    var ann = scope.annotations;
    for(x=0;x<ann.length;x++){
      if(ann[x].annotationSeq==scope.currentAnnotationSeq){
        ann[x].name=name.value;
        ann[x].set=true;
      }
    }
    scope.annotationData[scope.currentAnnotationSeq]=name.value;
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

async function getProto(){
  let proto = await getAllPrototypes();
  console.log("proto ", proto);
  if("response" in proto){
    return proto.response;
  }
  return [];
}


function searchDNA(text, query){
  let index = text.indexOf(query, 0);
  let results = [];
  while(index!=-1){
    results.push({start:index, end:index+query.length});
    index = text.indexOf(query, index+1);
  }
  console.log("results", results);
  let searchLen = query.length;
    let searchStart = text.length - searchLen+1;
    let searchEnd = searchLen-1;
    let searchSeq = text.substring(searchStart)+text.substring(0, searchEnd);
    index = searchSeq.indexOf(query, 0);
    while(index!=-1){
      let startVal = index+searchStart-text.length;
        results.push({start:startVal, end:startVal+query.length});
        index = searchSeq.indexOf(query, index+1);
    }
    return results;
}


// checks if the annotations remain what they once were
// TODO: only checks if the annotation index numbers are reasonable within the index
// future: figure out how to free it from th e index...
function updateAnnotations(){
  let scope = angular.element($("#divider")).scope();
  let ann = scope.annotations;
  let annData = scope.annotationData;
  let seq = scope.seq;
  let newAnnotations = [];
  for(var gene in annData){
    let result = searchDNA(seq, gene);
    result.map(x=>{x.annotationSeq=gene; x.name=gene});
    newAnnotations = newAnnotations.concat(result);
  }
  scope.annotations = newAnnotations;
}

/*
* Comparison funciton for annotations
* sorts by annotation length, decreasing
*/
function compareAnnotations(ann1, ann2) {
  let annLength1 = ann1.end-ann1.start;
  let annLength2 = ann2.end-ann2.start;
  // if(ann1.start<0){
  //   annLength1 = 
  // }
  console.log(annLength1, annLength2);
  if (annLength1<annLength2) {
    return 1;
  }
  if (annLength1>annLength2) {
    return -1;
  }
  // a must be equal to b
  return 0;
}

/*
* Comparison funciton for matched enzymes 
* sorts by enzyme name
*/
function compareEnzymes(enz1, enz2) {
  let name1 = enz1.name.toUpperCase();
  let name2 = enz2.name.toUpperCase();
  if (name1<name2) {
    return -1;
  }
  if (name1>name2) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

async function setMatchedEnzymes(){
  let matchedProto = await getMatchedPrototypes();
  console.log("matched", matchedProto);
}

async function generateEnzymes(sequence){
  let prots =await getAllPrototypes();
  let protsList = [];
  if(!(prots.response)){
    return [];
  }
  protsList = prots.response;
  let matched = [];
  let converter = {"N":"[AGCT]", "M":"M", "K": false, "Y":false, "B":false, "R":false, "S": false};
  for(var index in protsList){
    let enz = protsList[index];
    let expr="";
    for(var i in enz.plainSequence){
      let letter = enz.plainSequence[i];
      // TODO: more needed here
      expr+=letter;
    }

    let tempSequence = sequence;
    let result = tempSequence.match(expr)
    while(result){
      matched.push({name:enz.name, index:result.index, plainSequence:result[0], sequence:enz.sequence});
      // DENG: uh....not quite.... 
      // TODO: double check this for when we add in lazy matching!
      tempSequence = tempSequence.substring(result.index+result[0].length);
      result = tempSequence.match(expr);
    }
  }
  return matched;

}

