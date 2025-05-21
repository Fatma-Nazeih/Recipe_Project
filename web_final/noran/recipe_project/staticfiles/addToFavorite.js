document.addEventListener("DOMContentLoaded", () => {
    const favoriteButtons = document.querySelectorAll(".favorite-button");
    
    favoriteButtons.forEach(button => {
        // Check if already favorited
        const recipeId = button.dataset.recipeId;
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const isFavorited = favorites.some(recipe => recipe.id === recipeId);
        
        if (isFavorited) {
            button.textContent = "♥ Added to Favorites";
            button.classList.add("favorited");
        }
        
        button.addEventListener("click", (e) => {
            const recipe = {
                id: button.dataset.recipeId,
                title: button.dataset.recipeTitle,
                description: button.dataset.recipeDescription,
                image: button.dataset.recipeImage,
                link: button.dataset.recipeLink
            };

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            
            // Check if already favorited
            const existingIndex = favorites.findIndex(fav => fav.id === recipe.id);
            if (existingIndex >= 0) {
                favorites.splice(existingIndex, 1);
                button.textContent = "⭐ Add to Favorites";
                button.classList.remove("favorited");
            } else {
                favorites.push(recipe);
                button.textContent = "♥ Added to Favorites";
                button.classList.add("favorited");
            }
            
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    });
});

