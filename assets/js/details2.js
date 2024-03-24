document.addEventListener('DOMContentLoaded', function() {
    displayRecipeDetailsFromLocalStorage();
});
function displayRecipeDetailsFromLocalStorage() {
    var recipeDataString = localStorage.getItem('currentRecipeData');
    var spoonacularApiKey = "822983c348234fbba4210ca9dee9fecd";
    var spoonacularApiEndpoint = "https://api.spoonacular.com/recipes";
    if (recipeDataString) {
        var recipeData = JSON.parse(recipeDataString);
        displayRecipeDetails(recipeData);
        if (recipeData && recipeData.id) {
            stringifyRecipeIngredients(recipeData)
            // var instructionsUrl = `${spoonacularApiEndpoint}/${recipeData.id}/information?apiKey=${spoonacularApiKey}`;
            // getRecipeInstructions(instructionsUrl, recipeData);
        }
        if (recipeData && recipeData.ingredients) {
            var ingredientsList = recipeData.ingredients.join(', ');
            getNutritionInfo(ingredientsList);
        }
    } else {
        document.getElementById('nutritionDetails').innerHTML = '<p>No recipe details found. Please go back and select a recipe.</p>';
    }
}
function getRecipeUrl(recipeData) {
    var id = recipeData["id"];
    var title = recipeData["title"].replaceAll(" ", "-");
    var recipeUrl = `https://spoonacular.com/${title}-${id}`;
    console.log("url", title);
    console.log(recipeUrl);
    getRecipeInstructions(recipeData, recipeUrl);
  }
function getRecipeInstructions(recipeUrlArg, recipeData) {
    fetch(recipeUrlArg)
        .then(response => response.json())
        .then(data => {
            var instructions = data.instructions || "Instructions not available.";
            recipeData.instructions = instructions;
            displayRecipeDetails(recipeData);
        })
        .catch(error => console.error("Error fetching recipe instructions:", error));
}
// function getRecipeInstructions(recipeUrlArg) {
//     fetch(recipeUrlArg)
//       .then((response) => response.text())
//       .then((html) => {
//         var parser = new DOMParser();
//         var doc = parser.parseFromString(html, "text/html");
//         var instructions = data.instructions
//         var paragraphText = paragraph.textContent; // Get the text content of the paragraph
//         console.log("------paragraph--------");
//         console.log(paragraphText);
//         var recipeInstructionsEl = document.getElementById("recipeInstructions");
//         recipeInstructionsEl.innerHTML =
//           paragraphText +
//           ` For more info go to <a href=${recipeUrlArg}>Spoonacular</>`;
//       })
//       .catch((error) => console.error("Error fetching the webpage:", error));
//   }
  function fetchAndDisplayRecipeDetails(recipeData) {
    if (recipeData.instructionsUrl) {
        fetch(recipeData.instructionsUrl)
            .then(response => response.text())
            .then(instructionsHtml => {
                recipeData.instructions = instructionsHtml;
                displayRecipeDetails(recipeData);
            })
            .catch(error => console.error("Failed to fetch instructions:", error));
    } else {
        displayRecipeDetails(recipeData);
    }
}
  function displayRecipeDetails(recipeData, recipeUrl) {
    var detailsElement = document.getElementById('nutritionDetails');
    console.log(recipeUrl)
    var html = `
        <h2>${recipeData.title}</h2>
        <img src="${recipeData.image}" alt="Image of ${recipeData.title}" />
        <p>${recipeData.instructions ? recipeData.instructions : 'Instructions not available.'}</p>
        <a href="${recipeUrl}" target="_blank">View this recipe on Spoonacular</a>
    `;
    detailsElement.innerHTML = html;
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













  // Gets nutrition info using NutritionIX API and return total nutrition string
// function getNutritionInfo(ingredientsArg) {
//   var appID = "3f16e02e";
//   var appKey = "548ad8877714b47becab16723c1f292f";
//   var ingredients = ingredientsArg;

//   var url = "https://trackapi.nutritionix.com/v2/natural/nutrients";

//   fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-app-id": appID,
//       "x-app-key": appKey,
//     },
//     body: JSON.stringify({
//       query: ingredients,
//     }),
//   })
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       nutritionData = data["foods"];
//       console.log(nutritionData);
//       var cals = 0;
//       var fats = 0;
//       var carbs = 0;
//       var proteins = 0;
//       var sugars = 0;
//       var sodium = 0;

//       for (let i = 0; i < nutritionData.length; i++) {
//         cals += nutritionData[i]["nf_calories"];
//         fats += nutritionData[i]["nf_total_fat"];
//         carbs += nutritionData[i]["nf_total_carbohydrate"];
//         proteins += nutritionData[i]["nf_protein"];
//         sugars += nutritionData[i]["nf_sugars"];
//         sodium += nutritionData[i]["nf_sodium"];
//       }

//       var totalMealNutrition = `Cals:${Math.ceil(cals)}\nFats:${Math.ceil(
//         fats
//       )}\nCarbs: ${Math.ceil(carbs)}\nProteins: ${Math.ceil(
//         proteins
//       )}\nSugars: ${Math.ceil(sugars)}\nSodium: ${Math.ceil(sodium)}`;

//       console.log(totalMealNutrition);
//       return totalMealNutrition;
//     });
// }