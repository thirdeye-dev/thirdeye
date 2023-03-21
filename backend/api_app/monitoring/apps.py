from django.apps import AppConfig


class MonitoringConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api_app.monitoring"

    def ready(self):
        import api_app.monitoring.signals
