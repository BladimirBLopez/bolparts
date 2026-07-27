export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^a-z0-9\s-]/g, "") // quitar caracteres raros
    .trim()
    .replace(/\s+/g, "-") // espacios a guiones
    .replace(/-+/g, "-") // colapsar guiones repetidos
    .slice(0, 60); // limitar largo

  return slug || "repuesto";
}

export function idFromSlugParam(param: string): string {
  const parts = param.split("-");
  return parts[parts.length - 1];
}
