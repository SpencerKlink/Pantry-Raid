document.getElementById('recipeForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    var ingredients = document.getElementById('ingredientsInput').value.trim();
    var apiKey = '822983c348234fbba4210ca9dee9fecd';
    var apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}`;

    if (!ingredients) {
        alert('Please enter at least one ingredient.');
        return; 
    }

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch recipes. Status: ' + response.status); 
        }
        return response.json(); 
    })
    .then(data => {
        if (!data.length) { 
            document.getElementById('recipes').innerHTML = '<p>No recipes found. Try different ingredients.</p>';
            return;
        }

        var recipesHtml = '';
        data.forEach(recipe => {
            recipesHtml += `<div class="recipe-card"><h3>${recipe.title}</h3><img src="${recipe.image}" alt="Image of ${recipe.title}"></div>`;
        });
        document.getElementById('recipes').innerHTML = recipesHtml;
    })
    .catch(error => {
        console.log('Error fetching data: ', error);
        document.getElementById('recipes').innerHTML = '<p>Please try again.</p>';
    });
});
