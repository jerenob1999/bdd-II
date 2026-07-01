import { Schema, model } from "mongoose";

export interface IEntrega {
  usuarioId: Schema.Types.ObjectId;
  cursoId: Schema.Types.ObjectId;
  actividad: string;
  fechaEntrega?: Date;
  estado?: string;
  calificacion?: number | null;
  observaciones?: string | null;
  activo: boolean;
}

const EntregaSchema = new Schema<IEntrega>({
  usuarioId: { type: Schema.Types.ObjectId, required: true },
  cursoId: { type: Schema.Types.ObjectId, required: true },
  actividad: { type: String, required: true },
  fechaEntrega: { type: Date, default: Date.now },
  estado: String,
  calificacion: Number,
  observaciones: String,
  activo: { type: Boolean, default: true },
});

export default model<IEntrega>("Entrega", EntregaSchema, "entregas");
