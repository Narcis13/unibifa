export default function useSincronizare(){
    return {
       banca
    }
}

function banca(v){
 //  console.log("sincronizare cu banca",v.iban)
   if(v.iban&&v.iban.length>7){
    let cod=v.iban.substr(4,4);
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
    return null
   }
   else
   return null

       
}