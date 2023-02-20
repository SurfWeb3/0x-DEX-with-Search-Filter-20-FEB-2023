//THIS WAS THE ORIGINAL SEARCH FUNCTION FOR THE DEX
//var searchToken = () => {
//    var searchIn = document.getElementById("searchInput");
//    var filter = searchIn.value.toUpperCase();
//    var parentEle = document.getElementById("token_list");
//    var tokenEle = parentEle.getElementsByTagName("span");
//    for (let i = 0; i < tokenEle.length; i++) {
//        tokenSym = tokenEle[i].textContent || tokenEle[i].innerText;
//        if(tokenSym.toUpperCase().indexOf(filter) > -1) {
//            tokenEle[i].parentElement.style.display = "";
//        } else {
//            tokenEle[i].parentElement.style.display = "none";
//        }
//    }
//}

//THIS HAS ALPHABETIC FILTER
var searchToken = () => {
    var searchIn = document.getElementById("searchInput");
    var filter = searchIn.value.toUpperCase();
    var parentEle = document.getElementById("token_list");
    var tokenEle = parentEle.getElementsByTagName("span");
    for (let i = 0; i < tokenEle.length; i++) {
        tokenSym = tokenEle[i].textContent || tokenEle[i].innerText;
        if(tokenSym.toUpperCase().startsWith(filter)) {
            tokenEle[i].parentElement.style.display = "";
        } else {
            tokenEle[i].parentElement.style.display = "none";
        }
    }
}




//THIS HAS UPDATE IN TO-TOKEN-AMOUNT
var searchTokenAmountUpdate = () => {
    var searchIn = document.getElementById("searchInput");
    var filter = searchIn.value.toUpperCase();
    var parentEle = document.getElementById("token_list");
    var tokenEle = parentEle.getElementsByTagName("span");
    for (let i = 0; i < tokenEle.length; i++) {
        tokenSym = tokenEle[i].textContent || tokenEle[i].innerText;
        if(tokenSym.toUpperCase().indexOf(filter) > -1) {
            tokenEle[i].parentElement.style.display = "";
        } else {
            tokenEle[i].parentElement.style.display = "none";
        }
    }
}




document.getElementById("searchInput").onkeyup = searchToken;
