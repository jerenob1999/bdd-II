import { Schema, model } from "mongoose";

export interface IUsuario {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  fechaAlta?: Date;
  activo: boolean;
}

const UsuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true },
  rol: { type: String, required: true },
  fechaAlta: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
});

export default model<IUsuario>("Usuario", UsuarioSchema, "usuarios");
