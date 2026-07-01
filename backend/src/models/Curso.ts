import { Schema, model } from "mongoose";

interface IModulo {
  titulo: string;
  duracionHoras: number;
}

export interface ICurso {
  nombre: string;
  descripcion?: string;
  docenteId?: Schema.Types.ObjectId;
  fechaInicio?: Date;
  fechaFin?: Date;
  modulos?: IModulo[];
  activo: boolean;
}

const ModuloSchema = new Schema<IModulo>(
  {
    titulo: { type: String, required: true },
    duracionHoras: { type: Number, required: true },
  },
  { _id: false }
);

const CursoSchema = new Schema<ICurso>({
  nombre: { type: String, required: true },
  descripcion: String,
  docenteId: Schema.Types.ObjectId,
  fechaInicio: Date,
  fechaFin: Date,
  modulos: [ModuloSchema],
  activo: { type: Boolean, default: true },
});

export default model<ICurso>("Curso", CursoSchema, "cursos");
