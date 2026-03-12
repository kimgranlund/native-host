export interface ApiAttributeRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ApiEventRow {
  event: string;
  detail: string;
  description: string;
}

export interface ApiSlotRow {
  slot: string;
  description: string;
}

export interface ApiSelectorRow {
  selector: string;
  target?: string;
  description: string;
}

export interface ApiKeyboardRow {
  key: string;
  action: string;
}

export interface ApiAccessibilityRow {
  property: string;
  value: string;
}

export interface ApiMethodRow {
  method: string;
  returns?: string;
  description: string;
}

export interface ApiPropertyRow {
  property: string;
  type: string;
  description: string;
}

export interface ApiCssPropertyRow {
  property: string;
  default: string;
  description: string;
}

export type ApiSection =
  | { kind: 'attributes'; title?: string; rows: ApiAttributeRow[] }
  | { kind: 'slots'; rows: ApiSlotRow[] }
  | { kind: 'events'; rows: ApiEventRow[] }
  | { kind: 'selectors'; title?: string; rows: ApiSelectorRow[] }
  | { kind: 'keyboard'; rows: ApiKeyboardRow[] }
  | { kind: 'accessibility'; rows: ApiAccessibilityRow[] }
  | { kind: 'properties'; rows: ApiPropertyRow[] }
  | { kind: 'methods'; rows: ApiMethodRow[] }
  | { kind: 'css-properties'; rows: ApiCssPropertyRow[] }
  | { kind: 'provider-usage'; rows: ApiAttributeRow[] };

export interface ApiReference {
  element: string;
  sections: ApiSection[];
}
