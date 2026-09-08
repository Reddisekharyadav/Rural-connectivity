/**
 * Data Classification & Privacy Contracts
 */

export enum DataClassificationLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  SENSITIVE = 'SENSITIVE',
  HIGHLY_SENSITIVE = 'HIGHLY_SENSITIVE',
}

export interface MaskedFieldSpec {
  fieldName: string;
  classification: DataClassificationLevel;
  maskPattern?: (val: any) => any;
}

