function toBoros(){
	location.href = "/boros";
}

function toHome(){
	location.href = "/";
}

async function newBlankPlasmid(){
	let fields = {sequence:"", plasmidName: null, interval:30, minLength:0, annotations:"[]", annotationData:"{}"};
	let newPlas = await createPlasmid(fields);
	location.href="/";
}
