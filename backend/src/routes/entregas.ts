import { Router, Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import Entrega from "../models/Entrega";
import Usuario from "../models/Usuario";
import Curso from "../models/Curso";

const router = Router();

interface IdParams {
  id: string;
}

// CREATE: registra una nueva entrega, siempre activa por defecto, validando los datos
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { usuarioId, cursoId, actividad, estado, calificacion, observaciones } = req.body;

    if (!usuarioId || !cursoId || !actividad) {
      res.status(400).json({
        error: "Faltan campos obligatorios: usuarioId, cursoId y actividad"
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

    const estadosValidos = ["PENDIENTE", "CORREGIDA"];

    if (estado && !estadosValidos.includes(estado)) {
      res.status(400).json({
        error: "Estado invalido. Debe ser PENDIENTE o CORREGIDA"
      });
      return;
    }

    if (
      calificacion !== undefined &&
      calificacion !== null &&
      (typeof calificacion !== "number" || calificacion < 0 || calificacion > 10)
    ) {
      res.status(400).json({
        error: "La calificacion debe ser un numero entre 0 y 10"
      });
      return;
    }

    const documento = await Entrega.create({
      usuarioId,
      cursoId,
      actividad,
      fechaEntrega: new Date(),
      estado: estado || "PENDIENTE",
      calificacion: calificacion ?? null,
      observaciones: observaciones || null,
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
    const documentos = await Entrega.find({ activo: true });
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
    const documento = await Entrega.findOne({ _id: req.params.id, activo: true });
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

    const documentoActualizado = await Entrega.findOneAndUpdate(
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

    const documentoActualizado = await Entrega.findOneAndUpdate(
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
