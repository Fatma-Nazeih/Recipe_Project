// ================= Shared Functions =================

// Function to get recipes from localStorage
function get_recipes_from_storage() {
    return JSON.parse(localStorage.getItem("recipes")) || [];
}

// Function to save recipes to localStorage
function set_recipes_to_storage(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

// ================= Initialize Default Recipes =================

// Function to initialize storage with default recipes if empty
function initialize_storage_with_default_recipes() {
    let recipes = get_recipes_from_storage();

    if (recipes.length === 0) {
        recipes = [
            {
                id: Date.now(),
                name: "Chicken Alfredo",
                category: "Main Course",
                time: 30,
                description: "Creamy pasta with chicken and parmesan cheese. A classic Italian-American dish.",
                servings: 4,
                ingredients: [
                    { name: "Chicken Breast", quantity: "2 pieces" },
                    { name: "Fettuccine Pasta", quantity: "200g" },
                    { name: "Parmesan Cheese", quantity: "50g" },
                    { name: "Heavy Cream", quantity: "1 cup" },
                    { name: "Garlic", quantity: "2 cloves" }
                ],
                image: "images/ChickenAlfredo.jpg"
            },
            {
                id: Date.now() + 1,
                name: "Chocolate Cake",
                category: "Dessert",
                time: 45,
                description: "Rich and moist chocolate cake topped with chocolate ganache.",
                servings: 6,
                ingredients: [
                    { name: "Flour", quantity: "2 cups" },
                    { name: "Cocoa Powder", quantity: "3/4 cup" },
                    { name: "Eggs", quantity: "3" },
                    { name: "Sugar", quantity: "1.5 cups" },
                    { name: "Butter", quantity: "100g" }
                ],
                image: "images/chocolate cake.jpeg"
            }
        ];
        set_recipes_to_storage(recipes);
    }
}

// ================= Dashboard Page =================

// Function to display recipes on the dashboard
function dashboard_display() {
    const container = document.querySelector(".recipes-grid");
    const recipes = get_recipes_from_storage();
    const totalRecipesElement = document.querySelector(".total-recipes-count");

    if (totalRecipesElement) {
        totalRecipesElement.textContent = recipes.length;
    }

    container.innerHTML = "";

    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found. Please add some recipes!</p>";
        return;
    }

    // Loop through recipes and create cards
    recipes.forEach((item) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
        recipeCard.innerHTML = `
            <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}">
            <div class="recipe-info">
                <h3 class="recipe-name">${item.name}</h3>
                <p class="recipe-desc">${item.description || ''}</p>
                <div class="recipe-meta">
                    <span class="recipe-category">${item.category}</span>
                    <span class="prep-time">Time: ${item.time} minutes</span>
                    <span class="recipe-servings">Servings: ${item.servings}</span>
                </div>
                <div class="recipe-actions">
                    <a href="edit-recipe.html?id=${item.id}" class="edit-btn"><i class="fas fa-edit"></i> Edit</a>
                    <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
        container.appendChild(recipeCard);
    });

    // Handle delete recipe
    container.addEventListener("click", (e) => {
        if (e.target.closest(".delete-btn")) {
            const recipeId = e.target.closest(".delete-btn").dataset.id;
            if (confirm("Are you sure you want to delete this recipe?")) {
                let recipes = get_recipes_from_storage();
                recipes = recipes.filter(recipe => recipe.id != recipeId);
                set_recipes_to_storage(recipes);
                dashboard_display();
            }
        }
    });

    // Search recipes by name
    const searchInput = document.querySelector(".search-bar input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();
            const recipeCards = document.querySelectorAll(".recipe-card");
            recipeCards.forEach(card => {
                const recipeNameElement = card.querySelector(".recipe-info h3");
                if (recipeNameElement) {
                    const recipeName = recipeNameElement.textContent.toLowerCase();
                    card.style.display = recipeName.includes(searchTerm) ? "block" : "none";
                }
            });
        });
    }
}

// ================= Edit/Add Recipe Page =================

// Function to get a recipe by its ID
function get_recipe_by_id(id) {
    const recipes = get_recipes_from_storage();
    return recipes.find(recipe => recipe.id == id);
}

// Function to create an ingredient input item
function createIngredientItem(ingredient = { name: "", quantity: "" }) {
    const ingredientItemDiv = document.createElement("div");
    ingredientItemDiv.className = "ingredient-item";
    ingredientItemDiv.innerHTML = `
        <input type="text" class="ingredient-name" placeholder="Ingredient Name" value="${ingredient.name}">
        <input type="text" class="ingredient-quantity" placeholder="Quantity" value="${ingredient.quantity}">
        <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
    `;
    return ingredientItemDiv;
}

// Function to handle the recipe form (add/edit)
function form_handler() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    let recipes = get_recipes_from_storage();
    let editRecipe = null;
    let imageUrl = "";

    const recipeIngredientsList = document.querySelector(".ingredients-list");
    const addIngredientButton = document.querySelector(".add-ingredient");
    const recipeImageInput = document.querySelector("#recipe-image");
    const imagePreview = document.querySelector("#image-preview");
    const recipeForm = document.querySelector(".recipe-form");

    // If editing an existing recipe
    if (recipeId) {
        editRecipe = get_recipe_by_id(recipeId);
        if (editRecipe) {
            imageUrl = editRecipe.image || "";
            document.getElementById("recipe-name").value = editRecipe.name || "";
            document.getElementById("recipe-category").value = editRecipe.category || "";
            document.getElementById("prep-time").value = editRecipe.time || "";
            document.getElementById("recipe-desc").value = editRecipe.description || "";
            document.getElementById("recipe-servings").value = editRecipe.servings || "1";

            if (recipeIngredientsList) {
                recipeIngredientsList.innerHTML = "";
                if (editRecipe.ingredients && Array.isArray(editRecipe.ingredients)) {
                    editRecipe.ingredients.forEach(ingredient => {
                        recipeIngredientsList.appendChild(createIngredientItem(ingredient));
                    });
                }
            }

            if (imagePreview && imageUrl) {
                imagePreview.src = imageUrl;
                imagePreview.style.display = 'block';
            } else if (imagePreview) {
                imagePreview.style.display = 'none';
            }
        }
    } 
    // If adding a new recipe
    else {
        if (recipeIngredientsList) {
            recipeIngredientsList.appendChild(createIngredientItem());
        }
    }

    // Add ingredient item
    if (addIngredientButton && recipeIngredientsList) {
        addIngredientButton.addEventListener("click", function () {
            recipeIngredientsList.appendChild(createIngredientItem());
        });
    }

    // Remove ingredient item
    if (recipeIngredientsList) {
        recipeIngredientsList.addEventListener('click', function (e) {
            if (e.target.closest('.remove-ingredient-btn')) {
                e.target.closest('.ingredient-item').remove();
            }
        });
    }

    // Handle image preview
    recipeImageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageUrl = e.target.result;
                imagePreview.src = imageUrl;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imageUrl = "";
            imagePreview.style.display = 'none';
        }
    });

    // Handle form submit
    recipeForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("recipe-name").value;
        const category = document.getElementById("recipe-category").value;
        const time = document.getElementById("prep-time").value;
        const description = document.getElementById("recipe-desc").value;
        const servings = document.getElementById("recipe-servings").value;

        const ingredients = [];
        if (recipeIngredientsList) {
            recipeIngredientsList.querySelectorAll(".ingredient-item").forEach(item => {
                const ingredientNameInput = item.querySelector(".ingredient-name");
                const ingredientQuantityInput = item.querySelector(".ingredient-quantity");
                if (ingredientNameInput && ingredientQuantityInput) {
                    const ingredientName = ingredientNameInput.value.trim();
                    const ingredientQuantity = ingredientQuantityInput.value.trim();
                    if (ingredientName) {
                        ingredients.push({ name: ingredientName, quantity: ingredientQuantity });
                    }
                }
            });
        }

        // Validate form fields
        if (!name || !category || !time) {
            alert("Please fill in all required fields: Recipe Name, Category, and Preparation Time.");
            return;
        } else if (ingredients.length === 0) {
            alert("Please add at least one ingredient.");
            return;
        } else if (!servings || servings <= 0) {
            alert("Please enter a valid number of servings.");
            return;
        }

        // Update existing recipe
        if (editRecipe) {
            editRecipe.name = name;
            editRecipe.category = category;
            editRecipe.time = time;
            editRecipe.description = description;
            editRecipe.servings = servings;
            editRecipe.ingredients = ingredients;
            editRecipe.image = imageUrl || editRecipe.image;

            recipes = recipes.filter(recipe => recipe.id != recipeId);
            recipes.push(editRecipe);
        } 
        // Create new recipe
        else {
            const newRecipe = {
                id: Date.now(),
                name,
                category,
                time,
                description,
                servings: parseInt(servings),
                ingredients,
                image: imageUrl
            };
            recipes.push(newRecipe);
        }

        // Save recipes and redirect
        set_recipes_to_storage(recipes);
        window.location.href = "adminDashboard.html"; // Redirect to dashboard
    });
}

// Initialize default recipes on page load
initialize_storage_with_default_recipes();

// Page-specific function calls
if (window.location.pathname.includes("adminDashboard.html") || window.location.pathname === "/") {
    dashboard_display();
} else if (window.location.pathname.includes("edit-recipe.html")) {
    form_handler();
}
