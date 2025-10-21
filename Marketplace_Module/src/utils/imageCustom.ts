const files = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  as: "url",
}) as Record<string, string>;

const images: Record<string, string> = Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split("/").pop()?.replace(".webp", "")!, url]));

export default images;
