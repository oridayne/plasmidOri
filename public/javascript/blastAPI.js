// TODO: figure out response when it times out, if it doesn't work
// returns the RID

/*
* Given a query and subject nucleotide sequence - input a blast job. Returns RID if applicatble
* @param{string} query - query string 
* @param{string} subject - string to compare to
* @return{string|(to be determined?) returns RID upon success
*/
function BlastAlign(query, subject){
	let url = "https://blast.ncbi.nlm.nih.gov/blast/BlastAlign.cgi?CMD=PUT&PROGRAM=blastn&QUERY="+query+"&SUBJECTS="+subject;
	return axios.post(url)
	.then(getRID)
	.catch(returnData);
}

let query = "AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
let subject="AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";


// TODO: figure out what happens if job doesn't exist/is still going
/*
* Given a RID, return the job status or job results
* @param{string} RID - request ID
* @return{string} returns text response
*/
function getBlastText(RID){
	console.log("getting Blast", RID);
	let url = "https://blast.ncbi.nlm.nih.gov/blast/BlastAlign.cgi?CMD=GET&RID="+RID+"&FORMAT_TYPE=Text";
	return axios.get(url)
	.then(returnData)
	.catch(returnFailed);
}

// TODO: figure out what happens if job doesn't exist/is still going
/*
* Given a RID, return the job status or job results
* @param{string} RID - request ID
* @return{string} returns XML response
*/
function getBlastXML(RID){
	console.log("getting Blast", RID);
	let url = "https://blast.ncbi.nlm.nih.gov/blast/BlastAlign.cgi?CMD=GET&RID="+RID+"&FORMAT_TYPE=XML";
	return axios.get(url)
	.then(returnData)
	.catch(returnFailed);
}



// TODO: what if RID is not there?
/*
* Given a the axios response of Blast Align - return the RID
* @param{object} axios response 
* @return{string} the rid
*/
function getRID(axiosResponse){
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  let html = fullResponse.data;
  var doc = new DOMParser().parseFromString(html, "text/html")
  let rid = doc.getElementById("rid").value;
  return rid;
}

// success response parser of axios calls
function returnData(axiosResponse){
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  return fullResponse.data;

}
// failed response parser of axios calls
function returnFailed(axiosResponse){
	 const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
    console.log("full response, failed", fullResponse.data);
  return fullResponse.data;
}

/*
* Given the xml response of getBlastXML, parse into html and return tags
* of with the name Hsp
* @param{xml} axios response 
* @return{[<Hsp>]} list of hsp tags
*/
function parseBlastXML(xml){
	let parser = new DOMParser();
	let xmlDoc = parser.parseFromString(xml,"text/xml");
	console.log(xmlDoc.getElementsByTagName("Hsp"));
	return xmlDoc.getElementsByTagName("Hsp");
}

// debugging function
// TODO: work this in such that it takes xml response, and gets HSP List
async function getHSPList(RID){
	let xml = await getBlastXML(RID);
	let hspList = parseBlastXML(xml);
	let el = document.getElementById("blastWrapper");
	let hspObjs = [];
	console.log("num objects", hspList.length)
	for (x=0;x<hspList.length;x++){
		hspObjs.push(parseHspObj(hspList[x]));
	}
	console.log("made it", hspObjs);
	return hspObjs;
}

/*
* Given html version of an HSP object, parse into a dictionary
* @param{html} html version of a Hsp xml tag
* @return{obj} object version of it
*/
function parseHspObj(hsp){
	let bucket = 60;
	let obj = {}
	obj.num = hsp.getElementsByTagName("Hsp_num")[0].innerHTML;
	obj["bitscore"] = hsp.getElementsByTagName("Hsp_bit-score")[0].innerHTML;
	obj.score =  hsp.getElementsByTagName("Hsp_score")[0].innerHTML;
	obj.expect = hsp.getElementsByTagName("Hsp_evalue")[0].innerHTML;
	obj.identities =  hsp.getElementsByTagName("Hsp_identity")[0].innerHTML;
	obj.gaps =  hsp.getElementsByTagName("Hsp_gaps")[0].innerHTML;
	obj.hpos =  hsp.getElementsByTagName("Hsp_positive")[0].innerHTML;
	obj.align =  hsp.getElementsByTagName("Hsp_align-len")[0].innerHTML;
	obj.strand = obj.hfrom<obj.hto ? "Plus/Plus" : "Plus/Minus"

	// base pair + alignment
	obj.qseq = hsp.getElementsByTagName("Hsp_qseq")[0].innerHTML;
	obj.midline = hsp.getElementsByTagName("Hsp_midline")[0].innerHTML;
	obj.hseq = hsp.getElementsByTagName("Hsp_hseq")[0].innerHTML;
	obj.seqs =[];

	// indices
	obj.qfrom = parseInt(hsp.getElementsByTagName("Hsp_query-from")[0].innerHTML);
	obj.qto = parseInt(hsp.getElementsByTagName("Hsp_query-to")[0].innerHTML)
	obj.hfrom = parseInt(hsp.getElementsByTagName("Hsp_hit-from")[0].innerHTML);
	obj.hto = parseInt(hsp.getElementsByTagName("Hsp_hit-to")[0].innerHTML);


	// the blast API match index starts at 0, wheras in programming strings start at 1
	// i will convert this to programming convention
	obj.qfrom-=1;
	obj.qto-=1;
	obj.hfrom-=1;
	obj.hto-=1;

	// indices where query string does not match subject string 
	obj.indexmismatch = [];
	//if matches complementary string, this is true
	obj.minus = obj.hfrom>obj.hto;
	obj.leftIndices = [];
	obj.rightIndices = [];

	// keep track of query and subject counters
	let qfromCounter = obj.qfrom;
	let hfromCounter = obj.hfrom;


	for(y=0;y<obj.qseq.length;y+=bucket){

		let qseq = obj.qseq.substring(y, y+bucket);
		let mid = obj.midline.substring(y, y+bucket);
		let hseq = obj.hseq.substring(y, y+bucket);
		
		// hseq extension
		


		// basepair mismatch detection
		let qincTemp = qfromCounter;
		let hincTemp = hfromCounter;

		// do we inc or dec the hit counter, depending on pos or neg strand match
		let hinc = obj.minus ? -1 : 1;
		for(bp = y;bp<y+bucket;bp++){
			let curIndex = bp;
			if(obj.qseq[curIndex]=="-"){continue;}
			// if(obj.qseq[curIndex]!=obj.)

		}

		obj.leftIndices.push([qfromCounter, hfromCounter]);

		// mismatched spaces in the query sequence do not count towards the counter
		// these are represented by a '-' in the blast API return format
		let qincrement = qseq.replace(/-/g, "").length;
		let hincrement = hseq.replace(/-/g,"").length;
		// console.log("qfrom", qfromCounter, qincrement, qfromCounter+qincrement)
		qfromCounter+=qincrement;
		// reverse alignment match
		if(obj.minus){
			hfromCounter-= hincrement;
			obj.rightIndices.push([qfromCounter-1, hfromCounter+1]);
		}
		else{
			hfromCounter+=hincrement;
			obj.rightIndices.push([qfromCounter-1, hfromCounter-1]);
		}
		obj.seqs.push([qseq,mid,hseq]);



	}
	return obj;
}

