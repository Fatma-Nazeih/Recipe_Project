// const recipes = [
//     {
//         title: "Tomato Chicken Pasta",
//         image: "tomatoChickenPasta.jpeg",
//         description: "A delicious and hearty pasta dish featuring tender chicken, rich tomato sauce, and flavorful herbs.",
//         prepTime: "30-50 mins",
//         category: "Main Course"
//         ,link: "tomatoChickenPasta.html"
//     },
//     {
//         title: "Chicken Fajitas",
//         image: "chickenFajitas.jpeg",
//         description: "A flavorful Tex-Mex dish featuring tender, spiced chicken strips sauteed with bell peppers and onions.",
//         prepTime: "40-50 mins",
//         category: "Main Course"
//         ,link: "chickenFajitas.html"

//     },
//     {
//         title: "Pepperoni Pizza",
//         image: "pizza.jpeg",
//         description: "A classic favorite with a crispy crust, tangy tomato sauce, gooey cheese, and spicy pepperoni slices.",
//         prepTime: "2 hr",
//         category: "Main Course"
//         ,link: "PepperoniPizza.html"
//     },
//     {
//         title: "Pizza Margherita",
//         image: "Pizza_Margherita_Recipe.jpeg",
//         description: "A traditional Italian pizza made with a thin, crispy crust topped with fresh tomato sauce, mozzarella cheese, and fresh basil leaves.",
//         prepTime: "2 hr",
//         category: "Main Course"
//         ,link: "margherita.html"
//     },
//     {
//         title: "Lasagna alla bolognese",
//         image: "lasagna.jpeg",
//         description: "A layered Italian masterpiece with sheets of pasta, savory meat sauce, creamy béchamel, and melted cheese.",
//         prepTime: "1 hr 10 mins",
//         category: "Main Course"
//         ,link: "lasagna.html"
//     },
//     {
//         title: "Honey Chicken Wings",
//         image: "Honey_Chicken_Wings.jpeg",
//         description: "Crispy, juicy chicken wings glazed with a sweet and savory honey sauce for the perfect balance of flavors.",
//         prepTime: "40 mins",
//         category: "Appetizer"
//         ,link: "wings.html"
//     },
//     {
//         title: "Goat Cheese Bruschetta",
//         image: "Goat_Cheese_Bruschetta.jpeg",
//         description: "A crunchy toasted baguette topped with creamy goat cheese, fresh tomatoes, and a drizzle of balsamic glaze.",
//         prepTime: "15-30 mins",
//         category: "Appetizer"
//         ,link: "cheeseBruschetta.html"
//     },
//     {
//         title: "Chicken Alfredo",
//         image: "ChickenAlfredo.avif",
//         description: "A creamy, delicious Chicken Alfredo pasta dish that's easy to make and perfect for a cozy dinner.",
//         prepTime: "30 min", 
//         category: "Main Course",
//         link: "ChickenAlfredo.html"
//     },
//     {
//         title: "Classic Cheeseburger",
//         image: "burger.jpeg",
//         description: "A juicy grilled beef patty topped with melted cheese, fresh lettuce, tomatoes, pickles, and a toasted bun. Served with crispy fries.",
//         prepTime: "1 hr", 
//         category: "Main Course",
//         link: "burger.html"
//     },
//     {
//         title: "Grilled Steak with Garlic Butter",
//         image: "steak.jpg",
//         description: "A perfectly grilled, juicy steak topped with a rich garlic butter sauce and served with roasted vegetables or mashed potatoes.",
//         prepTime: "1 hr 20 min", 
//         category: "Main Course",
//         link: "steak.html"
//     },
//     {
//         title: "Chocolate Lava Cake",
//         image: "cake.jpg",
//         description: "A decadent dessert with a warm, gooey chocolate center that oozes out when you cut into it. Perfect with a scoop of vanilla ice cream!",
//         prepTime: "50 min",
//         category: "Dessert",
//         link: "cake.html"
//     },
//     {
//         title: "Pancakes",
//         image: "pancake.jpeg",
//         description: "Fluffy, golden pancakes served warm with butter, syrup, and optional toppings like fruits or chocolate chips.",
//         prepTime: "20-30 mins",
//         category: "Dessert"
//         ,link: "pancakes.html"
//     },
//     {
//         title: "Tiramisu",
//         image: "Tiramisu.jpeg",
//         description: "A rich and creamy Italian dessert made with layers of coffee-soaked ladyfingers, mascarpone cheese, and cocoa powder.",
//         prepTime: "2 hr",
//         category: "Dessert"
//         ,link: "tiramisu.html"
//     },
//     {
//         title: "Cheesecake",
//         image: "cheesecake.jpeg",
//         description: "A smooth and creamy dessert with a buttery graham cracker crust, perfect with fruit or chocolate toppings.",
//         prepTime: "1 hr 10 mins",
//         category: "Dessert"
//         ,link: "cheeseCake.html"
//     },
//     {
//         title: "Japanese Cheesecake",
//         image: "Japanese_Cheesecake.jpeg",
//         description: "A soft, airy, and jiggly cheesecake with a delicate sweetness and a melt-in-your-mouth texture.",
//         prepTime: "1 hr 20 mins",
//         category: "Dessert"
//         ,link: "japCheesecake.html"
//     },
//     {
//         title: "Chocolate Cake",
//         image: "chocolate cake.jpeg",
//         description: "A moist and decadent chocolate treat with layers of rich chocolate frosting for an indulgent experience.",
//         prepTime: "50-60 mins",
//         category: "Dessert"
//         ,link: "chocoCake.html"
//     }
    
// ];

// ====================== 2. RECIPE STORAGE SYSTEM ======================
const SHARED_RECIPES_KEY = "sharedRecipes";


// Get recipes from localStorage
function getSharedRecipes() {
   const recipes = JSON.parse(localStorage.getItem(SHARED_RECIPES_KEY)) || [];
   return recipes;
}

// Save recipes to localStorage
function saveSharedRecipes(recipes) {
   localStorage.setItem(SHARED_RECIPES_KEY, JSON.stringify(recipes));
}

// Initialize shared recipes with defaults if empty
function initializeSharedRecipes() {
   const existingRecipes = getSharedRecipes();
   if (existingRecipes.length === 0) {
       const initialRecipes = recipes.map(recipe => ({
           id: generateId(),
           name: recipe.title,
           category: recipe.category,
           time: extractMinutes(recipe.prepTime),
           description: recipe.description,
           servings: 4,
           ingredients: [{ name: "See recipe details", quantity: "" }],
           image: recipe.image,
           link: recipe.link,
           isDefault: true // Mark default recipes
       }));
       saveSharedRecipes(initialRecipes);
   }
}

// Helper function to generate unique IDs
function generateId() {
   return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Helper function to extract minutes from prepTime string
function extractMinutes(prepTime) {
   const match = prepTime.match(/(\d+)/);
   return match ? parseInt(match[0]) : 30;
}

// ====================== 3. RECIPE DISPLAY FUNCTIONS ======================
let visibleCount = 4; // Number of recipes to show initially

// Create HTML for a recipe card
function createRecipeCard(recipe) {
   const card = document.createElement('div');
   card.className = 'recipe-card';
   
   // Handle both formats (default vs admin-added)
   const title = recipe.title || recipe.name;
   const description = recipe.description;
   const prepTime = recipe.prepTime || `${recipe.time} min`;
   const category = recipe.category;
   const image = recipe.image || 'images/recipe-placeholder.jpg';
   const link = recipe.link || `recipe-detail.html?id=${recipe.id}`;
   const imagePath = `${MEDIA_URL}recipe_images/${recipe.image.replace(/ /g, '_')}`;
   card.innerHTML = `
        <img src="${imagePath}" alt="${title}" 
         onerror="this.onerror=null;this.src='/static/images/placeholder.jpg'">
       <div class="recipe-info">
           <h3 class="recipe-title">${title}</h3>
           <p class="recipe-description">${description}</p>
           <div class="recipe-meta">
               <span class="prep-time"><i class="fas fa-clock"></i> ${prepTime}</span>
               <span class="category"><i class="fas fa-tag"></i> ${category}</span>
           </div>
       </div>
   `;
   
   card.addEventListener('click', () => {
       window.location.href = link;
   });
   
   return card;
}

// Main function to display recipes
function displayRecipes() {
   initializeSharedRecipes(); // Ensure we have defaults
   
   const container = document.getElementById("recipes-container");
   const showMoreBtn = document.getElementById("more-button");
   const allRecipes = getSharedRecipes();
   
   if (!container) return;
   // Clear existing cards
   container.innerHTML = '';
   
   // Get recipes to display
   const recipesToShow = allRecipes.slice(0, visibleCount);
   
   // Show message if no recipes found
   if (recipesToShow.length === 0) {
    container.innerHTML = '<div class="no-recipes"><i class="fas fa-utensils"></i><p>No recipes found yet. Be the first to add one!</p></div>';
    if (showMoreBtn) showMoreBtn.style.display = 'none';
    return;
}
   // Add recipes to container
   recipesToShow.forEach(recipe => {
    container.appendChild(createRecipeCard(recipe));
    });

   
   
  // Update recipe count if element exists
   const recipeCountElement = document.querySelector(".total-recipes-count");
   if (recipeCountElement) {
       recipeCountElement.textContent = allRecipes.length;
   }
   
   // Handle "View More" button visibility
   if (showMoreBtn) {
       showMoreBtn.style.display = visibleCount >= allRecipes.length ? 'none' : 'block';
   }
}

// ====================== 4. PAGINATION FUNCTION ======================
function showMoreRecipes() {
   visibleCount += 4;
   displayRecipes();
   
   // Smooth scroll to bottom of new recipes
   window.scrollTo({
       top: document.body.scrollHeight,
       behavior: 'smooth'
   });
}

// ====================== 5. SCROLL TO TOP FUNCTIONALITY ======================
function setupScrollButton() {
   const scrollBtn = document.getElementById("scroll");
   
   if (!scrollBtn) return;
   
   window.addEventListener('scroll', () => {
       scrollBtn.style.display = window.scrollY >= 400 ? 'block' : 'none';
   });
   
   scrollBtn.addEventListener('click', () => {
       window.scrollTo({
           top: 0,
           behavior: "smooth"
       });
   });
}

// ====================== 6. INITIALIZATION ======================
document.addEventListener("DOMContentLoaded", () => {
    // Initialize recipes if empty
    initializeSharedRecipes();
    
    // First display
    displayRecipes();
    
    // Set up "View More" button
    const showMoreBtn = document.getElementById("more-button");
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', showMoreRecipes);
        console.log("Button event listener attached");
    } else {
        console.error("View More button not found!");
    }
    
    // Set up scroll button
    setupScrollButton();
});