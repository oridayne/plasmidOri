function toBoros(){
	location.href = "/boros";
}

function toHome(){
	location.href = "/";
}

async function newBlankPlasmid(){

	let fields = {sequence:"", plasmidName: null, interval:30, minLength:0, annotations:"[]"};
	let newPlas = await createPlasmid(fields);
	console.log(newPlas);
	location.href="/";

}
