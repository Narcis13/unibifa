import { TipDocument, StatusPlata } from '@prisma/client'

export interface FacturaPrimitaDTO {
  // Required fields
  idFurnizor: number
  numarFactura: string
  dataFactura: Date | string
  valoare: number

  // Optional fields
  detaliiFactura?: string
  
  // Budget and financial references
  idArticolBugetar?: number
  idSursaFinantare?: number
  
  // Payment and receipt references
  idOrdonantare?: number
  idReceptie?: number
  
  // Departmental reference
  idCompartiment?: number
  
  // Additional tracking fields
  tipDocument?: TipDocument
  termenPlata?: Date | string
  statusPlata?: StatusPlata
  
  // Status tracking
  stare?: string
}