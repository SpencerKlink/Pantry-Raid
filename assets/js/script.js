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
    createAlert();

    return;
  }
  clearResults();
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
              <button onclick="toggleFavorite(${recipe})">❤️</button>
          </div>`;
          recipeResults.push(recipe);
        }
      });
      if (recipesHtml.length === 0) {
        console.log(recipesHtml.length);
        document.getElementById("recipes").innerHTML =
          "<p>No matching recipes. Please try again</p>";
      } else {
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

function toggleFavorite(button) {
  console.log("Toggling favorite:");
  var recipe = JSON.parse(button.getAttribute("data-recipe"));

  var favoritesArray = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesArray.push(recipe);
  localStorage.setItem("favorites", JSON.stringify(favoritesArray));
}

document.getElementById("showFavorites").addEventListener("click", function () {
  console.log("Showing favorites");
  showFavorites();
});

function showFavorites() {
  clearSearch();
  clearResults();
  document.getElementById("searchResults").classList.remove("hidden");
  var resultTitleEl = document.getElementById("resultsTitle");
  resultTitleEl.textContent = "Your Favorites";

  var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  console.log("Current favorites:", favorites);
  var favoritesHtml = "";
  if (favorites) {
    favorites.forEach((recipe) => {
      favoritesHtml += `<div class="recipe-card">
      <h3 class="recipe-title" data-recipe='${JSON.stringify(
        recipe
      )}' style="cursor:pointer;">${recipe.title}</h3>
      <img src="${recipe.image}" alt="Image of ${recipe.title}" />
      <button onclick="removeFavorite(this)" data-recipe='${JSON.stringify(
        recipe
      )}'>❌</button></div>`;
    });
    document.getElementById("recipes").innerHTML = favoritesHtml;
  }
  if (favorites.length === 0) {
    document.getElementById("recipes").innerHTML =
      "<p>No favorites to display</p>";
  }
}

function removeFavorite(button) {
  var recipe = JSON.parse(button.getAttribute("data-recipe"));
  var removeRecipeID = recipe.id;

  var favoritesArray = JSON.parse(localStorage.getItem("favorites"));
  var newFavoritesArray = favoritesArray.filter(
    (item) => item.id !== removeRecipeID
  );
  localStorage.setItem("favorites", JSON.stringify(newFavoritesArray));
  showFavorites();
}

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
      <button onclick="toggleFavorite(this)" data-recipe='${JSON.stringify(
        recipe
      )}'>❤️</button></div>`;
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
    clearSearch();
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

function createAlert() {
  var recipeFormEl = document.getElementById("recipeForm");
  if (!document.getElementById("alert")) {
    var alert = document.createElement("div");
    alert.setAttribute("role", "alert");
    alert.setAttribute("id", "alert");
    alert.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold">No Ingredients Entered</strong>
    <span class="block sm:inline">Please enter at least one ingredient</span>
    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg class="fill-current h-6 w-6 text-red-500" id="alert-button" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
    </span></div>`;
    recipeFormEl.append(alert);

    var alertClose = document.getElementById("alert-button");

    alertClose.addEventListener("click", function () {
      console.log("close clicked");
      clearAlert();
    });
  }
}

function clearAlert() {
  var recipeFormEl = document.getElementById("recipeForm");
  var alert = document.getElementById("alert");
  recipeFormEl.removeChild(alert);
}

function generateMissingIngredientsValues() {
  var missingIngredientEl = document.getElementById("missingIngredients");
  for (let i = 0; i < 10; i++) {
    var ingredient = document.createElement("option");
    ingredient.setAttribute("value", `${i}`);
    ingredient.textContent = i;
    if (i === 0) {
      ingredient.textContent = "Allowed Missing Ingredients";
    }
    missingIngredientEl.append(ingredient);
  }
}
generateMissingIngredientsValues();

loadSessionStorage();
