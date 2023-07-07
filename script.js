// first fetching required elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");


//set passwordLength
// ye password length ko ui pr reflect krwata hai
// ye ui ko update krta hai using passwordlength ki value
function handleSlider() {
    // starting me slider 10 pr rhe
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    // taki vo pink color sirf min aur max ke bich me hi aaya
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// ye function indicator me input parameter wala color set krwata hai
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Math.random gives no.between [0,1)
// floor round off it to integer
// this gives random integer between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

// string.fromCharCode converts it to char
function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    // .checked checks if it is checked or not
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// copying to clipboard
async function copyContent() {
    try {
        // navigator.clipboard.writeText wala method clipboard pr kuch copy krta hai
        // ye method ek promise return krta hai
        // & if it is fulfilled then copied text dikhaya jayega
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    // aur active class me hm opacity ko 1 ya 0 kr denge
    copyMsg.classList.add("active");
    
    // 2 sec ke baad isme se active class ko remove kr denge
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

// shuffling password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        // range is [0->i+1) & is in integer
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    // now adding array of password in a string
    array.forEach((el) => (str += el));
    return str;
}

// kisi bhi checkbox ko main tick karu ya untick karu vo dobara se total box jo checked hai usko count krega 
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        // jb bhi password ki length me change hoga then we call handleslider function
        passwordLength = checkCount;
        handleSlider();
    }
}

// saare checkbox me mujhe event listener lgana hai
allCheckBox.forEach( (checkbox) => {
    // jb bhi checkbox change hoga then call handlecheckboxchange function
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// isse slider ko idher udhar krne se value bhi change hogi password length ki
inputSlider.addEventListener('input', (e) => {
    // e yahan pr slider ko dikha rha hai
    passwordLength = e.target.value;
    // since passwordLength will update so we called handleSlider
    handleSlider();
})

// tab hi copy kro jb password me kuch value ho -> uski length 0 na ho
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    // special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition i.e jo jo tick kiya hua hai vo toh hona hi chahiye
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    // yahan pr hamara password ready hai, bs shuffled nhi hai
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});