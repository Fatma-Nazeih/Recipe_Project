from django.urls import path
from . import views

app_name = 'recipe_finder'

urlpatterns = [
    path('', views.welcome, name='welcome'), 
    path('welcome/', views.welcome, name='welcome_alt'),
    path('signup/step1/', views.signup_step1, name='signup_step1'),
    path('signup/step2/', views.signup_step2, name='signup_step2'),
    path('signup/step3/', views.signup_step3, name='signup_step3'),
    path('check-username/', views.check_username, name='check_username'),
    path('check-email/', views.check_email, name='check_email'),

    path('login/', views.login_view, name='login'),
    path('accounts/logout/', views.logout_view, name='logout'),
    path('accounts/forgot-password/', views.forgot_password, name='forgot_password'),
    path('accounts/reset-password/<str:token>/', views.reset_password, name='reset_password'),

    path('profile/', views.profile_view, name='profile'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('edit-recipe/', views.edit_recipe, name='edit_recipe'),


    path('favorites/', views.favorites_view, name='favorites'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('search/', views.search_view, name='search2'),
    path('recipe/<int:recipe_id>/', views.recipe_detail, name='recipe_detail'),
    #path('<int:recipe_id>/', views.recipe_detail, name='recipe_detail'),
]
