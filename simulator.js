panel = "The Mythical Machine\n" + 
        "P reg  000000       I reg 000000\n"+
        "reg 0  000000       reg 5 000000\n"+
        "reg 1  000000       reg 6 000000\n"+
        "reg 2  000000       reg 7 000000\n"+
        "reg 3  000000       reg 8 000000\n"+
        "reg 4  000000       reg 9 000000\n";

var loc = [];
	loc['pReg']  = [3,15];
	loc['iReg'] = [3,34];

var mem=new Array(1000);
var reg = new Array(10);

for(var i = 0; i < 5; ++i)
	loc["r"+i] = [5+i, 15];

for(var i = 5; i < 9; ++i)
	loc["r"+i] = [0+i, 34];

var confirm_1 = 1;

function updatePanel(r, value)
{
	x = loc[r][0];
	y = loc[r][1];
    console.log("r",r," : ",value);
}

function pause (msg) {
    if(!confirm_1) return;
    var ans = "z";
    if(['a','A'].indexOf(ans[0]) > -1)
	confirm_1=0;
}

function cycle () {
    pause ("About to Retrieve Instruction: ");
    iReg = mem[pReg]; updatePanel('iReg', iReg);

    pause ("About to Execute Instruction: ")
    pReg = pReg + 1 ; updatePanel('pReg', pReg);
    opcode = Math.floor(iReg/10000) ;
    r      = Math.floor(iReg/1000) % 10;
    addr   = (iReg) % 1000;
    if(opcode == 0)
	return 0;
    else if(opcode == 1 ) reg[r]=mem[addr];          // load register
    else if(opcode == 2)  mem[addr]=reg[r] ;         // store register
    else if (opcode == 3 ) reg[r]=addr         ;      // load register immediate
    else if (opcode == 4 ) reg[r]=mem[reg[addr]] ;    // load register indexed
    else if (opcode == 5 ) reg[r]=reg[r]+reg[addr];   // add register
    else if (opcode == 6 ) reg[r]=reg[r]-reg[addr] ;  // sub register
    else if (opcode == 7 ) reg[r]=reg[r]*reg[addr]  ; // mul register
    else if (opcode == 8 ) reg[r]=Math.floor(reg[r]/reg[addr])  ; // div register
    else if (opcode ==10 ){
        pReg=addr; updatePanel('pReg',pReg);      // jump unconditionally
	}
    else if (opcode == 11 ){
        if (reg[r]==0 ){
            pReg=addr; updatePanel('pReg',pReg) ; // jump if register zero
		}
	}
    updatePanel("r" + r, reg[r]) ;              // the register affected
    return 1;
}

function loadProgram (file) {
    var arr=[[100,"031012"],[101,"032013"],[102,"051002"],[103,"000000"]];
    for( var i in arr){
        lin = arr[i];
            var address = lin[0];
            var instruc = parseInt(lin[1],10);
            mem[address] = instruc;
	}
}

function main () {
	loadProgram("asd");
    console.log(panel);
    pReg = 100;
    updatePanel('pReg', pReg);
    while (1 )
        if (!cycle() ) break;
    console.log("end");  // Get low on the screen and exit);
}

main();
