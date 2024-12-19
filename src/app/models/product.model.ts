

export interface Producto {
    _id?: string;
    tipo: string
    nombre: string;
    precio: number;
    images: string[];
    descripcionOne: string;
    descripcionTwo:string;
    categoriaId?: string;
    material?: string;
    dimensions?: string;
    stock?: number;
    shippingTime?: string;
    marca?: string; // Nueva propiedad
    fechaDeLanzamiento?: Date; // Nueva propiedad
  }
  
  
  