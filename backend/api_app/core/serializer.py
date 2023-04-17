import hashlib
import json
import logging
import os
import sys

from cache_memoize import cache_memoize
from django.conf import settings
from rest_framework import serializers as rfs

logger = logging.getLogger(__name__)


class PreWrittenAlertsSerializer(rfs.Serializer):
    name = rfs.CharField(required=True)
    description = rfs.CharField(required=True)
    params = rfs.JSONField(required=True)
    alert_yaml = rfs.CharField(required=True)

    CONFIG_FILE_NAME = "iocs.json"

    @classmethod
    def _get_config_path(cls) -> str:
        return os.path.join(settings.BASE_DIR, "configuration", cls.CONFIG_FILE_NAME)

    @classmethod
    def _get_yaml_path(cls, yaml_path) -> str:
        return os.path.join(settings.BASE_DIR, "configuration/yaml", yaml_path)

    @classmethod
    def _read_config(cls):
        config_path = cls._get_config_path()
        with open(config_path) as f:
            config_dict = json.load(f)
        return config_dict

    @classmethod
    def _md5_config_file(cls, fpath) -> str:
        """
        Returns md5sum of config file.
        """
        with open(fpath, "r") as fp:
            buffer = fp.read().encode("utf-8")
            md5hash = hashlib.md5(buffer).hexdigest()
        return md5hash

    @classmethod
    def _verify_params(cls, params):
        for param in params:
            param_dict = params.get(param)
            if param_dict.get("type") not in ["int", "str", "float"]:
                raise rfs.ValidationError(
                    f"Invalid type {param_dict.get('type')} for param {param_dict.get('name')}"
                )

    @classmethod
    def create_yaml(cls, name: str, param_values: dict):
        compiled_parameters = cls.verify_parameters_given(name, param_values)
        yaml_content = cls._get_alert_yaml(name)
        for param in compiled_parameters:
            yaml_content = yaml_content.replace(
                f"${{{param}}}", str(compiled_parameters.get(param))
            )

        return yaml_content

    @classmethod
    def verify_parameters_given(cls, name: str, param_values: dict):
        # data contains the name of the values of the parameters
        # check if the parameters are valid
        config_dict = cls.read_and_verify_config()
        alert_config = config_dict.get(name)
        if alert_config is None:
            raise rfs.ValidationError(f"Invalid alert name {name}")

        compiled_parameters = {}

        params = alert_config.get("params")
        for param in params:
            param_dict = params.get(param)
            if param not in param_values:
                param_default = param_dict.get("default")
                if param_default is not None:
                    compiled_parameters[param] = param_default
                    continue
                raise rfs.ValidationError(f"Missing parameter {param}")

            param_type = param_dict.get("type")
            param_value = param_values.get(param)

            _type = {"int": int, "str": str, "float": float}.get(param_type, None)

            if _type is None:
                raise rfs.ValidationError(
                    f"Invalid type {param_type} for parameter {param}"
                )

            try:
                _type(param_value)
            except ValueError:
                raise rfs.ValidationError(
                    f"Invalid value {param_value} for parameter {param}"
                )

            compiled_parameters[param] = param_value

        return compiled_parameters

    @classmethod
    @cache_memoize(
        timeout=sys.maxsize,
    )
    def _get_alert_yaml(cls, name):
        config_dict = cls._read_config()
        name_of_alert = config_dict.get(name)
        if name_of_alert is None:
            raise rfs.ValidationError(f"Invalid alert name {name}")

        yaml_file_path = name_of_alert.get("alert_yaml")
        yaml_path = cls._get_yaml_path(yaml_file_path)
        with open(yaml_path) as f:
            yaml_content = f.read()
        return yaml_content

    @classmethod
    def _in_frontend_format(cls):
        config_dict = cls.read_and_verify_config()
        frontend_format = []
        for key, config in config_dict.items():
            params = config.get("params")
            params_list = []
            for param in params:
                param_dict = params.get(param)
                param_dict["type"] = param_dict.get("type", "str").upper()
                params_list.append(param_dict)
            config["params"] = params_list
            frontend_format.append({"name": key, **config})
        return frontend_format

    @classmethod
    @cache_memoize(
        timeout=sys.maxsize,
        args_rewrite=lambda cls: f"{cls.__name__}-{cls._md5_config_file(cls._get_config_path())}",
    )
    def read_and_verify_config(cls) -> dict:
        """
        Returns verified config.
        This function is memoized for the md5sum of the JSON file.
        """
        config_dict = cls._read_config()

        serializer_errors = {}
        for key, config in config_dict.items():
            new_config = {"name": key, **config}
            serializer = cls(data=new_config)
            if serializer.is_valid():
                cls._verify_params(serializer.validated_data.get("params"))
                config_dict[key] = serializer.data
                config_dict[key]["alert_yaml"] = cls._get_alert_yaml(key)
            else:
                serializer_errors[key] = serializer.errors

        if bool(serializer_errors):
            logger.error(f"{cls.__name__} serializer failed: {serializer_errors}")
            raise rfs.ValidationError(serializer_errors)

        return config_dict
