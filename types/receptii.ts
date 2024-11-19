export interface Receptie {
    id?: number
    idAngajament: number 
    idFurnizor: number | null
    datafact: string
    nrfact:string
    valoare: number
    mentiuni?: string
    stare: string
    idCompartiment: number
  }
  
  export interface TableColumn {
    name: string
    label: string
    field: string | ((row: any) => any)
    required?: boolean
    align?: string
    sortable?: boolean
    sort?: (a: any, b: any) => number
  }