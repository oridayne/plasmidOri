// TODO: figure out response when it times out?
// returns the RID
function BlastAlign(query, subject){
	let url = "https://blast.ncbi.nlm.nih.gov/blast/BlastAlign.cgi?CMD=PUT&PROGRAM=blastn&QUERY="+query+"&SUBJECTS="+subject;
	return axios.post(url)
	.then(getRID)
	.catch(returnData);
}

let query = "AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";
let subject="AACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTCAACTGTATGCGGAAAAGGAGGCCAGTGCATCAGAGAGTCGCAAACAGCTGTGAAGTCGCGTTCTCAAGAATTTGCAGCAGGCTGTGGCCACTTCGCCGGAAAAGGAGGCCAGTGCATCAGAGAGCAAGATCACAGCTGTGAAGTCGCTTC";

function getBlastText(RID){
	console.log("getting Blast", RID);
	let url = "https://blast.ncbi.nlm.nih.gov/blast/BlastAlign.cgi?CMD=GET&RID="+RID+"&FORMAT_TYPE=Text";
	return axios.get(url)
	.then(returnData)
	.catch(returnFailed);
}

function getBlastXML(RID){
	console.log("getting Blast", RID);
	let url = "https://blast.ncbi.nlm.nih.gov/blast/BlastAlign.cgi?CMD=GET&RID="+RID+"&FORMAT_TYPE=XML";
	return axios.get(url)
	.then(returnData)
	.catch(returnFailed);
}

// getBlastText("5P6D5D2Y113");


function getRID(axiosResponse){
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  let html = fullResponse.data;
  var doc = new DOMParser().parseFromString(html, "text/html")
  let rid = doc.getElementById("rid").value;
  return rid;
}


function returnData(axiosResponse){
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
    // console.log("full response", fullResponse.data);
  return fullResponse.data;

}

function returnFailed(axiosResponse){
	 const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
    console.log("full response, failed");
  return fullResponse.data;
}

function parseBlastXML(xml){
	let parser = new DOMParser();
	let xmlDoc = parser.parseFromString(xml,"text/xml");
	console.log(xmlDoc.getElementsByTagName("Hsp"));
	return xmlDoc.getElementsByTagName("Hsp");
}

async function getHSPList(){
	let xml = await getBlastXML("5P6D5D2Y113");
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

function parseHspObj(hsp){
	let bucket = 60;
	let obj = {}
	obj["bitscore"] = hsp.getElementsByTagName("Hsp_bit-score")[0].innerHTML;
	obj.score =  hsp.getElementsByTagName("Hsp_score")[0].innerHTML;
	obj.expect = hsp.getElementsByTagName("Hsp_evalue")[0].innerHTML;
	obj.identities =  hsp.getElementsByTagName("Hsp_identity")[0].innerHTML;
	obj.gaps =  hsp.getElementsByTagName("Hsp_gaps")[0].innerHTML;
	obj.hpos =  hsp.getElementsByTagName("Hsp_positive")[0].innerHTML;
	obj.align =  hsp.getElementsByTagName("Hsp_align-len")[0].innerHTML;

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
	obj.leftIndices = [];
	obj.rightIndices = [];


	let qfromCounter = obj.qfrom;
	let hfromCounter = obj.hfrom;








	for(y=0;y<obj.qseq.length;y+=bucket){


		let qseq = obj.qseq.substring(y, y+bucket);
		let mid = obj.midline.substring(y, y+bucket);
		let hseq = obj.hseq.substring(y, y+bucket);
		obj.leftIndices.push([qfromCounter, hfromCounter]);

		// mismatched spaces in the query sequence do not count towards the counter
		console.log("qseq", qseq, qseq.replace("/-/g", ""))


		console.log("increment: ", qseq.length, qseq.replace("/-/g", "").length)
		let qincrement = qseq.replace(/-/g, "").length;
		let hincrement = hseq.replace(/-/g,"").length;
		// console.log("qfrom", qfromCounter, qincrement, qfromCounter+qincrement)
		qfromCounter+=qincrement;

		// reverse alignment match
		if(obj.hfrom>obj.hto){

			// rightHitIndex = obj.hfrom-y-qseq.length+1;
			hfromCounter-= hincrement;
			obj.rightIndices.push([qfromCounter-1, hfromCounter+1]);

		}
		else{
			// console.log("right hit index", rightHitIndex, obj.hto)
			hfromCounter+=hincrement;
			obj.rightIndices.push([qfromCounter-1, hfromCounter-1]);

		}
		// obj.rightIndices.push([qfromCounter-1, hfromCounter]);
		obj.seqs.push([qseq,mid,hseq]);


	}


	return obj;
}

async function showXML(){
	let xml = await getBlastXML("5P6D5D2Y113");
	let hspList = parseBlastXML(xml);
	let el = document.getElementById("blastWrapper");
	for(i=0;i<hspList.length;i++){
		let elt = parseHsp(hspList[i]);
		elt.id = "hsp"+i;
		// blastWrapper.append(elt);
	}
	// blastWrapper.append(parseHsp(hspList[0]));
}


// given HSP in html form, creat HTMl formatting to be put in
function parseHsp(hsp){
	// alignment scores
	let bitscore = hsp.getElementsByTagName("Hsp_bit-score")[0].innerHTML;
	let score =  hsp.getElementsByTagName("Hsp_score")[0].innerHTML;
	let expect = hsp.getElementsByTagName("Hsp_evalue")[0].innerHTML;
	let identities =  hsp.getElementsByTagName("Hsp_identity")[0].innerHTML;
	let gaps =  hsp.getElementsByTagName("Hsp_gaps")[0].innerHTML;
	let hpos =  hsp.getElementsByTagName("Hsp_positive")[0].innerHTML;
	let align =  hsp.getElementsByTagName("Hsp_align-len")[0].innerHTML;


	// base pair + alignment
	let qseq = hsp.getElementsByTagName("Hsp_qseq")[0].innerHTML;
	let midline = hsp.getElementsByTagName("Hsp_midline")[0].innerHTML;
	let hseq = hsp.getElementsByTagName("Hsp_hseq")[0].innerHTML;

	// indices
	let qfrom = hsp.getElementsByTagName("Hsp_query-from")[0].innerHTML;
	let qto = hsp.getElementsByTagName("Hsp_query-to")[0].innerHTML;
	let hfrom = hsp.getElementsByTagName("Hsp_hit-from")[0].innerHTML;
	let hto = hsp.getElementsByTagName("Hsp_hit-to")[0].innerHTML;

	// make header
	let header = document.createElement("div");
	header.innerHTML="Score = "+bitscore+" bits ("+score+"),  ";
	header.innerHTML+="Expect = "+expect+"<br>";
	header.innerHTML+="Identities = "+identities+"/"+align +"("+((identities/align)*100).toFixed(0)+"%), ";
	header.innerHTML+="Gaps = " + gaps+"/"+align+"<br>";
	let hspDiv = document.createElement("div");

	// formatting in html
	let wrapper = document.createElement("div");
	wrapper.className = "blastStyle";
	let leftIndiceWrapper = document.createElement("div");
	let rightIndiceWrapper = document.createElement("div");
	let rowWrapper = document.createElement("div");
	let bucket = 60;
	for(x=0;x<qseq.length;x+=bucket){
		let seg = document.createElement("div");
		
		// left indice
		let indice = document.createElement("div");
		indice.className="blastIndex"
		indice.innerHTML="Query  "+(parseInt(qfrom)+x)+"<br><br>Sbjct  "+(parseInt(hfrom)+x)+"<br><br>";
		leftIndiceWrapper.appendChild(indice);

		// right indice
		let rightSubIndice = document.createElement("div");
		rightSubIndice.className="blastIndex";
		rightSubIndice.innerHTML=(parseInt(qfrom)+x+bucket-1)+"<br><br>"+(parseInt(hfrom)+x+bucket-1)+"<br><br>";
		rightIndiceWrapper.appendChild(rightSubIndice);
		
		// middle parts 
		let qdiv = document.createElement("div");
		let hdiv = document.createElement("div");
		let middiv =  document.createElement("div");
		qdiv.innerHTML = qseq.substring(x,x+bucket);
		hdiv.innerHTML = hseq.substring(x,x+bucket);
		middiv.innerHTML = midline.substring(x,x+bucket);

		// assemble
		seg.appendChild(qdiv);
		seg.appendChild(middiv);
		seg.appendChild(hdiv);
		seg.appendChild(document.createElement("br"));
		rowWrapper.appendChild(seg);
	}

	hspDiv.className="blastHSP";
	hspDiv.appendChild(header);
	hspDiv.appendChild(wrapper);
	wrapper.appendChild(leftIndiceWrapper);
	wrapper.appendChild(rowWrapper);
	wrapper.appendChild(rightIndiceWrapper);
	return hspDiv;
	// document.getElementById("blastWrapper").appendChild(hspDiv);

}



showXML();
