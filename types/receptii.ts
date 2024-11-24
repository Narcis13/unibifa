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

  export interface ListaReceptii {
    id: number;
    idAngajament: number;
    idFurnizor: number;
    idCompartiment: number;
    datafact: string | Date;
    valoare: number | string;
    mentiuni: string | null;
    nrfact?: string;
    stare: string;
    created_at: string | Date;
    updated_at: string | Date | null;
    furnizor: {
      id: number;
      denumire: string;
      // Add other furnizor properties from your Prisma schema if needed
    };
  }

  export interface ReceptionResponse {
    success: boolean;
    data: {
      id: number;
      nrfact: string;
      datafact: Date;
      valoare: number;
      mentiuni: string | null;
      stare: string;
      created_at: Date;
      furnizor: {
        denumire: string;
        codfiscal: string;
      };
      compartiment: string;
      angajament: {
        id: number;
        numar: string;
        descriere: string;
        exercitiuBugetar: number;
        categorie: {
          denumire: string;
          sursaFinantare: {
            denumire: string;
            cod: string;
          };
          articolBugetar: {
            denumire: string;
            cod: string;
          };
        };
      };
      ordonantare: {
        numar: string;
        data: Date;
        stare: string;
        valoare: number;
      } | null;
    }[];
  }