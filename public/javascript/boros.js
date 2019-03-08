
var borosApp = angular.module('plasmidGroup', ['angularplasmid']);

borosApp.controller('borosCtrl', function($scope, $compile, $element, $templateCache) {

	$scope.plasmidList = [];
	
});

getPlasmids();
async function getPlasmids(){
  await signInUser({username:"lisa", password:"deng"});
  let allPlasmids = await getPlasmidsForUser();
  console.log("all plasmids? ", allPlasmids, allPlasmids.message);

  if(allPlasmids.message){
  	console.log("i am here");
  	  var scope = angular.element($("#plasmidViewer")).scope()
  	  console.log(allPlasmids.response);
  	  scope.$apply(function () {
        scope.plasmidList= allPlasmids.response;
      });
  }
}

