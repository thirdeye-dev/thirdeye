export enum PresetAlertParamType {
  String = "STR",
  Integer = "INTEGER",
  Float = "FLOAT",
  Boolean = "BOOLEAN",
  Date = "DATE",
}

export interface PresetAlertParam {
  name: string;
  description: string;
  type: PresetAlertParamType;
  default?: string | number | boolean;
}

export default interface PresetAlert {
  name: string;
  description: string;
  params: PresetAlertParam[];
  alert_yaml: string;
}
