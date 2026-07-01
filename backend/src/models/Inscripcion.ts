import { Schema, model } from "mongoose";

export interface IInscripcion {
  usuarioId: Schema.Types.ObjectId;
  cursoId: Schema.Types.ObjectId;
  fechaInscripcion?: Date;
  estado?: string;
  progreso?: number;
  activo: boolean;
}

const InscripcionSchema = new Schema<IInscripcion>({
  usuarioId: { type: Schema.Types.ObjectId, required: true },
  cursoId: { type: Schema.Types.ObjectId, required: true },
  fechaInscripcion: Date,
  estado: String,
  progreso: Number,
  activo: { type: Boolean, default: true },
});

export default model<IInscripcion>("Inscripcion", InscripcionSchema, "inscripciones");
