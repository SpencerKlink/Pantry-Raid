document.addEventListener('DOMContentLoaded', function() {
    var recipeId = localStorage.getItem('currentRecipeId');
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
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayNutritionData(data);
    })
    .catch(error => console.error('Error fetching nutritional data:', error));
}

function displayNutritionData(data) {
    var detailsElement = document.getElementById('nutritionDetails');
    if (data.foods && data.foods.length > 0) {
        var nutritionInfo = data.foods.map(food => `<p>${food.food_name}: ${food.nf_calories} calories</p>`).join('');
        detailsElement.innerHTML = nutritionInfo;
    } else {
        detailsElement.innerHTML = '<p>No nutritional data found.</p>';
    }
}
