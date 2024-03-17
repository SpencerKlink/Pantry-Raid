document.getElementById('recipeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var ingredients = document.getElementById('ingredientsInput').value.trim();
  console.log('Ingredients submitted:', ingredients);
  var apiKey = '822983c348234fbba4210ca9dee9fecd';
  var apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}`;

  if (!ingredients) {
      console.log('No ingredients entered.');
      alert('Please enter at least one ingredient.');
      return; 
  }

  document.getElementById('searchResults').classList.remove('hidden');

  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
      var recipesHtml = '';
      data.forEach(recipe => {
          recipesHtml += `<div class="recipe-card">
              <h3 onclick="prepareForDetailsPage(${JSON.stringify(recipe)})" style="cursor:pointer;">${recipe.title}</h3>
              <img src="${recipe.image}" alt="Image of ${recipe.title}" />
              <button onclick="toggleFavorite('${recipe.title.replace(/'/g, "\\'")}')">❤️</button>
          </div>`;
      });
      document.getElementById('recipes').innerHTML = recipesHtml;
  })
  .catch(error => {
      console.log('Error fetching data:', error);
      document.getElementById('recipes').innerHTML = '<p>Please try again.</p>';
  });
});

function prepareForDetailsPage(recipeData) {
  localStorage.setItem('currentRecipeId', recipeData.id); 
  window.location.href = 'details.html'; 
}


document.getElementById('hamburger').addEventListener('click', function() {
    console.log('Hamburger menu toggled');
    document.getElementById('menu').classList.toggle('hidden');
});

function toggleFavorite(recipeTitle) {
    console.log('Toggling favorite:', recipeTitle);
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    var index = favorites.indexOf(recipeTitle);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipeTitle);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

document.getElementById('showFavorites').addEventListener('click', function() {
    console.log('Showing favorites');
    showFavorites();
});

function showFavorites() {
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log('Current favorites:', favorites);
    var favoritesHtml = '<h2>Your Favorite Recipes</h2><ul>';
    for (let i = 0; i < favorites.length; i++) {
        var favorite = favorites[i];
        favoritesHtml += '<li>' + favorite + ' <button onclick="removeFavorite(\'' + favorite.replace(/'/g, "\\'") + '\', event)">❌</button></li>';
    }
    favoritesHtml += '</ul>';
    document.getElementById('recipes').innerHTML = favoritesHtml;
}
        
function removeFavorite(recipeTitle, event) {
    event.stopPropagation();
    console.log('Removing favorite:', recipeTitle);
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    var index = favorites.indexOf(recipeTitle);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showFavorites(); 
    }
}

function getRecipeUrl(recipeData) {
    var id = recipeData[0]["id"];
    var title = recipeData[0]["title"].replaceAll(" ", "-");
    var recipeUrl = `spoonacular.com/${title}-${id}`
    console.log("url", title);
    console.log(recipeUrl)
  }
  
  function stringifyRecipeIngredients(recipeData) {
    console.log(recipeData);
  
    var recipeString = "";
    var ingredientData = recipeData[0]["usedIngredients"];
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
        var paragraphText = paragraph.textContent; // Get the text content of the paragraph
        console.log(paragraphText);
      })
      .catch((error) => console.error("Error fetching the webpage:", error));
    return paragraphText;
  }
  
  //Gets nutrition info using NutritionIX API and return total nutrition string
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