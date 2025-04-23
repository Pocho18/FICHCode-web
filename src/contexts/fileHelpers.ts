import { FileType } from "./fileStore";

// Fecha actual legible (ej: 'Mon Apr 14 2025')
export const formatDate = () => new Date().toDateString();

// Nombre único con sufijo si ya existe (ej: file(1).psc)
export const generateUniqueName = (baseName: string, files: (FileType & { id: string })[]): string => {
  const base = baseName.replace(/\.psc$/, "");
  let name = `${base}.psc`;
  let i = 1;
  while (files.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
    name = `${base}(${i++}).psc`;
  }
  return name;
};

// Renombra archivo por ID. Retorna éxito y lista actualizada
export const updateFileName = (
  id: string,
  name: string,
  files: (FileType & { id: string })[]
): [boolean, (FileType & { id: string })[]] => {
  if (!name.trim()) return [false, files]; // Nombre vacío
  if (!name.endsWith(".psc")) name += ".psc"; // Agrega .psc

  const index = files.findIndex((f) => f.id === id);
  if (index === -1) return [false, files]; // No encontrado

  const duplicate = files.some((f) => f.name.toLowerCase() === name.toLowerCase());
  if (duplicate && files[index].name.toLowerCase() !== name.toLowerCase()) return [false, files];

  files[index].name = name;
  return [true, files];
};

// Actualiza contenido y fecha de archivo
export const updateContent = (
  id: string,
  content: string,
  files: (FileType & { id: string })[]
): (FileType & { id: string })[] => {
  const index = files.findIndex((f) => f.id === id);
  if (index === -1) return files; // No encontrado

  files[index].content = content;
  files[index].updatedAt = formatDate();
  return files;
};

// Cambia favorito ON/OFF
export const toggleFileFavorite = (
  id: string,
  files: (FileType & { id: string })[]
): (FileType & { id: string })[] => {
  const index = files.findIndex((f) => f.id === id);
  if (index === -1) return files; // No encontrado

  files[index].favorite = !files[index].favorite;
  return files;
};