// types/bugete.ts
export interface Buget {
    id: number
    idSursa: number
    sursaFinantare: {
      id: number
      denumire: string
    }
    idArticol: number
    articolBugetar: {
      id: number
      cod: string
      denumire: string
    }
    explicatii: string
    trimI: number
    trimII: number
    trimIII: number
    trimIV: number
    total: number
    created_at: string
    lastUpdated: string
  }