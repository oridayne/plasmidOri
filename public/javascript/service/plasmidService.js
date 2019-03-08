function showPlasmidResponse(axiosResponse) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
}

function returnPlasmidData(axiosResponse){
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  return fullResponse.data;
}

/*
* creates a plasmid
* @param{object} field
* {
* 	{string} sequence: dna sequence
*	{string} plasmidName: name of plasmid
*   {int} interval: number of ticks 
*   {int} minLength: min length of orfs shown
*   {string} annotations: json string of object of annotations
* }
*/
function createPlasmid(fields){
  return axios.post('/api/plasmids', fields)
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
    	// TODO: error output here
    	let data = returnPlasmidData(axiosResponse);
    	console.log("plasmid creation failed: ", data);
      return data;
    }); // on failure (Other Status Code) 

}



/*
* Gets all the plasmids for the current user
*/
function getPlasmidsForUser(){
  return axios.get('/api/plasmids/all')
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
      // TODO: error output here
      let data = returnPlasmidData(axiosResponse);
      console.log("getting all plasmids failed ", data);
    }); // on failure (Other Status Code) 

}

