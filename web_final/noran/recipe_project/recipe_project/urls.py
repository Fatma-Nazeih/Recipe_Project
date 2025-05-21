from django.urls import path, include

urlpatterns = [
    path('', include('recipe_finder.urls')),
]
