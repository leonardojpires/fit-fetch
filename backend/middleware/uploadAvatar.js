import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "public/uploads/avatars",
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const fileFilter = (_, file, cb) =>
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Apenas imagens são permitidas!"));
export default multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });