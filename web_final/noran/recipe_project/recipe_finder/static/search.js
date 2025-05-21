// const recipes = [
//     {
//         id: 1,
//         title: "Tomato Chicken Pasta",
//         image: "images/Tomato Chicken Pasta.jpeg",
//         description: "Hearty pasta with chicken in rich tomato sauce",
//         prepTime: "30-50 mins",
//         category: "Main Course",
//         ingredients: "Chicken,\nPasta, Tomato sauce, Parmesan"
//         ,link: "tomatoChickenPasta.html"
//     },
//     {
//         id: 2,
//         title: "Chicken Fajitas",
//         image: "images/Chicken Fajitas.jpeg",
//         description: "Spiced chicken strips with bell peppers and onions",
//         prepTime: "40-50 mins",
//         category: "Main Course",
//         ingredients: "Chicken,\nBell peppers, Onion, Cilantro"
//         ,link: "chickenFajitas.html"
//     },
//     {
//         id: 101,
//         title: "Chicken Alfredo",
//         image: "images/ChickenAlfredo.avif",
//         description: "A creamy, delicious Chicken Alfredo pasta dish that's easy to make and perfect for a cozy dinner.",
//         prepTime: "30 min",
//         category: "Main Course",
//         ingredients: "Chicken breast,\nFettuccine pasta,\nHeavy cream,\nParmesan cheese",
//         link: "ChickenAlfredo.html"
//     },
//     {
//         id: 102,
//         title: "Classic Cheeseburger",
//         image: "images/burger.jpeg",
//         description: "A juicy grilled beef patty topped with melted cheese, fresh lettuce, tomatoes, pickles.",
//         prepTime: "1 hr",
//         category: "Main Course",
//         ingredients: "Ground beef,\nBurger buns,\nCheddar cheese,\nLettuce",
//         link: "burger.html"
//     },
//     {
//         id: 105,
//         title: "Grilled Steak with Garlic Butter",
//         image: "images/steak.jpg",
//         description: "A perfectly grilled, juicy steak topped with a rich garlic butter sauce.",
//         prepTime: "1 hr 20 min",
//         category: "Main Course",
//         ingredients: "Ribeye steak,\nButter,\nGarlic",
//         link: "steak.html"
//     },
//     {
//         id: 3,
//         title: "Pepperoni Pizza",
//         image: "images/pizza.jpeg",
//         description: "Classic pizza with pepperoni and melted cheese",
//         prepTime: "2 hr",
//         category: "Main Course",
//         ingredients: "Pizza dough,\nTomato sauce, Mozzarella, Pepperoni, Basil"
//         ,link: "PepperoniPizza.html"
//     },
//     {
//         id: 4,
//         title: "Pizza Margherita",
//         image: "images/Pizza Margherita Recipe.jpeg",
//         description: "Traditional Italian pizza with fresh basil",
//         prepTime: "2 hr",
//         category: "Main Course",
//         ingredients: "Pizza dough,\nTomatoes, Mozzarella, Basil"
//         ,link: "margherita.html"
//     },
//     {
//         id: 5,
//         title: "Lasagna alla bolognese",
//         image: "images/lasagna.jpeg",
//         description: "Layered pasta with meat sauce and cheese",
//         prepTime: "1 hr 10 mins",
//         category: "Main Course",
//         ingredients: "Pasta sheets,\nGround beef, Tomato sauce, Bechamel"
//         ,link: "lasagna.html"
//     },
//     {
//         id: 6,
//         title: "Honey Chicken Wings",
//         image: "images/Honey Chicken Wings.jpeg",
//         description: "Crispy wings glazed with honey sauce",
//         prepTime: "40 mins",
//         category: "Appetizer",
//         ingredients: "Chicken wings,\nHoney, Soy sauce, Garlic"
//         ,link: "wings.html"
//     },
//     {
//         id: 7,
//         title: "Goat Cheese Bruschetta",
//         image: "images/Goat Cheese Bruschetta.jpeg",
//         description: "Toasted baguette with goat cheese and tomatoes",
//         prepTime: "15-30 mins",
//         category: "Appetizer",
//         ingredients: "Baguette,\nGoat cheese, Tomatoes, Basil"
//         ,link: "cheeseBruschetta.html"
//     },
//     {
//         id: 8,
//         title: "Pancakes",
//         image: "images/pancake.jpeg",
//         description: "Fluffy pancakes with syrup and toppings",
//         prepTime: "20-30 mins",
//         category: "Dessert",
//         ingredients: "Flour,\nMilk, Eggs, Butter, Sugar"
//         ,link: "pancakes.html"
//     },
//     {
//         id: 9,
//         title: "Tiramisu",
//         image: "images/Tiramisu.jpeg",
//         description: "Italian coffee-flavored dessert",
//         prepTime: "2 hr",
//         category: "Dessert",
//         ingredients: "Ladyfingers,\nMascarpone, Coffee, Cocoa, Eggs"
//         ,link: "tiramisu.html"
//     },
//     {
//         id: 10,
//         title: "Cheesecake",
//         image: "images/cheesecake.jpeg",
//         description: "Creamy dessert with graham cracker crust",
//         prepTime: "1 hr 10 mins",
//         category: "Dessert",
//         ingredients: "Graham crackers,\nCream cheese, Sugar, Eggs, Vanilla"
//         ,link: "cheeseCake.html"
//     },
//     {
//         id: 11,
//         title: "Japanese Cheesecake",
//         image: "images/Japanese Cheesecake.jpeg",
//         description: "Light and fluffy Japanese-style cheesecake",
//         prepTime: "1 hr 20 mins",
//         category: "Dessert",
//         ingredients: "Cream cheese,\nEggs, Sugar, Milk, Butter"
//         ,link: "japCheesecake.html"
//     },
//     {
//         id: 12,
//         title: "Chocolate Cake",
//         image: "images/chocolate cake.jpeg",
//         description: "Decadent chocolate layered cake",
//         prepTime: "50-60 mins",
//         category: "Dessert",
//         ingredients: "Flour,\nCocoa powder, Sugar, Eggs, Butter"
//         ,link: "chocoCake.html"
//     },
//     {
//         id: 106,
//         title: "Chocolate Lava Cake",
//         image: "images/cake.jpg",
//         description: "A decadent dessert with a warm, gooey chocolate center that oozes out when you cut into it.",
//         prepTime: "50 min",
//         category: "Dessert",
//         ingredients: "Dark chocolate,\nButter,\nEggs,\nSugar,\nFlour",
//         link: "cake.html"
//     }
// ];


// ====================== 1. RECIPE STORAGE SYSTEM ======================
const SHARED_RECIPES_KEY = "sharedRecipes";

function setupScrollButton() {
    const scrollBtn = document.getElementById("scroll");
    
    window.addEventListener('scroll', () => {
        scrollBtn.style.display = window.scrollY >= 400 ? 'block' : 'none';
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupScrollButton();
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.focus();
});