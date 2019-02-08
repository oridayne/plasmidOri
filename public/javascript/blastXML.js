function parseBlastXML(xml){
	let parser = new DOMParser();
	let xmlDoc = parser.parseFromString(text,"text/xml");
	console.log(xmlDoc.getElementsByTagName("Hsp"));
}