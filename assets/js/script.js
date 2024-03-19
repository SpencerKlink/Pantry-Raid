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
              <h3 class="recipe-title" data-recipe='${JSON.stringify(recipe)}' style="cursor:pointer;">${recipe.title}</h3>
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
      favoritesHtml += `<li>${favorite} <button onclick="removeFavorite('${favorite.replace(/'/g, "\\'")}', event)">❌</button></li>`;
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

document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('recipe-title')) {
      var recipeData = JSON.parse(event.target.getAttribute('data-recipe'));
      localStorage.setItem('currentRecipeData', JSON.stringify(recipeData));
      window.location.href = 'details.html'; 
  }
});
