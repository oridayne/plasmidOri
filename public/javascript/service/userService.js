function returnUserData(axiosResponse){
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  return fullResponse.data;
}

/*
* creates a user
* @param{object} field
* {
* 	username: "new user",
*	password: "new password"
* }
*/
function createUser(fields){
  return axios.post('/api/users', fields)
    .then(returnUserData) // on success (Status Code 200)
    .catch(function(axiosResponse){
    	// TODO: error output here
    	let data = returnUserData(axiosResponse);
    	console.log("user creation failed: ", data);
    }); // on failure (Other Status Code) 
}


/* 
* Signs in user
* @param{string} username 
*/
function signInUser(fields){
  return axios.post('/api/users/signIn', fields)
    .then(returnUserData) // on success (Status Code 200)
    .catch(function(axiosResponse){
    	// TODO: error output here
    	let data = returnUserData(axiosResponse);
    	console.log("user sign in failed: ", data);
    }); // on failure (Other Status Code) 
}