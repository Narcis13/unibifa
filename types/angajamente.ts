export interface Angajament {
  id: number
  numar: string
  data: Date
  idCategorie: number
  idCompartiment: number
  descriere: string
  exercitiuBugetar: number
  categorie?: {
    id: number
    denumire: string
    sursaFinantare: {
      id: number
      denumire: string
    }
    articolBugetar: {
      id: number
      denumire: string
    }
  }
  compartiment?: {
    id: number
    denumire: string
  }
  modificari?: ModificareAngajament[]
}

export interface ModificareAngajament {
  id: number
  idAngajament: number
  tipModificare: 'MAJORARE' | 'DIMINUARE'
  suma: number
  motiv: string
  idUser: number
  sumaBuget: number
  disponibilBugetar: number
  vizaCFPP: boolean
  nr_viza?: string
  dataCFPP?: Date
  created_at: Date
  user?: {
    id: number
    name: string
  }
}

export interface CreateAngajamentDTO {
  idCategorie: number
  idCompartiment: number
  descriere: string
  exercitiuBugetar: number
  sumaInitiala: number
}

export interface ModificareAngajamentDTO {
  tipModificare: 'MAJORARE' | 'DIMINUARE'
  suma: number
  motiv: string
}
