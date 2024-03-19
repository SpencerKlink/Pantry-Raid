var recipeData = JSON.parse(localStorage.getItem("currentRecipeData"));
stringifyRecipeIngredients(recipeData);
// function displayRecipeDetails(recipeData) {
//     var detailsElement = document.getElementById('nutritionDetails');
//     var recipeUrl = `https://spoonacular.com/recipes/${recipeData}`;
//     var html = `
//         <h2>${recipeData.title}</h2>
//         <img src="${recipeData.image}" alt="Image of ${recipeData.title}" />
//         <p>${recipeData.instructions ? recipeData.instructions : 'Instructions not available.'}</p>
//         <a href="${recipeUrl}" target="_blank">View this recipe on Spoonacular</a>
//     `;
//     detailsElement.innerHTML = html;
// }
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
  }
  getRecipeUrl(recipeData);
  displayRecipeDetails(recipeData);
  getNutritionInfo(recipeString);
}
function getRecipeInstructions(recipeUrlArg) {
  fetch(recipeUrlArg)
    .then((response) => response.text())
    .then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var paragraph = doc.querySelector(".recipeInstructions");
      var paragraphText = paragraph.textContent; 
      console.log(paragraphText);
    })
    .catch((error) => console.error("Error fetching the webpage:", error));
  return paragraphText;
}

function getNutritionInfo(ingredientsArg) {
  var appID = "3f16e02e";
  var appKey = "548ad8877714b47becab16723c1f292f";
  var ingredients = ingredientsArg;
  var url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": appID,
      "x-app-key": appKey,
    },
    body: JSON.stringify({
      query: ingredients,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
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
      var totalMealNutrition = `Cals:${Math.ceil(cals)}\nFats:${Math.ceil(
        fats
      )}\nCarbs: ${Math.ceil(carbs)}\nProteins: ${Math.ceil(
        proteins
      )}\nSugars: ${Math.ceil(sugars)}\nSodium: ${Math.ceil(sodium)}`;
      console.log(totalMealNutrition);
      return totalMealNutrition;
    });
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
function displayNutritionData(data) {
  var detailsElement = document.getElementById("nutritionDetails");
  if (data.foods && data.foods.length > 0) {
    var nutritionInfo = data.foods
      .map((food) => `<p>${food.food_name}: ${food.nf_calories} calories</p>`)
      .join("");
    detailsElement.innerHTML = nutritionInfo;
  } else {
    detailsElement.innerHTML = "<p>No nutritional data found.</p>";
  }
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
  }
  getRecipeUrl(recipeData);
  console.log(recipeString);
  getNutritionInfo(recipeString);
}
function getRecipeInstructions(recipeUrlArg) {
  fetch(recipeUrlArg)
    .then((response) => response.text())
    .then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var paragraph = doc.querySelector(".recipeInstructions");
      var paragraphText = paragraph.textContent;
      console.log("------paragraph--------");
      console.log(paragraphText);
      var recipeInstructionsEl = document.getElementById("recipeInstructions");
      recipeInstructionsEl.innerHTML =
        paragraphText +
        ` For more info go to <a href=${recipeUrlArg}>Spoonacular</>`;
    })
    .catch((error) => console.error("Error fetching the webpage:", error));
}
function fetchNutritionalInfo(recipeId) {
  var ingredients = "Example ingredients list";
  getNutritionInfo(ingredients);
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
function displayNutritionData(data) {
  var detailsElement = document.getElementById("nutritionDetails");
  if (data.foods && data.foods.length > 0) {
    var nutritionInfo = data.foods
      .map((food) => `<p>${food.food_name}: ${food.nf_calories} calories</p>`)
      .join("");
    detailsElement.innerHTML = nutritionInfo;
  } else {
    detailsElement.innerHTML = "<p>No nutritional data found.</p>";
  }
}