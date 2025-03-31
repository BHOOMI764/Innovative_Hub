"""
URL configuration for innovative_hub_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from projects.views import ProjectViewSet, TestimonialViewSet, LeaderboardEntryViewSet, UserRegistrationView, UserProfileView, ProjectSubmissionView, ProjectVoteView, CommentView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'leaderboard', LeaderboardEntryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/token/', obtain_auth_token, name='api_token_auth'),
    path('api/auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
    path('api/projects/submit/', ProjectSubmissionView.as_view(), name='project-submit'),
    path('api/projects/<int:project_id>/vote/', ProjectVoteView.as_view(), name='project-vote'),
    path('api/projects/<int:project_id>/comments/', CommentView.as_view(), name='project-comments'),
]
