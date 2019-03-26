// takes parsed enzyme prototype files and loads them into enzyme database
const readline = require('readline');
const fs = require('fs');
const Prototypes = require('../models/Prototypes');


// loads all prototypes from a file into the prototype database
function loadProto(filename, type){
	let rl = readline.createInterface({
	    input: fs.createReadStream(filename)
	});

	let line_no = 0;
	let line_list = [];
	// event is emitted after each line
	rl.on('line', function(line) {
	    line_no++;
	    let name = line.substring(0,line.indexOf(" "));
	    let sequence = line.substring(line.indexOf(" ")).trim();
	    let plainSeq = sequence.replace(/[^A-Z]+/g,"");
	    Prototypes.findOnePrototype(name).then((response)=>{
	    	if(response.length==0){
			   	Prototypes.addOnePrototype(name, sequence, plainSeq, type).then((response)=>{
	   				console.log("added ", name, sequence, plainSeq, type);
	   			});
	    	}

	    })
	});
	// end
	rl.on('close', function(line) {
	    console.log('Total lines : ' + line_no);
	});
}

function showAllPrototypes(){	
	Prototypes.findAllPrototypes().then((response)=>{
		console.log("all protos", response);
	})
}

// loadProto('enzymes/proto_type3.txt', 3);