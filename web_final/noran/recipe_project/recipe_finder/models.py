from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    avatar = models.URLField(default='https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg')
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    cuisine_specialty = models.CharField(max_length=200, blank=True)
    interests = models.CharField(max_length=200, blank=True)
    join_date = models.DateTimeField(null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    reset_token = models.CharField(max_length=100, null=True, blank=True)
    reset_token_expiry = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username
    
class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} - {self.quantity}"

class Recipe(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(
    max_length=100,
    choices=[
        ('Appetizer', 'Appetizer'),
        ('Main Course', 'Main Course'),
        ('Dessert', 'Dessert'),
    ]
    )
    time = models.PositiveBigIntegerField(help_text="Preparation time in minutes")
    description = models.TextField(blank=True)
    servings = models.PositiveIntegerField(default=1)
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    ingredients = models.ManyToManyField(Ingredient, related_name='recipes')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    # Create your models here.
class Recipe(models.Model):
    CATEGORY_CHOICES = [
        ('Main Course', 'Main Course'),
        ('Appetizer', 'Appetizer'),
        ('Dessert', 'Dessert'),
    ]
    id = models.IntegerField(primary_key=True, verbose_name="Recipe ID")
    title = models.CharField(max_length=200)
    description = models.TextField()
    prep_time = models.CharField(max_length=50)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image = models.ImageField(
    upload_to='recipe_images/',
    default='recipe_images/default.png',  
    null=True,
    blank=True
)
    ingredients = models.TextField()
    instructions = models.TextField(blank=True)
    link = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    is_default = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.id}: {self.title}"

    class Meta:
        verbose_name = "Recipe"
        verbose_name_plural = "Recipes"
        ordering = ['id'] 