from authlib.integrations.django_client import OAuth
from django.conf import settings

oauth = OAuth()
if "google" in settings.AUTHLIB_OAUTH_CLIENTS:
    GOOGLE_CONF_URL = "https://accounts.google.com/.well-known/openid-configuration"
    oauth.register(
        name="google",
        server_metadata_url=GOOGLE_CONF_URL,
        client_kwargs={"scope": "openid email profile"},
    )

# GitHub OAuth setup
if "github" in settings.AUTHLIB_OAUTH_CLIENTS:
    GITHUB_CLIENT_ID = settings.AUTHLIB_OAUTH_CLIENTS["github"]["client_id"]
    GITHUB_CLIENT_SECRET = settings.AUTHLIB_OAUTH_CLIENTS["github"]["client_secret"]
    oauth.register(
        name="github",
        client_id=GITHUB_CLIENT_ID,
        client_secret=GITHUB_CLIENT_SECRET,
        authorize_url="https://github.com/login/oauth/authorize",
        access_token_url="https://github.com/login/oauth/access_token",
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "user:email"},
    )
