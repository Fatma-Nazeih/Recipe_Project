document.addEventListener("DOMContentLoaded", function() {
    // Check if we're on the favorites page
    if (document.querySelector('.favorites-container')) {
        renderFavorites();
        setupEventListeners();
    }
});

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    container.innerHTML = '';
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart-broken"></i>
                <p>You haven't added any favorites yet</p>
                <a href="{% url 'search' %}" class="btn-browse">Browse Recipes</a>
            </div>
        `;
        return;
    }
    
    favorites.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.id = recipe.id;
        const description = recipe.description;

        
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="card-image">
            <div class="card-body">
                <h2 class="card-title">${recipe.title}</h2>
                <p>${description}
                <p class="card-author">By ${recipe.author || 'Unknown'}</p>
                <div class="card-actions">
                    <a href="${recipe.link}" class="btn btn-view">View Recipe</a>
                    <button class="btn btn-remove">Remove</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove')) {
            const card = e.target.closest('.recipe-card');
            const recipeId = card.dataset.id;
            
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(recipe => recipe.id !== recipeId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            renderFavorites();
        }
    });
}