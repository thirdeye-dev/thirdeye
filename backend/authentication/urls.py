from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginAPIView, GoogleLoginCallbackView, GithubLoginCallbackView, LogoutAPIView, MeAPIView, github_login, google_login

urlpatterns = [
    path("login", LoginAPIView.as_view(), name="login"),
    path("logout", LogoutAPIView.as_view(), name="logout"),
    # path("register", RegisterView.as_view(), name="register"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("google", google_login, name="oauth_google"),
    path(
        "google-callback",
        GoogleLoginCallbackView.as_view(),
        name="oauth_google_callback",
    ),
    path("github", github_login, name="oauth_github"),
    path(
        "github-callback",
        GithubLoginCallbackView.as_view(),
        name="oauth_github_callback",
    ),
    path(
        "me",
        MeAPIView.as_view(),
        name="my-user-info",
    ),
]
