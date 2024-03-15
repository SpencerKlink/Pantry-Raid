document.getElementById("recipeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var ingredients = document.getElementById("ingredientsInput").value.trim();
  var apiKey = "822983c348234fbba4210ca9dee9fecd";
  var apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}`;

  if (!ingredients) {
    alert("Please enter at least one ingredient.");
    return;
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch recipes. Status: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.length) {
        document.getElementById("recipes").innerHTML =
          "<p>No recipes found. Try different ingredients.</p>";
        return;
      }

      var recipesHtml = "";

      // grab used ingredients from data and put them into a string
      console.log(data);

      var recipeString = "";
      var ingredientData = data[0]["usedIngredients"];
      console.log(ingredientData);

      for (let i = 0; i < ingredientData.length; i++) {
        var amount = ingredientData[i]["amount"];
        var unitMeasurement = ingredientData[i]["unit"];
        var ingredientName = ingredientData[i]["name"];

        recipeString += `${amount} ${unitMeasurement} ${ingredientName}, `;
      }

      console.log(recipeString);
      getNutritionInfo(recipeString);
      // -----------------------------------------------------------

      data.forEach((recipe) => {
        recipesHtml += `<div class="recipe-card"><h3>${recipe.title}</h3><img src="${recipe.image}" alt="Image of ${recipe.title}"></div>`;
      });
      document.getElementById("recipes").innerHTML = recipesHtml;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
      document.getElementById("recipes").innerHTML = "<p>Please try again.</p>";
    });
});

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
      cals = 0;
      fats = 0;
      carbs = 0;
      proteins = 0;
      sugars = 0;
      sodium = 0;
      for (let i = 0; i < nutritionData.length; i++) {
        cals += nutritionData[i]["nf_calories"];
        fats += nutritionData[i]["nf_total_fat"];
        carbs += nutritionData[i]["nf_total_carbohydrate"];
        proteins += nutritionData[i]["nf_protein"];
        sugars += nutritionData[i]["nf_sugars"];
        sodium += nutritionData[i]["nf_sodium"];
      }
      console.log(
        `Cals:${Math.ceil(cals)}\nFats:${Math.ceil(fats)}\nCarbs: ${Math.ceil(carbs)}\nProteins: ${Math.ceil(proteins)}\nSugars: ${Math.ceil(sugars)}\nSodium: ${Math.ceil(sodium)}`
      );
    });
    
}
