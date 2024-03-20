document.getElementById("recipeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var ingredients = document.getElementById("ingredientsInput").value.trim();
  console.log("Ingredients submitted:", ingredients);
  var allowedMissing =
    document.getElementById("missingIngredients").value || "0";
  var apiKey = "822983c348234fbba4210ca9dee9fecd";
  // var apiKey = "6672e8c409a545128086b53cfbae1d59";
  var apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}&number=10&ignorePantry=true&ranking=1`;

  if (!ingredients) {
    console.log("No ingredients entered.");
    alert("Please enter at least one ingredient.");
    return;
  }
  clearResults()
  document.getElementById("searchResults").classList.remove("hidden");
  
  document.getElementById("resultsTitle").textContent = "Your Results";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      var recipesHtml = "";
      var recipeResults = [];
      data.forEach((recipe) => {
        if (recipe.missedIngredientCount < allowedMissing) {
          recipesHtml += `<div class="recipe-card">
              <h3 class="recipe-title" data-recipe='${JSON.stringify(
                recipe
              )}' style="cursor:pointer;">${recipe.title}</h3>
              <img src="${recipe.image}" alt="Image of ${recipe.title}" />
              <button onclick="toggleFavorite('${recipe.title.replace(
                /'/g,
                "\\'"
              )}')">❤️</button>
          </div>`;
          recipeResults.push(recipe);
        }
      });
      if (recipesHtml.length === 0) {
        console.log(recipesHtml.length);
        document.getElementById("recipes").innerHTML =
          "<p>No matching recipes. Please try again</p>";
      } else {
        // document.getElementById("recipes").innerHTML = recipesHtml;
        sessionStorage.setItem("searchResults", JSON.stringify(recipeResults));
        loadSessionStorage();
      }
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      document.getElementById("recipes").innerHTML = "<p>Please try again.</p>";
    });
});

document.getElementById("hamburger").addEventListener("click", function () {
  console.log("Hamburger menu toggled");
  document.getElementById("menu").classList.toggle("hidden");
});

function toggleFavorite(recipeTitle) {
  console.log("Toggling favorite:", recipeTitle);
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  var index = favorites.indexOf(recipeTitle);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(recipeTitle);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

document.getElementById("showFavorites").addEventListener("click", function () {
  console.log("Showing favorites");
  showFavorites();
});

function showFavorites() {
  document.getElementById("searchResults").classList.remove("hidden");
  var resultTitleEl = document.getElementById("resultsTitle");
  resultTitleEl.textContent = "Your Favorites";
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  console.log("Current favorites:", favorites);
  var favoritesHtml = "<ul>";
  for (let i = 0; i < favorites.length; i++) {
    var favorite = favorites[i];
    favoritesHtml +=
      "<li>" +
      favorite +
      " <button onclick=\"removeFavorite('" +
      favorite.replace(/'/g, "\\'") +
      "', event)\">❌</button></li>";
  }
  favoritesHtml += "</ul>";
  document.getElementById("recipes").innerHTML = favoritesHtml;
  clearSearch();
}

function removeFavorite(recipeTitle, event) {
  event.stopPropagation();
  console.log("Removing favorite:", recipeTitle);
  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  var index = favorites.indexOf(recipeTitle);
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showFavorites();
  }
}
// ----------------------------------------------------------------

function prepareForDetailsPage(recipeData) {
  console.log("Preparing for details page:", recipeData);
  localStorage.setItem("currentRecipeData", JSON.stringify(recipeData));
  window.location.href = "details.html";
}

document.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("recipe-title")) {
    var recipeData = JSON.parse(event.target.getAttribute("data-recipe"));
    prepareForDetailsPage(recipeData);
  }
});

function loadSessionStorage() {
  var sessionData = JSON.parse(sessionStorage.getItem("searchResults"));
  var recipesHtml = "";
  if (sessionData) {
    sessionData.forEach((recipe) => {
      recipesHtml += `<div class="recipe-card">
      <h3 class="recipe-title" data-recipe='${JSON.stringify(
        recipe
      )}' style="cursor:pointer;">${recipe.title}</h3>
      <img src="${recipe.image}" alt="Image of ${recipe.title}" />
      <button onclick="toggleFavorite('${recipe.title.replace(
        /'/g,
        "\\'"
      )}')">❤️</button></div>`;
    });
    document.getElementById("recipes").innerHTML = recipesHtml;
    document.getElementById("searchResults").classList.remove("hidden");
    console.log("results pulled from session storage");
    createClearButton();
  }
}

function clearSearch() {
  var ingredientsInputEl = document.getElementById("ingredientsInput");
  ingredientsInputEl.value = "";
  var mealTypeInputEl = document.getElementById("mealType");
  mealTypeInputEl.value = "";
  var missingIngredientsEl = document.getElementById("missingIngredients");
  missingIngredientsEl.value = "";
}


function createClearButton() {
  var searchResultsEl = document.getElementById("searchResults");
  var clearButton = document.createElement("button");
  clearButton.setAttribute("id", "clearButton");
  clearButton.classList.add("bg-blue-500", "text-white", "p-2", "rounded");
  clearButton.textContent = "Clear Search";
  searchResultsEl.append(clearButton);

  clearButton.addEventListener("click", function () {
    clearResults();
  });
}

function clearResults() {
  var searchResultsEl = document.getElementById("searchResults");
  var clearButtonEl = document.getElementById("clearButton");
  sessionStorage.removeItem("searchResults");
  searchResultsEl.classList.add("hidden");
  if (clearButtonEl) {
    searchResultsEl.removeChild(clearButtonEl);
  }
  
}

loadSessionStorage();
