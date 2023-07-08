window.onload = function() {
    createStartButton();
}

function createStartButton() {
    const container = document.getElementById("container");
    const button = document.createElement("button");
    button.id = "startButton";
    button.innerText = "Commencer une nouvelle soumission";
    button.addEventListener("click", startSubmission);
    container.appendChild(button);
}

function startSubmission() {
    const startButton = document.getElementById("startButton");
    startButton.style.display = "none"; 
    document.getElementById("insuranceForm").reset(); // reset the form
    hideAllFormSections();
    document.getElementById("formContainer").style.display = "block";
    document.getElementById("result").style.display = "none";
}

function hideAllFormSections() {
    const sections = document.getElementsByClassName("formSection");
    for(let i = 0; i < sections.length; i++){
        sections[i].style.display = "none";
    }
}


document.getElementById("insuranceForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    if (validateHighRiskCases()) {
        submitForm();
    } else {
        endSubmission("Désolé, nous n'avons aucun produit à offrir pour ce profil de client.");
    }
});

function validateHighRiskCases() {
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const carValue = document.getElementById("carValue").value;
    const carYear = document.getElementById("carYear").value;
    const currentYear = new Date().getFullYear();
    const claimsNumber = document.getElementById("claimsNumber").value;
    const totalClaimAmount = calculateTotalClaimAmount();

    // Check high risk conditions
    if ((gender=== "femme" && age < 16) || 
        (gender === "homme" && age < 18) || 
        (gender === "non-binaire" && age < 18) ||
        (age >= 100) ||
        (carValue > 100000) ||
        (currentYear - carYear > 25) ||
        (claimsNumber > 4) ||
        (totalClaimAmount > 35000)) {
        return true;
    }

    return false;
}

function calculateTotalClaimAmount() {
    const hasClaims = document.getElementById("hasClaims").value;
    let totalClaimAmount = 0;

    if (hasClaims === "oui") {
        const claimsNumber = document.getElementById("claimsNumber").value;

        for (let i = 1; i <= claimsNumber; i++) {
            totalClaimAmount += parseFloat(document.getElementById(`claimAmount${i}`).value);
        }
    }

    return totalClaimAmount;
}

function endSubmission(message) {
    document.getElementById("result").innerText = message;
    document.getElementById("formContainer").style.display = "none";
    document.getElementById("result").style.display = "block";
    const startButton = document.getElementById("startButton");
    startButton.style.display = "block";
}


function validateNonNegative(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    if (input.value === "" ||isNaN(value)) {
        input.setCustomValidity("Veuillez entrer un nombre.");
        input.reportValidity();
        return false;
    } else if (value < 0) {
        input.setCustomValidity(errorMessage);
        input.reportValidity();
        return false;
    } else {
        input.setCustomValidity(''); // Clear the error message
        return true;
    }
}

document.getElementById("gender").addEventListener("change", function() {
    document.getElementById("ageDiv").style.display = "block";
});

document.getElementById("age").addEventListener("change", function() {
    if (validateNonNegative("age", "L'âge doit être supérieur à zéro.")) {
        document.getElementById("carValueDiv").style.display = "block";
    }
});

document.getElementById("carValue").addEventListener("change", function() {
    if (validateNonNegative("carValue", "La valeur d'achat du véhicule doit être supérieure ou égale à zéro.")) {
        document.getElementById("carYearDiv").style.display = "block";
    }
});

document.getElementById("carYear").addEventListener("change", function() {
    if (validateNonNegative("carYear", "L'année de fabrication du véhicule doit être supérieure à zéro.")) {
        document.getElementById("claimsDiv").style.display = "block";
    }
});

document.getElementById("hasClaims").addEventListener("change", function() {
    if (document.getElementById("hasClaims").value === "oui") {
        document.getElementById("claimsNumberDiv").style.display = "block";
    } 
});

document.getElementById("claimsNumber").addEventListener("change", function() {
    if (validateNonNegative("claimsNumber", "Le nombre de réclamations doit être supérieur ou égal à zéro.")) {
        const claimsNumber = document.getElementById("claimsNumber").value;
        const claimsAmountDiv = document.getElementById("claimsAmountDiv");
        claimsAmountDiv.innerHTML = "";  // Clear any previous claim amount inputs
        for (let i = 1; i <= claimsNumber; i++) {
            const newDiv = document.createElement("div");
            newDiv.innerHTML = `
                <label for="claimAmount${i}">Pour la réclamation #${i}, quel montant avez-vous réclamé?</label>
                <input type="number" id="claimAmount${i}" required>
            `;
            claimsAmountDiv.appendChild(newDiv);
            document.getElementById(`claimAmount${i}`).addEventListener("change", function() {
                validateNonNegative(`claimAmount${i}`, 'Le montant de la réclamation doit être supérieur ou égal à zéro.');
            });
        }
        document.getElementById("claimsAmountDiv").style.display = "block";
        document.querySelector("button[type='submit']").style.display = "block";
    }
});

document.getElementById("insuranceForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    submitForm();
});

function submitForm() {
    const hasClaims = document.getElementById("hasClaims").value;
    if(validateHighRiskCases()){
        endSubmission("Désolé, nous n'avons aucun produit à offrir pour ce profil de client.");
    }else{
        const {annualInsurance, monthlyInsurance} = calculateQuote();
        document.getElementById("result").innerText = `Le montant annuel de la soumission est de $${annualInsurance.toFixed(2)} et le montant mensuel est de $${monthlyInsurance.toFixed(2)}`;
        document.getElementById("formContainer").style.display = "none";
        document.getElementById("result").style.display = "block";
        const startButton = document.getElementById("startButton");
        startButton.style.display = "block";
    }
}

function calculateQuote() {
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const carValue = document.getElementById("carValue").value;
    const claimsNumber = document.getElementById("claimsNumber").value;
    const totalClaimAmount = calculateTotalClaimAmount();

    let baseAmount;
    
    // Defining base amount based on gender, age and car value
    if ((gender === "homme" || gender === "non-binaire") && age < 25) {
        baseAmount = 0.05 * carValue;
    } else if (age >= 75) {
        baseAmount = 0.04 * carValue;
    } else {
        baseAmount = 0.02 * carValue;
    }
    
    // Calculation of annual insurance
    let annualInsurance = baseAmount + (350 * claimsNumber);
    if (totalClaimAmount > 25000) {
        annualInsurance += 500;
    }

    // Calculate monthly amount
    let monthlyInsurance = annualInsurance / 12;

    return {annualInsurance, monthlyInsurance};
}


