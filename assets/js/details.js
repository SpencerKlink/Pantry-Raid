var recipeData = JSON.parse(localStorage.getItem("currentRecipeData"));

stringifyRecipeIngredients(recipeData);

function displayRecipeDetails(recipeData) {
  var detailsElement = document.getElementById("recipeDetails");
  var titleEl = document.getElementById("recipeTitle");
  var html = `
        <img src="${recipeData.image}" alt="Image of ${recipeData.title}" />
    `;
  detailsElement.innerHTML = html;
  titleEl.innerHTML = recipeData.title;
}

function getRecipeUrl(recipeData) {
  var id = recipeData["id"];
  var title = recipeData["title"].replaceAll(" ", "-");
  var recipeUrl = `https://spoonacular.com/${title}-${id}`;
  console.log("url", title);
  console.log(recipeUrl);
  getRecipeInstructions(recipeUrl);
}

function stringifyRecipeIngredients(recipeData) {
  console.log(recipeData);

  var recipeString = "";
  var usedIngredientData = recipeData["usedIngredients"];
  var missedIngredientData = recipeData["missedIngredients"];
  console.log(usedIngredientData);

  for (let i = 0; i < usedIngredientData.length; i++) {
    var amount = usedIngredientData[i]["amount"];
    var unitMeasurement = usedIngredientData[i]["unitLong"];
    var ingredientName = usedIngredientData[i]["name"];
    recipeString += `${amount} ${unitMeasurement} ${ingredientName}, `;
    console.log(ingredientName);
  }

  // added loop to add missing ingredients to ingredient list and nutrition facts
  for (let i = 0; i < missedIngredientData.length; i++) {
    var amount = missedIngredientData[i]["amount"];
    var unitMeasurement = missedIngredientData[i]["unitLong"];
    var ingredientName = missedIngredientData[i]["name"];
    recipeString += `${amount} ${unitMeasurement} ${ingredientName}, `;
    console.log(ingredientName);
  }

  getRecipeUrl(recipeData);
  displayRecipeDetails(recipeData);
  displayIngredients(recipeString);
  getNutritionInfo(recipeString);
}

function displayIngredients(recipeString) {
  var recipeIngredientsEl = document.getElementById("recipeIngredients");
  var ingredientsArray = recipeString.split(",");
  for (let i = 0; i < ingredientsArray.length; i++) {
    var ingredientListItem = document.createElement("li");
    ingredientListItem.textContent = ingredientsArray[i];
    recipeIngredientsEl.append(ingredientListItem);
  }
}

function getRecipeInstructions(recipeUrlArg) {
  fetch(recipeUrlArg)
    .then((response) => response.text())
    .then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var paragraph =
        doc.querySelector(".recipeInstructions") ||
        doc.querySelector("#detailedInstructionsMention");
      var paragraphText = paragraph.innerHTML; // Get the text content of the paragraph
      console.log(paragraphText);
      var recipeInstructionsEl = document.getElementById("recipeInstructions");
      recipeInstructionsEl.innerHTML =
        paragraphText +
        ` <a href="${recipeUrlArg}">For more visit Spoonacular.com</a>`;
    })
    .catch((error) => console.error("Error fetching the webpage:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  var recipeId = localStorage.getItem("currentRecipeId");
  if (recipeId) {
    fetchNutritionalInfo(recipeId);
  }
});

function displayNutritionData() {
  var data = JSON.parse(localStorage.getItem("currentRecipeNutrition"))
  var modalInfoEl = document.getElementById("nutritionInfo");

  if (data.foods && data.foods.length > 0) {
    nutritionData = data["foods"];
      console.log(nutritionData);
      var cals = 0;
      var fats = 0;
      var carbs = 0;
      var proteins = 0;
      var sugars = 0;
      var sodium = 0;

      for (let i = 0; i < nutritionData.length; i++) {
        cals += nutritionData[i]["nf_calories"];
        fats += nutritionData[i]["nf_total_fat"];
        carbs += nutritionData[i]["nf_total_carbohydrate"];
        proteins += nutritionData[i]["nf_protein"];
        sugars += nutritionData[i]["nf_sugars"];
        sodium += nutritionData[i]["nf_sodium"];
      }

      var totalMealNutrition = `<ul>
      <li>Cals:${Math.ceil(cals)}</li>
      <li>Fats:${Math.ceil(fats)}</li>
      <li>Carbs: ${Math.ceil(carbs)}</li>
      <li>Proteins: ${Math.ceil(proteins)}</li>
      <li>Sugars: ${Math.ceil(sugars)}</li>
      <li>Sodium: ${Math.ceil(sodium)}</li>
      </ul>`;

    modalInfoEl.innerHTML = totalMealNutrition;
  } else {
    modalInfoEl.innerHTML = "<p>No nutritional data found.</p>";
  }
}


function getNutritionInfo(ingredientsArg) {
  //   var appID = "3f16e02e";
  //   var appKey = "548ad8877714b47becab16723c1f292f";
  var appID = "c801545b";
  var appKey = "a70cf301943e3e0868d65610e47736c3";
  var url = "https://trackapi.nutritionix.com/v2/natural/nutrients";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": appID,
      "x-app-key": appKey,
    },
    body: JSON.stringify({ query: ingredientsArg }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("currentRecipeNutrition", JSON.stringify(data))
      
    })
    .catch((error) => console.error("Error fetching nutritional data:", error));
}

function openModal() {
  document.getElementById("nutritionModal").classList.remove("hidden");
  displayNutritionData();
}
function closeModal(event) {
  if (event) {
    event.stopPropagation();
  }
  document.getElementById("nutritionModal").classList.add("hidden");
}
document.addEventListener("DOMContentLoaded", () => {
  var closeModalButton = document.getElementById("closeModalButton");
  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModal);
  }
});
