import {luhnCheck} from "./helper.js";

function validateCard(number, doExtraCheck) {
    const vervePattern = /^(5060|5061|5078|5079|6500)[0-9]{12,15}$/;
    let isValidVerveCard = false;
    if (vervePattern.test(number)) {
        isValidVerveCard = true;
    }
    if(doExtraCheck) {
        isValidVerveCard = luhnCheck(number);
    }

    return isValidVerveCard ? "Verve card is valid" : "Invalid card number";
}

console.log(validateCard(506112345678234567, true))

