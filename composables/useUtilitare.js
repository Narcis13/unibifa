export default function useUtilitare(){
    return {
       stripNulls,
       camelCase
    }
    }
    
    function stripNulls(obj){
       let rez = {}
       Object.keys(obj).map(k=>{
        if(obj[k]&&k!=='id'){
            rez[k]=obj[k]
        }
       })
       return rez;
    }
    
    function camelCase(str) {
    
       return str.charAt(0).toUpperCase() + str.slice(1)
    
    }
    