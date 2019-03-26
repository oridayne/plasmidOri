function showProtoypeResponse(axiosResponse) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
}

function returnPrototypeData(axiosResponse){
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  return fullResponse.data;
}

function getAllPrototypes(){
  return axios.get('/api/prototypes')
  .then(returnPrototypeData) // on success (Status Code 200)
  .catch(function(axiosResponse){
    console.log("getting prototypes failed ");
    returnPrototypeData(axiosResponse);
  }); // on failure (Other Status Code) 
}