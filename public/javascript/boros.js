
var borosApp = angular.module('plasmidGroup', ['angularplasmid']);

borosApp.controller('borosCtrl', function($scope, $compile, $element, $templateCache) {

	$scope.plasmidList = [];
  $scope.deletePlasmid = async function(plasmidID){await deletePlasmid(plasmidID); await getPlasmids();};
	$scope.focusPlasmid = function(plasmidID){defocusPlasmid(); focusPlasmid(plasmidID)};
  $scope.defocusPlasmid = function(){defocusPlasmid();};
  $scope.selectPlasmid = async function(plasmidID){console.log("seleting plasmid", plasmidID); await selectPlasmid(plasmidID)};

});
getPlasmids();
async function getPlasmids(){
  await signInUser({username:"lisa", password:"deng"});
  let allPlasmids = await getPlasmidsForUser();
  console.log("all plasmids? ", allPlasmids, allPlasmids.message);

  if(allPlasmids.message){
  	  var scope = angular.element($("#plasmidViewer")).scope();
      for(x=0;x<allPlasmids.response.length;x++){
        let objStr = allPlasmids.response[x].annotations;
        var result = JSON.parse(objStr);
        allPlasmids.response[x].annotations = result;
      }
  	  scope.$apply(function () {
        scope.plasmidList= allPlasmids.response;
      });
  }
}

function focusPlasmid(plasmidID){
  let plas = document.getElementById(plasmidID)
  plas.classList.add("activePlasmidItem");
}

function defocusPlasmid(){
  let plasmids = document.getElementsByClassName("boros");
  let arr = Array.from(plasmids);
  arr.map((x)=>{x.classList.remove("activePlasmidItem")})

}

async function selectPlasmid(plasmidID){
 let response = await setPlasmid(plasmidID);
 console.log("response", response);
 location.href = "/"
}


async function deleteBorosPlasmid(plasmidID){
  let deleted = await deletePlasmid(plasmidID);
  console.log("deleted!", deleted);

}