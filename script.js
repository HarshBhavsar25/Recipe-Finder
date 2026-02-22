const apiKey = ''; 
const searchBtn = document.getElementById('searchBtn');
const ingredientInput = document.getElementById('ingredientInput');
const recipeResults = document.getElementById('recipeResults');
const recipeModal = document.getElementById('recipeModal');
const modalRecipeTitle = document.getElementById('modalRecipeTitle');
const modalRecipeImage = document.getElementById('modalRecipeImage');
const modalRecipeInstructions = document.getElementById('modalRecipeInstructions');
const closeModal = document.querySelector('.close');

window.onload = () => {
    const lastIngredients = getCookie('lastIngredients');
    if (lastIngredients) {
        ingredientInput.value = lastIngredients; 
        fetchRecipes(lastIngredients); 
    }
};

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const ingredients = ingredientInput.value.trim();
    if (ingredients !== '') {
        setCookie('lastIngredients', ingredients, 7); 
        fetchRecipes(ingredients);
    } else {
        alert('Please enter some ingredients.');
    }
});


function fetchRecipes(ingredients) {
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            if (Array.isArray(data)) {
                displayRecipes(data);
            } else {
                handleApiError(data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Display the fetched recipes
function displayRecipes(recipes) {
    recipeResults.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-card-content">
                <h3>${recipe.title}</h3>
                <button class="view-recipe" data-id="${recipe.id}">View Recipe</button>
            </div>
        `;

        recipeResults.appendChild(recipeCard);
    });

    const viewRecipeButtons = document.querySelectorAll('.view-recipe');
    viewRecipeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeId = e.target.getAttribute('data-id');
            fetchRecipeDetails(recipeId);
        });
    });

    // ✅ Auto scroll
    recipeResults.scrollIntoView({
        behavior: "smooth"
    });
}
// Fetch detailed recipe information
function fetchRecipeDetails(recipeId) {
    const detailUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(detailUrl)
        .then(response => response.json())
        .then(data => {
            modalRecipeTitle.innerText = data.title;
            modalRecipeImage.src = data.image;
            modalRecipeInstructions.innerHTML = data.instructions || 'No instructions available.';
            recipeModal.style.display = 'block'; // Show modal
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}


closeModal.onclick = function() {
    recipeModal.style.display = 'none'; 
}


window.onclick = function(event) {
    if (event.target == recipeModal) {
        recipeModal.style.display = 'none';
    }
}


function handleApiError(data) {
    recipeResults.innerHTML = `<p class="error-message">No recipes found or there was an error: ${data.message}</p>`;
    console.error('API returned an error:', data.message);
}


function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

