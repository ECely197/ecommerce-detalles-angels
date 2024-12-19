// user.model.ts
export interface User {
    _id:string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    avatar?: string, // Propiedad opcional
}
export interface RegisterData {
    email: string;
    password: string;
    firstname: string; // Cambiado a obligatorio
    lastname: string;  // Cambiado a obligatorio
  }
  
  export interface RegisterResponse {
    user: User; // Asegúrate de que esto esté correcto
    token: string; // Agrega esta línea
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  