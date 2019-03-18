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
*	  {string} plasmidName: name of plasmid
*   {int} interval: number of ticks 
*   {int} minLength: min length of orfs shown
*   {string} annotations: json string of object of annotations
* }
*/
function createPlasmid(fields){
  console.log('in create plasmid!', fields);
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


/*
* updates an existing plasmid
* @param{object} field
* {
* @param {string} sequence - new DNA sequence
* @param {string} newPlasmidName - new name of the plasmid
* @param {int} interval - new interval of ticks on display
* @param {int} minLength - new minimum length of orfs accepted
* @param {string} annotations - new JSON string of object containing annotations information
* }
*/
function updatePlasmid(fields){
  console.log(" in update plasmid");
  return axios.put('/api/plasmids/plasmid', fields)
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
      // TODO: error output here
      let data = returnPlasmidData(axiosResponse);
      console.log("plasmid update failed: ", data);
      return data;
    }); // on failure (Other Status Code) 
}

/*
* updates an existing plasmid's annotation field
* @param{object} field
* {
* @param {string} annotations - new JSON string of object containing annotations information
* }
*/
function updatePlasmidAnnotations(fields){
  console.log(" in update plasmid");
  return axios.put('/api/plasmids/plasmid/annotations', fields)
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
      // TODO: error output here
      let data = returnPlasmidData(axiosResponse);
      console.log("plasmid update failed: ", data);
      return data;
    }); // on failure (Other Status Code) 
}

/*
* loads in current plasmid 
* uses session variables to load plasmid
*/
function loadCurrentPlasmid(){
  return axios.get('/api/plasmids/current')
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
      // TODO: error output here
      let data = returnPlasmidData(axiosResponse);
      console.log("plasmid load failed: ", data);
      return data;
    }); // on failure (Other Status Code) 
}


/*
* loads in a specific plasmid
* @param {object} field {@param{string} plasmid:""}
* @return plasmid object, or error message if plasmid ID does not exist for the signed in user
*/
function loadSpecificPlasmid(plasmidID){
  return axios.get('/api/plasmids/plasmid/'+plasmidID)
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
      // TODO: error output here
      let data = returnPlasmidData(axiosResponse);
      console.log("plasmid load failed: ", data);
      return data;
    }); // on failure (Other Status Code) 
}

/*
* Sets selected plasmid ID in session variables
* @param{string} plasmidID
*/
function setPlasmid(plasmidID){
  return axios.put('/api/plasmids/plasmid/plasmidID/'+plasmidID)
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
      let data = returnPlasmidData(axiosResponse);
      console.log("plasmid load failed: ", data);
      return data;
    }); // on failure (Other Status Code) 
}



/**
 * Delete a plasmid
 * @param {string} plasmidID
 * @return {200} - success message
 */
 function deletePlasmid(plasmidID){
  return axios.delete('/api/plasmids/'+plasmidID)
    .then(returnPlasmidData) // on success (Status Code 200)
    .catch(function(axiosResponse){
      // TODO: error output here
      let data = returnPlasmidData(axiosResponse);
      console.log("plasmid deletion failed: ", data);
      return data;
    }); // on failure (Other Status Code) 

 }