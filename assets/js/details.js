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
  var ingredientData = recipeData["usedIngredients"];
  console.log(ingredientData);

  for (let i = 0; i < ingredientData.length; i++) {
    var amount = ingredientData[i]["amount"];
    var unitMeasurement = ingredientData[i]["unit"];
    var ingredientName = ingredientData[i]["name"];
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
  var ingredientsArray = recipeString.split(',');
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
      var paragraph = doc.querySelector(".recipeInstructions");
      var paragraphText = paragraph.textContent; // Get the text content of the paragraph
      console.log(paragraphText);
    })
    .catch((error) => console.error("Error fetching the webpage:", error));
  return paragraphText;
}

document.addEventListener("DOMContentLoaded", function () {
  var recipeId = localStorage.getItem("currentRecipeId");
  if (recipeId) {
    fetchNutritionalInfo(recipeId);
  }
});

function fetchNutritionalInfo(recipeId) {
  var ingredients = "Example ingredients list";
  getNutritionInfo(ingredients);
}

function displayNutritionData(data) {
  var detailsElement = document.getElementById("nutritionDetails");
  console.log(data);
  console.log(data.foods);
  if (data.foods && data.foods.length > 0) {
    var nutritionInfo = data.foods
      .map((food) => `<p>${food.food_name}: ${food.nf_calories} calories</p>`)
      .join("");
    detailsElement.innerHTML = nutritionInfo;
  } else {
    detailsElement.innerHTML = "<p>No nutritional data found.</p>";
  }
}

function getRecipeInstructions(recipeUrlArg) {
  fetch(recipeUrlArg)
    .then((response) => response.text())
    .then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var paragraph = doc.querySelector(".recipeInstructions");
      var paragraphText = paragraph.textContent; // Get the text content of the paragraph
      var recipeInstructionsEl = document.getElementById("recipeInstructions");
      recipeInstructionsEl.innerHTML =
        paragraphText +
        ` <a href="${recipeUrlArg}">For more info go to Spoonacular</a>`;
    })
    .catch((error) => console.error("Error fetching the webpage:", error));
}

function getNutritionInfo(ingredientsArg) {
  var appID = "3f16e02e";
  var appKey = "548ad8877714b47becab16723c1f292f";
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
      displayNutritionData(data);
    })
    .catch((error) => console.error("Error fetching nutritional data:", error));
}
