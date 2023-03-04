"use strict";

let buildingType_select = document.getElementById("building-type");
let buildingType =
    buildingType_select.options[buildingType_select.selectedIndex].value;
let estimateNumElv_div = document.querySelector(".estimate-num-elv");
let numApt_input = document
    .getElementById("number-of-apartments")
    .querySelector("input");
let numFloors_input = document
    .getElementById("number-of-floors")
    .querySelector("input");
let numBasements_input = document
    .getElementById("number-of-basements")
    .querySelector("input");
let numElevators_input = document
    .getElementById("number-of-elevators")
    .querySelector("input");
let maxOcc_input = document
    .getElementById("maximum-occupancy")
    .querySelector("input");
let displayCalcElv_input = document
    .getElementById("elevator-amount")
    .querySelector("input");

let productLineSelection_div = document.querySelector(".product-line");
let radioBtns_div = document.querySelector(".radio-btns");
let warning_p = document.getElementById("warning");

let finalPricingDisplay_div = document.querySelector(".final-pricing-display");
let displayUnitPrice_input = document
    .getElementById("elevator-unit-price")
    .querySelector("input");
let displayElvTotalPrice_input = document
    .getElementById("elevator-total-price")
    .querySelector("input");
let displayInstallFee_input = document
    .getElementById("installation-fees")
    .querySelector("input");
let displayEstTotalCost_input = document
    .getElementById("final-price")
    .querySelector("input");

let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
const buildingTypeFields = {
    residential: [
        "number-of-apartments",
        "number-of-floors",
    ],
    commercial: [
        "number-of-floors",
        "maximum-occupancy",
    ],
    industrial: [
        "number-of-elevators",
    ]
};

// DISPLAY
function resetForm() {
    estimateNumElv_div.style.display = "none";
    estimateNumElv_div.querySelectorAll("div").forEach((el) => {
        el.querySelectorAll("input[type='number']").forEach((input) => {
            input.value = "";
        });
        el.querySelectorAll("div.col-4").forEach((div) => {
            div.classList.add("d-none");
        });
    });
    displayCalcElv_input.value = "";
    productLineSelection_div.style.display = "none";
    warning_p.style.display = "none";
    productLineSelection_div
        .querySelectorAll("input[type='radio']")
        .forEach((radioBtn) => {
            radioBtn.checked = false;
        });

    finalPricingDisplay_div.style.display = "none";
    finalPricingDisplay_div
        .querySelectorAll("input[type='text']")
        .forEach((input) => {
            input.setAttribute("value", "");
        });
}

function displayBuildingFields(buildingType) {
    estimateNumElv_div.style.display = "block";
    estimateNumElv_div.querySelector(".step-description").style.display = "block";
    estimateNumElv_div.querySelector(".card-block").style.display = "block";
    estimateNumElv_div.querySelectorAll(".row").forEach((row) => {
        row.classList.remove("d-none");
    });
    for (let fieldID of buildingTypeFields[buildingType]) {
        estimateNumElv_div
            .querySelector(`div[id='${fieldID}']`)
            .classList.remove("d-none");
    }
    productLineSelection_div.style.display = "block";
    finalPricingDisplay_div.style.display = "block";
}

function displayElvCalcResult(buildingType) {
    fetch(`http://localhost:3004/calc/${buildingType}?floors=${numFloors_input.value}&apts=${numApt_input.value}&maxOccupancy=${maxOcc_input.value}&elevators=${numElevators_input.value}`)
        .then((res) => res.json())
        .then((data) => {
            let calculatedElv = data;
            displayCalcElv_input.value = calculatedElv;
        });
}

function displayPricing(productLine, numElv) {
    fetch(`http://localhost:3004/calc-cost?tier=${productLine}&numElevators=${numElv}`)
        .then((res) => res.json())
        .then((data) => {
            let unitPrice = data.unit_price;
            let subtotal = data.sub_total;
            let totalInstallFee = data.install_fee;
            let totalPrice = data.total_cost;
            displayUnitPrice_input.setAttribute("value", formatter.format(unitPrice));
            displayElvTotalPrice_input.setAttribute("value",formatter.format(subtotal));
            displayInstallFee_input.setAttribute("value",formatter.format(totalInstallFee));
            displayEstTotalCost_input.setAttribute("value",formatter.format(totalPrice));
        });
}

function updatePricingDisplay() {
    if (!displayCalcElv_input.value) {
        warning_p.style.display = "block";
        this.checked = false;
    } else {
        let numElv = parseInt(displayCalcElv_input.value);
        warning_p.style.display = "none";
        try {
            let productLine = document.querySelector(
                "input[name='product-line']:checked"
            ).id;
            displayPricing(productLine, numElv);
        } catch {
            // empty: waiting for user to select product line;
        }
    }
}

// VALIDATION
function allBuildingFieldsCompleted(buildingType) {
    for (let fieldID of buildingTypeFields[buildingType]) {
        if (
            estimateNumElv_div.querySelector(`div[id='${fieldID}'] input`)
                .value == ""
        ) {
            return false;
        }
    }
    return true;
}

// MODEL
radioBtns_div.querySelectorAll("input[type='radio']").forEach((radioBtn) => {
    radioBtn.addEventListener("click", updatePricingDisplay);
});

buildingType_select.addEventListener("change", function () {
    resetForm();
    buildingType = this.value;
    if (buildingType == "---Select---") {
        resetForm();
    } else {
        displayBuildingFields(buildingType);
        estimateNumElv_div.addEventListener("change", function () {
            if (!allBuildingFieldsCompleted(buildingType)) {
                return;
            } else {
                displayElvCalcResult(buildingType);
                updatePricingDisplay();
            }
        });
    }
});
