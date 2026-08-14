/* Valores de género permitidos por el API (ver /me/profile en Swagger) */
export type Gender = "masculino" | "femenino" | "otro";

/* Datos que se envían al completar/actualizar el perfil (PUT /me/profile) */
export type ProfileInput = {
  firstName: string;
  lastName: string;
  cedula: string;
  gender: Gender;
  birthDate: string; // formato YYYY-MM-DD
};

/* Cuenta devuelta por el API tras completar el perfil (subset del schema User) */
export type ProfileUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cedula: string;
  gender: Gender;
  birthDate: string;
  profileCompleted: boolean;
};
