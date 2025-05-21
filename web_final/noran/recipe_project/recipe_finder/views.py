import os
from django.shortcuts import render, redirect , get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponseRedirect
from .models import UserProfile , Recipe , Ingredient
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.db.models import Q
import json
import uuid
import datetime

def welcome(request):
    return render(request, 'welcome.html')

@csrf_exempt
def check_username(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('value', '').strip()
            exists = User.objects.filter(username__iexact=username).exists()
            return JsonResponse({
                'available': not exists,
                'message': 'Username already taken' if exists else ''
            })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def check_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('value', '').strip()
            exists = User.objects.filter(email__iexact=email).exists()
            return JsonResponse({
                'available': not exists,
                'message': 'Email already registered' if exists else ''
            })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def signup_step1(request):
    if request.user.is_authenticated:
        return redirect('recipe_finder:profile')

    if request.method == 'POST':
        signup_data = {
            'username': request.POST.get('username', '').strip(),
            'email': request.POST.get('email', '').strip(),
            'password': request.POST.get('password', ''),
            'role': request.POST.get('role', 'user'),
        }
        confirm_password = request.POST.get('confirm_password', '')

        if not signup_data['username'] or not signup_data['email'] or not signup_data['password'] or not confirm_password:
            return JsonResponse({'success': False, 'error': 'All fields are required.'})

        if User.objects.filter(username__iexact=signup_data['username']).exists():
            return JsonResponse({'success': False, 'error': 'Username already taken'})
        if User.objects.filter(email__iexact=signup_data['email']).exists():
            return JsonResponse({'success': False, 'error': 'Email already registered'})
        if signup_data['password'] != confirm_password:
            return JsonResponse({'success': False, 'error': 'Passwords do not match'})

        request.session['signup_data'] = {
            'username': signup_data['username'],
            'email': signup_data['email'],
            'password': signup_data['password'],
            'role': signup_data['role'],
        }

        return JsonResponse({'success': True, 'next_url': reverse('recipe_finder:signup_step2')})

    request.session.pop('signup_data', None)
    return render(request, 'signup.html', {'step': 1})


def signup_step2(request):
    if request.user.is_authenticated:
        return redirect('recipe_finder:profile')
    signup_data = request.session.get('signup_data')
    if not signup_data or 'username' not in signup_data:
        messages.warning(request, 'Please start the signup process from the beginning.')
        return redirect('recipe_finder:signup_step1')

    cuisines_options = ['Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'French', 'Thai', 'American', 'Mediterranean', 'Middle Eastern', 'Other']

    if request.method == 'POST':
        cuisines = request.POST.getlist('cuisines')
        signup_data.update({
            'avatar': request.POST.get('avatar', 'https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg'),
            'location': request.POST.get('location', '').strip(),
            'bio': request.POST.get('bio', '').strip(),
            'cuisines': ','.join(cuisines) if cuisines else '',
        })
        request.session['signup_data'] = signup_data

        return redirect('recipe_finder:signup_step3')

    form_data = request.session.get('signup_data', {})
    form_data['cuisines_list'] = form_data.get('cuisines', '').split(',') if form_data.get('cuisines') else []

    return render(request, 'signup.html', {
        'step': 2,
        'cuisines_options': cuisines_options,
        'form_data': form_data,
    })


def signup_step3(request):
    if request.user.is_authenticated:
        return redirect('recipe_finder:profile')
    signup_data = request.session.get('signup_data')
    if not signup_data or 'bio' not in signup_data:
        messages.warning(request, 'Please complete the previous steps to sign up.')
        return redirect('recipe_finder:signup_step1')

    display_cuisines = signup_data.get('cuisines', '').split(',') if signup_data.get('cuisines') else []
    form_data_for_template = {**signup_data, 'cuisines': display_cuisines}

    if request.method == 'POST':
        try:
            if User.objects.filter(username__iexact=signup_data['username']).exists():
                messages.error(request, 'Username already taken. Please go back to Step 1.')
                return render(request, 'signup.html', {
                    'step': 3,
                    'form_data': form_data_for_template,
                    'error': 'Username already taken.',
                })
            if User.objects.filter(email__iexact=signup_data['email']).exists():
                messages.error(request, 'Email already registered. Please go back to Step 1.')
                return render(request, 'signup.html', {
                    'step': 3,
                    'form_data': form_data_for_template,
                    'error': 'Email already registered.',
                })

            user = User.objects.create_user(
                username=signup_data['username'],
                email=signup_data['email'],
                password=signup_data['password']
            )

            UserProfile.objects.create(
                user=user,
                is_admin=signup_data.get('role') == 'admin',
                avatar=signup_data.get('avatar', 'https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg'),
                location=signup_data.get('location', ''),
                bio=signup_data.get('bio', ''),
                cuisine_specialty=signup_data.get('cuisines', ''),
                join_date=timezone.now(),
                last_login=timezone.now(),
            )

            login(request, user)

            request.session.pop('signup_data', None)

            messages.success(request, f'Account created successfully for {user.username}! Welcome to Recipe Finder.')

            return redirect('recipe_finder:profile')

        except Exception as e:
            messages.error(request, f'An error occurred during signup: {e}')
            return render(request, 'signup.html', {
                'step': 3,
                'form_data': form_data_for_template,
                'error': str(e),
            })

    return render(request, 'signup.html', {
        'step': 3,
        'form_data': form_data_for_template,
    })


def login_view(request):
    if request.user.is_authenticated:
        return redirect('recipe_finder:dashboard')

    if request.method == 'POST':
        identifier = request.POST.get('identifier', '').strip()
        password = request.POST.get('password', '')

        user = authenticate(request, username=identifier, password=password)
        if user is None:
            try:
                temp_user = User.objects.get(email__iexact=identifier)
                user = authenticate(request, username=temp_user.username, password=password)
            except User.DoesNotExist:
                pass

        if user is not None:
            login(request, user)

            try:
                profile = user.userprofile
                profile.last_login = timezone.now()
                profile.save()
            except UserProfile.DoesNotExist:
                print(f"Warning: User {user.username} logged in but has no UserProfile.")
                pass

            return JsonResponse({'success': True, 'redirect_url': reverse('recipe_finder:dashboard')})

        else:
            return JsonResponse({'success': False, 'error': 'Invalid email/username or password'})

    messages_list = []
    for message in messages.get_messages(request):
        pass

    return render(request, 'login.html')


def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('recipe_finder:welcome')


def forgot_password(request):
    if request.user.is_authenticated:
        return redirect('recipe_finder:profile')

    if request.method == 'POST':
        email = request.POST.get('email', '').strip()

        if not email:
            return JsonResponse({'success': False, 'error': 'Please enter your email address.'})

        try:
            user = User.objects.get(email__iexact=email)
            profile = user.userprofile

            token = str(uuid.uuid4())

            profile.reset_token = token
            profile.reset_token_expiry = timezone.now() + datetime.timedelta(hours=1)
            profile.save()

            reset_url_full = request.build_absolute_uri(reverse('recipe_finder:reset_password', args=[token]))
            print(f"Password reset link for {user.email}: {reset_url_full}")

            reset_url = reverse('recipe_finder:reset_password', args=[token])
            return JsonResponse({'success': True, 'redirect_url': reset_url, 'message': 'Password reset link generated.'})


        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Email not found'})
        except UserProfile.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User profile not found for this email.'})
        except Exception as e:
            print(f"Error in forgot_password: {e}")
            return JsonResponse({'success': False, 'error': f'An unexpected error occurred: {e}'})

    return render(request, 'forgot-password.html')


def reset_password(request, token):
    if request.user.is_authenticated:
        return redirect('recipe_finder:profile')

    try:
        profile = UserProfile.objects.get(reset_token=token, reset_token_expiry__gt=timezone.now())
        user_to_reset = profile.user
    except UserProfile.DoesNotExist:
        messages.error(request, 'Invalid or expired password reset token. Please try requesting a new password reset.')
        return redirect('recipe_finder:forgot_password')

    if request.method == 'POST':
        new_password = request.POST.get('new-password', '')
        confirm_password = request.POST.get('confirm-password', '')

        if not new_password or not confirm_password:
            return JsonResponse({'success': False, 'error': 'Please enter and confirm your new password.'})

        if new_password != confirm_password:
            return JsonResponse({'success': False, 'error': 'New passwords do not match'})

        user = profile.user
        user.set_password(new_password)
        user.save()

        profile.reset_token = None
        profile.reset_token_expiry = None
        profile.save()

        messages.success(request, 'Password reset successful. Please log in with your new password.')

        return JsonResponse({'success': True, 'redirect_url': reverse('recipe_finder:login')})

    return render(request, 'reset-password.html', {'token': token})


def profile_view(request):
    if not request.user.is_authenticated:
        messages.warning(request, 'Please log in to view your profile.')
        return redirect('recipe_finder:login')

    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        messages.error(request, 'Your user profile is missing. Please contact support.')
        logout(request)
        return redirect('recipe_finder:login')

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'update_profile':
            new_username = request.POST.get('full-name', '').strip()
            if new_username and new_username != request.user.username:
                if User.objects.filter(username__iexact=new_username).exists():
                    return JsonResponse({'success': False, 'error': f'Username "{new_username}" is already taken.'})
                request.user.username = new_username

            profile.bio = request.POST.get('bio', '').strip()
            profile.location = request.POST.get('location', '').strip()

            cuisines = request.POST.getlist('cuisines')
            profile.cuisine_specialty = ','.join(cuisines) if cuisines else ''

            profile.interests = request.POST.get('interests', '').strip()

            try:
                request.user.save()
                profile.save()
                return JsonResponse({'success': True, 'message': 'Profile updated successfully!'})
            except Exception as e:
                print(f"Error saving profile update: {e}")
                return JsonResponse({'success': False, 'error': f'Error saving profile: {e}'})

        elif action == 'update_avatar':
            avatar_url = request.POST.get('avatar')
            if not avatar_url:
                return JsonResponse({'success': False, 'error': 'No avatar selected.'})

            profile.avatar = avatar_url
            try:
                profile.save()
                return JsonResponse({'success': True, 'message': 'Avatar updated successfully!'})
            except Exception as e:
                print(f"Error saving avatar update: {e}")
                return JsonResponse({'success': False, 'error': f'Error saving avatar: {e}'})

        elif action == 'change_password':
            current_password = request.POST.get('current-password', '')
            new_password = request.POST.get('new-password', '')
            confirm_password = request.POST.get('confirm-password', '')

            if not current_password or not new_password or not confirm_password:
                return JsonResponse({'success': False, 'error': 'Please fill in all password fields.'})

            user_authenticated = authenticate(request, username=request.user.username, password=current_password)

            if user_authenticated is None:
                return JsonResponse({'success': False, 'error': 'Incorrect current password'})

            if new_password != confirm_password:
                return JsonResponse({'success': False, 'error': 'New passwords do not match'})

            request.user.set_password(new_password)
            request.user.save()

            login(request, request.user)

            messages.success(request, 'Your password has been changed.')

            return JsonResponse({'success': True, 'redirect_url': reverse('recipe_finder:login')})

        elif action == 'delete_account':
            try:
                user_to_delete = request.user
                logout(request)
                user_to_delete.delete()

                messages.success(request, 'Your account has been successfully deleted.')
                return JsonResponse({'success': True, 'redirect_url': reverse('recipe_finder:welcome')})
            except Exception as e:
                print(f"Error deleting account: {e}")
                return JsonResponse({'success': False, 'error': f'Error deleting account: {e}'})

        elif action == 'check_password':
            if request.method == 'POST':
                password_to_check = request.POST.get('password')
                if authenticate(request, username=request.user.username, password=password_to_check) is not None:
                    return JsonResponse({'valid': True})
                else:
                    return JsonResponse({'valid': False})
            return JsonResponse({'success': False, 'error': 'Invalid method for password check'}, status=405)

        else:
            print(f"Unknown action received in profile_view POST: {action}")
            return JsonResponse({'success': False, 'error': 'Invalid action'}, status=400)

    interests_list = []
    if profile.interests:
        interests_list = [interest.strip() for interest in profile.interests.split(',') if interest.strip()]

    cuisine_specialty_list = []
    if profile.cuisine_specialty:
        cuisine_specialty_list = [cuisine.strip() for cuisine in profile.cuisine_specialty.split(',') if cuisine.strip()]

    cuisines_options = ['Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'French', 'Thai', 'American', 'Mediterranean', 'Middle Eastern', 'Other']

    context = {
        'user': request.user,
        'profile': profile,
        'interests_list': interests_list,
        'cuisines_options': cuisines_options,
        'cuisine_specialty_list': cuisine_specialty_list,
    }
    return render(request, 'profile.html', context)

@login_required
def admin_dashboard(request):
    if not request.user.is_authenticated or not request.user.userprofile.is_admin:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('recipe_finder:profile')

    search_query = request.GET.get('search', '').strip()
    if search_query:
        recipes = Recipe.objects.filter(
            Q(name__icontains=search_query) |
            Q(category__icontains=search_query) |
            Q(ingredients__name__icontains=search_query)
        ).distinct()
    else:
        recipes = Recipe.objects.all()
        
    context = {
        'recipes': recipes,
        'search_query': search_query,
    }
    return render(request, 'adminDashboard.html', context)

@login_required
def edit_recipe(request, recipe_id=None):
    if not request.user.userprofile.is_admin:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('recipe_finder:profile')
        
    recipe = None
    if recipe_id:
        recipe = get_object_or_404(Recipe, id=recipe_id)
    
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('recipe-name', '').strip()
        category = request.POST.get('recipe-category', '').strip()
        description = request.POST.get('recipe-desc', '').strip()
        time = request.POST.get('prep-time', '0')
        servings = request.POST.get('recipe-servings', '1')
        instructions = request.POST.get('recipe-instructions', '').strip()
        ingredients_data = json.loads(request.POST.get('ingredients', '[]'))
        
        # Handle image upload - could be a file or a URL
        image = request.FILES.get('recipe-image')
        image_url = request.POST.get('recipe-image-url', '')
        
        # Validate required fields
        if not (name and category):
            return JsonResponse({
                'success': False, 
                'message': "Recipe name and category are required."
            }, status=400)
        
        try:
            time = int(time)
            servings = int(servings)
            if time <= 0 or servings <= 0:
                raise ValueError
        except ValueError:
            return JsonResponse({
                'success': False, 
                'message': "Please enter valid numbers for time and servings."
            }, status=400)
        
        # Create new recipe or update existing one
        if recipe is None:
            recipe = Recipe(user=request.user)
        
        recipe.name = name
        recipe.category = category
        recipe.description = description
        recipe.time = time
        recipe.servings = servings
        recipe.instructions = instructions
        
        # Handle image upload if provided
        if image:
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
            ext = os.path.splitext(image.name)[1].lower()
            if ext not in valid_extensions:
                return JsonResponse({
                    'success': False, 
                    'message': "Invalid image format. Please upload JPG, JPEG, PNG, or GIF."
                }, status=400)
            recipe.image = image
        elif image_url and not recipe.image:
            # Only set image_url if no file was uploaded and no existing image
            recipe.image_url = image_url
        
        recipe.save()
        
        # Clear existing ingredients first
        Ingredient.objects.filter(recipe=recipe).delete()
        
        # Add new ingredients
        for ing in ingredients_data:
            ing_name = ing.get('name', '').strip()
            ing_quantity = ing.get('quantity', '').strip()
            if ing_name:
                Ingredient.objects.create(
                    recipe=recipe, 
                    name=ing_name, 
                    quantity=ing_quantity
                )
        
        # Return success response
        return JsonResponse({
            'success': True,
            'message': 'Recipe saved successfully!',
            'image_url': recipe.image.url if recipe.image else recipe.image_url if hasattr(recipe, 'image_url') else '',
            'redirect_url': reverse('recipe_finder:admin_dashboard')
        })
    
    # Load existing ingredients for the recipe
    ingredients = []
    if recipe:
        ingredients = [{'name': ing.name, 'quantity': ing.quantity} for ing in recipe.ingredients.all()]
    
    # Render the edit form
    return render(request, 'edit-recipe.html', {
        'recipe': recipe,
        'ingredients': json.dumps(ingredients)  # Pass as JSON string for JavaScript
    })
