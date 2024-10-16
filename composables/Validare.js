
export default function useValidare(){

    return {
        caNumar,
        caText,
        codfiscalValid,
        ibanValid,
		telefonValid,
		emailValid,
		client_unic,
		furnizor_unic,
		produs_unic,
		doarNumeric,
		serieDocValida,
		gestiune_unic
    }
} 

function client_unic(all,data){
   let rez='unic'
   all.map(p=>{
	if(p.codfiscal==data.codfiscal) rez='Clientul '+data.denumire+' cu acest cod fiscal este deja in baza de date!'
   })
   return rez;
}

function furnizor_unic(all,data){
	let rez='unic'
	all.map(p=>{
	 if(p.codfiscal==data.codfiscal) rez='Furnizorul '+data.denumire+' cu acest cod fiscal este deja in baza de date!'
	})
	return rez;
 }

 function produs_unic(all,data){
	let rez='unic'
	/*all.map(p=>{
	 if(p.denumire==data.denumire) rez='Produsul/serviciul '+data.denumire+' cu aceasta denumire este deja in baza de date!'
	})*/
	return rez;
 }

function gestiune_unic(all,data){
	let rez='unic'
	all.map(p=>{
	 if(p.denumire==data.denumire) rez='Gestiunea '+data.denumire+' exista deja in baza de date!'
	})
	return rez;
} 


function telefonValid(valoare){
	if(!valoare) return true
	return /^\d+$/.test(valoare)&&valoare.length==10&&valoare.substr(0,2)=="07"
}
function emailValid(valoare){
	if(!valoare) return true
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(valoare)
}

function caNumar(config){

}

function serieDocValida(valoare){
	if(!valoare) return true
    else
    return valoare.length==0||valoare.length<6;
}

function doarNumeric(valoare){
	if(!valoare) return true
	
	return /^\d+$/.test(valoare)
}
function caText(valoare){
 //   console.log("validare ca text",valoare)
    if(!valoare) return true
    else
    return valoare.length==0||valoare.length>2;
}

function validCNP( p_cnp ) {
    var i=0 , year=0 , hashResult=0 , cnp=[] , hashTable=[2,7,9,1,4,6,3,5,8,2,7,9];
    if( p_cnp.length !== 13 ) { return false; }
    for( i=0 ; i<13 ; i++ ) {
        cnp[i] = parseInt( p_cnp.charAt(i) , 10 );
        if( isNaN( cnp[i] ) ) { return false; }
        if( i < 12 ) { hashResult = hashResult + ( cnp[i] * hashTable[i] ); }
    }
    hashResult = hashResult % 11;
    if( hashResult === 10 ) { hashResult = 1; }
    year = (cnp[1]*10)+cnp[2];
    switch( cnp[0] ) {
        case 1  : case 2 : { year += 1900; } break;
        case 3  : case 4 : { year += 1800; } break;
        case 5  : case 6 : { year += 2000; } break;
        case 7  : case 8 : case 9 : { year += 2000; if( year > ( parseInt( new Date().getYear() , 10 ) - 14 ) ) { year -= 100; } } break;
        default : { return false; }
    }
    if( year < 1800 || year > 2099 ) { return false; }
    return ( cnp[12] === hashResult );
}

function codfiscalValid(v){
    if(!v) return true
    if ( (v.length<5 || v.length>10) && v.length!==13) return false;
	//cnp
	if(v.length==13){
      return validCNP(v);
	}


    var cifra_control=v.substr(v.length-1, 1);
    var cif=v.substr(0, v.length-1);
    while (cif.length!=9){
        cif='0'+cif;
    }
    var suma=parseInt(cif.charAt(0)) * 7 + parseInt(cif.charAt(1)) * 5 + parseInt(cif.charAt(2)) * 3 + parseInt(cif.charAt(3)) * 2 + parseInt(cif.charAt(4)) * 1 + parseInt(cif.charAt(5)) * 7 + parseInt(cif.charAt(6)) * 5 + parseInt(cif.charAt(7)) * 3 + parseInt(cif.charAt(8)) * 2;

    suma=suma*10;
    var rest=suma%11;
    if ( rest==10 ) rest=0;

    if (rest==cifra_control) return true;
    else return false;
}

function ibanValid(v){
    if(!v) return true
    if(v.length==24){
        var partial=v.substr(4,40)+v.substr(0,4);
        var tab={};
        tab['A']='10';
        tab['B']='11';
        tab['C']='12';
        tab['D']='13';
        tab['E']='14';
        tab['F']='15';
        tab['G']='16';
        tab['H']='17';
        tab['I']='18';
        tab['J']='19';
        tab['K']='20';
        tab['L']='21';
        tab['M']='22';
        tab['N']='23';
        tab['O']='24';
        tab['P']='25';
        tab['Q']='26';
        tab['R']='27';
        tab['S']='28';
        tab['T']='29';
        tab['U']='30';
        tab['V']='31';
        tab['W']='32';
        tab['X']='33';
        tab['Y']='34';
        tab['Z']='35';
        
        for (var key in tab) {
        for(var i=0;i<10;i++){
        partial=partial.replace(key,tab[key]);
        }
        }
        function smod(ss) {
            var parts = Math.ceil(ss.length/7);
            var remainer = "";
            for (var i = 1; i <= parts; i++) {
                remainer = String(parseFloat(remainer+ss.substr((i-1)*7, 7))%97); }
            return remainer; }
        if(smod(partial)=='1')
    return true;
    else
    return false;
    }
    else{
    if(v.length>0)
    return false;
    else
    return true;
}
}
/*

	 base64_encode :function(data) {

  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = "",
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

},
	stJudete:function(){
		
		if(!Ext.ClassManager.isCreated('Judet') ){

		Ext.define('Judet', {
		extend: 'Ext.data.Model',
		fields: [
        {type: 'string', name: 'judet'}
        
		]
		});

	}
		var judete = [{"judet":"ALBA"},
					{"judet":"ARAD"},
					{"judet":"ARGES"},
					{"judet":"BACAU"},
					{"judet":"BIHOR"},
					{"judet":"BISTRITA-NASAUD"},
					{"judet":"BOTOSANI"},
					{"judet":"BRAILA"},
					{"judet":"BRASOV"},
					{"judet":"BUZAU"},
					{"judet":"CALARASI"},
					{"judet":"CARAS-SEVERIN"},
					{"judet":"CLUJ"},
					{"judet":"CONSTANTA"},
					{"judet":"COVASNA"},
					{"judet":"DIMBOVITA"},
					{"judet":"DOLJ"},
					{"judet":"GALATI"},
					{"judet":"GIURGIU"},
					{"judet":"GORJ"},
					{"judet":"HARGHITA"},
					{"judet":"HUNEDOARA"},
					{"judet":"IALOMITA"},
					{"judet":"IASI"},
					{"judet":"ILFOV"},
					{"judet":"MARAMURES"},
					{"judet":"MEHEDINTI"},
					{"judet":"MURES"},
					{"judet":"NEAMT"},
					{"judet":"OLT"},
					{"judet":"PRAHOVA"},
					{"judet":"SALAJ"},
					{"judet":"SATU MARE"},
					{"judet":"SIBIU"},
					{"judet":"SUCEAVA"},
					{"judet":"TELEORMAN"},
					{"judet":"TIMIS"},
					{"judet":"TULCEA"},
					{"judet":"VASLUI"},
					{"judet":"VILCEA"},
					{"judet":"VRANCEA"}];

		var js=Ext.create('Ext.data.Store', {
				autoDestroy: true,
				model: 'Judet',
				data: judete
		});
		return js;
	},
	verificaIban:function(v){
	if(v.length==24){
			var partial=v.substr(4,40)+v.substr(0,4);
			var tab={};
			tab['A']='10';
			tab['B']='11';
			tab['C']='12';
			tab['D']='13';
			tab['E']='14';
			tab['F']='15';
			tab['G']='16';
			tab['H']='17';
			tab['I']='18';
			tab['J']='19';
			tab['K']='20';
			tab['L']='21';
			tab['M']='22';
			tab['N']='23';
			tab['O']='24';
			tab['P']='25';
			tab['Q']='26';
			tab['R']='27';
			tab['S']='28';
			tab['T']='29';
			tab['U']='30';
			tab['V']='31';
			tab['W']='32';
			tab['X']='33';
			tab['Y']='34';
			tab['Z']='35';
			
			for (var key in tab) {
			for(var i=0;i<10;i++){
			partial=partial.replace(key,tab[key]);
			}
			}
			function smod(ss) {
				var parts = Math.ceil(ss.length/7);
				var remainer = "";
				for (var i = 1; i <= parts; i++) {
					remainer = String(parseFloat(remainer+ss.substr((i-1)*7, 7))%97); }
				return remainer; }
			if(smod(partial)=='1')
		return true;
		else
		return 'Cont IBAN invalid!';
		}
		else{
		if(v.length>0)
		return 'Contul acesta nu are 24 de caractere!';
		else
		return true;
	}
	
	
	
	},
	numeBanca:function(cod){
		var banci=[{cod:'ABNA' ,	denumire : 'RBS BANK ROMANIA' },	
		{cod:'ARBL' ,	denumire : 'ANGLO ROMANIAN BANK' },	
		{cod:'BCUN' ,	denumire : 'NOVA BANK SA' 	},
		{cod:'BCYP' ,	denumire : 'BANK OF CYPRUS ROMANIA'}, 	
		{cod:'BITR' ,	denumire : 'BANCA ITALO ROMENA' 	},
		{cod:'BLOM' ,	denumire : 'BLOM BANK FRANCE S.A. PARIS SUC ROMANIA' },	
		{cod:'BPOS' ,	denumire : 'BANC POST SA' },	
		{cod:'BRDE' ,	denumire : 'BANCA ROMANA PENTRU DEZVOLTARE' }, 	
		{cod:'BREL' ,	denumire : 'LIBRA BANK S.A.' },	
		{cod:'BRMA' ,	denumire : 'BANCA ROMANEASCA' },	
		{cod:'BSEA' ,	denumire : 'EMPORIKI BANK ROMANIA S.A.'}, 	
		{cod:'BTRL' ,	denumire : 'BANCA TRANSILVANIA' 	},
		{cod:'BUCU' ,	denumire : 'ALPHA BANK' 	},
		{cod:'CAIX' ,	denumire : 'CAJA DE AHORROS Y PENSIONES BARCELONA' },	
		{cod:'CARP' ,	denumire : 'BANCA COMERCIALA CARPATICA' 	},
		{cod:'CECE' ,	denumire : 'CEC BANK S.A.' 	},
		{cod:'CITI' ,	denumire : 'CITIBANK ROMANIA' },	
		{cod:'CRCO' ,	denumire : 'BANCA CENTRALA COOPERATISTA CREDITCOOP' },	
		{cod:'CRDZ' ,	denumire : 'MKB ROMEXTERRA SA' },	
		{cod:'DABA' ,	denumire : 'Danske Bank Copenhagen' },	
		{cod:'DAFB' ,	denumire : 'BANK LEUMI ROMANIA S.A.' },	
		{cod:'DARO' ,	denumire : 'BANCA C.R. FIRENZE ROMANIA' },	
		{cod:'DPFA' ,	denumire : 'DEPFA BANK PLC DUBLIN SUC BUCURESTI'}, 	
		{cod:'EGNA' ,	denumire : 'MARFIN BANK ROMANIA S.A.' },	
		{cod:'ETHN' ,	denumire : 'NATIONAL BANK OF GREECE' },	
		{cod:'EXIM' ,	denumire : 'EXIMBANK' 	},
		{cod:'FNNB' ,	denumire : 'CREDIT EUROPE BANK ROMANIA S.A.' 	},
		{cod:'FRBU' ,	denumire : 'FRANKFURT BUCHAREST BANK' 	},
		{cod:'FTSB' ,	denumire : 'FORTIS BANK SA NV BRUXELLES SUC BUCUREST' },	
		{cod:'HVBL' ,	denumire : 'HVB BANCA PENTRU LOCUINTE' 	},
		{cod:'INGB' ,	denumire : 'ING BANK ROMANIA' 	},
		{cod:'MILB' ,	denumire : 'BANCA MILLENIUM S.A.' 	},
		{cod:'MIND' ,	denumire : 'ATE BANK ROMANIA S.A.' },	
		{cod:'MIRO' ,	denumire : 'PROCREDIT BANK' 	},
		{cod:'NBOR' ,	denumire : 'BANCA NATIONALA A ROMANIEI' },	
		{cod:'OTPV' ,	denumire : 'OTP BANK ROMANIA S.A.' 	},
		{cod:'PIRB' ,	denumire : 'PIRAEUS BANK ROMANIA' },	
		{cod:'PORL' ,	denumire : 'PORSCHE BANK'},
		{cod:'RNCB' ,	denumire : 'BANCA COMERCIALA ROMANA' 	},
		{cod:'ROIN' ,	denumire : 'ROMANIAN INTERNATIONAL BANK' },	
		{cod:'RZBL' ,	denumire : 'RAIFFEISEN BANCA PT LOCUINTE' 	},
		{cod:'RZBR' ,	denumire : 'RAIFFEISEN BANK ROMANIA S.A.' },	
		{cod:'TRFD' ,	denumire : 'TRANSFOND SA 	TRFDROBU'},
		{cod:'UGBI' ,	denumire : 'GARANTIBANK INTERNATIONAL NV' 	},
		{cod:'VBBU' ,	denumire : 'VOLKSBANK ROMANIA' 	},
		{cod:'WBAN' ,	denumire : 'BANCA COMERCIALA INTESA SANPAOLO ROMANIA' 	},
		{cod:'BCRL' ,	denumire : 'BCR BANCA PENTRU LOCUINTE S.A.' },	
		{cod:'TREZ' ,	denumire : 'TREZORERIA STATULUI' 	},
		{cod:'BACX' ,	denumire : 'UNICREDIT TIRIAC BANK' 	}];
	
		for(var i=0;i<banci.length;i++){
			if(banci[i].cod==cod)
			return banci[i].denumire;
		}
	return cod;
	}

*/ 