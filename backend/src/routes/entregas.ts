import { Router, Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import Entrega from "../models/Entrega";

const router = Router();

interface IdParams {
  id: string;
}

// CREATE: registra un nuevo documento, siempre activo por defecto
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documento = await Entrega.create({ ...req.body, activo: true });
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
