
function sortAr(a){
  let result = a.sort((a,b) => a-b);
  console.log(result);
 return result;
}

      try {
        console.log("-||"+sortAr([5,3,4])+ "||-");
        console.log("%")
      }
      catch(e) { 
        console.log(e);
      }