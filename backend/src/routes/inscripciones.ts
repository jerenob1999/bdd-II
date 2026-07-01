import { Router, Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import Inscripcion from "../models/Inscripcion";
import Usuario from "../models/Usuario";
import Curso from "../models/Curso";


const router = Router();

interface IdParams {
  id: string;
}

// CREATE: registra una nueva inscripción, siempre activa por defecto, validando los datos
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { usuarioId, cursoId, estado, progreso } = req.body;

    if (!usuarioId || !cursoId) {
      res.status(400).json({
        error: "Faltan campos obligatorios: usuarioId y cursoId"
      });
      return;
    }

    if (!isValidObjectId(usuarioId)) {
      res.status(400).json({
        error: "usuarioId invalido"
      });
      return;
    }

    if (!isValidObjectId(cursoId)) {
      res.status(400).json({
        error: "cursoId invalido"
      });
      return;
    }

    const alumno = await Usuario.findOne({
      _id: usuarioId,
      rol: "ALUMNO",
      activo: true
    });

    if (!alumno) {
      res.status(400).json({
        error: "No existe un alumno activo con ese ID"
      });
      return;
    }

    const curso = await Curso.findOne({
      _id: cursoId,
      activo: true
    });

    if (!curso) {
      res.status(400).json({
        error: "No existe un curso activo con ese ID"
      });
      return;
    }

    const inscripcionExistente = await Inscripcion.findOne({
      usuarioId,
      cursoId,
      activo: true
    });

    if (inscripcionExistente) {
      res.status(400).json({
        error: "El alumno ya está inscripto en ese curso"
      });
      return;
    }

    const estadosValidos = ["ACTIVA", "FINALIZADA", "BAJA"];

    if (estado && !estadosValidos.includes(estado)) {
      res.status(400).json({
        error: "Estado invalido. Debe ser ACTIVA, FINALIZADA o BAJA"
      });
      return;
    }

    if (
      progreso !== undefined &&
      (typeof progreso !== "number" || progreso < 0 || progreso > 100)
    ) {
      res.status(400).json({
        error: "El progreso debe ser un número entre 0 y 100"
      });
      return;
    }

    const documento = await Inscripcion.create({
      usuarioId,
      cursoId,
      fechaInscripcion: new Date(),
      estado: estado || "ACTIVA",
      progreso: progreso ?? 0,
      activo: true
    });

    res.status(201).json(documento);
  } catch (err) {
    next(err);
  }
});


// READ: lista solo documentos activos (respeta la baja logica)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentos = await Inscripcion.find({ activo: true });
    res.json(documentos);
  } catch (err) {
    next(err);
  }
});

// READ: un documento puntual, solo si esta activo
router.get("/:id", async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "ID invalido" });
      return;
    }
    const documento = await Inscripcion.findOne({ _id: req.params.id, activo: true });
    if (!documento) {
      res.status(404).json({ error: "No encontrado" });
      return;
    }
    res.json(documento);
  } catch (err) {
    next(err);
  }
});

// UPDATE: actualiza campos especificos de un registro activo
router.put("/:id", async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "ID invalido" });
      return;
    }

    const cambios = { ...req.body };
    delete cambios._id;
    delete cambios.activo; // la baja/alta logica se maneja solo por DELETE

    if (Object.keys(cambios).length === 0) {
      res.status(400).json({ error: "No se enviaron campos para actualizar" });
      return;
    }

    const documentoActualizado = await Inscripcion.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      { $set: cambios },
      { new: true }
    );

    if (!documentoActualizado) {
      res.status(404).json({ error: "No encontrado o dado de baja" });
      return;
    }
    res.json(documentoActualizado);
  } catch (err) {
    next(err);
  }
});

// DELETE (logico): desactiva el documento sin borrarlo fisicamente
router.delete("/:id", async (req: Request<IdParams>, res: Response, next: NextFunction) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "ID invalido" });
      return;
    }

    const documentoActualizado = await Inscripcion.findOneAndUpdate(
      { _id: req.params.id, activo: true },
      { $set: { activo: false } },
      { new: true }
    );

    if (!documentoActualizado) {
      res.status(404).json({ error: "No encontrado o ya estaba dado de baja" });
      return;
    }
    res.json({ mensaje: "Documento dado de baja correctamente", documento: documentoActualizado });
  } catch (err) {
    next(err);
  }
});

export default router;
