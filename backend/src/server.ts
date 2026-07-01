import "dotenv/config";
import express from "express";
import { connectDB } from "./db";
import cursosRoutes from "./routes/cursos";
import usuariosRoutes from "./routes/usuarios";
import inscripcionesRoutes from "./routes/inscripciones";
import entregasRoutes from "./routes/entregas";

const PORT = process.env.PORT || 4000;

async function start(): Promise<void> {
  await connectDB();

  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ mensaje: "API AulaVirtual activa", recursos: ["cursos", "usuarios", "inscripciones", "entregas"] });
  });

  app.use("/api/cursos", cursosRoutes);
  app.use("/api/usuarios", usuariosRoutes);
  app.use("/api/inscripciones", inscripcionesRoutes);
  app.use("/api/entregas", entregasRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
  });

  app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  });

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("No se pudo iniciar el servidor:", err);
  process.exit(1);
});
