const colorPicker = document.getElementById("colorPicker");
const colorBox = document.getElementById("colorBox");
const resetBtn = document.getElementById("resetBtn");

const defaultColor = "lightgray";

// Apply selected color to div
colorPicker.addEventListener("input", function () {
    colorBox.style.backgroundColor = colorPicker.value;
});

// Reset to default color
resetBtn.addEventListener("click", function () {
    colorBox.style.backgroundColor = defaultColor;
    colorPicker.value = "#000000"; // Optional reset value
});
