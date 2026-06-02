export const getFileName = (path) => {
  if (!path) return "";

  return path.split("/").pop();
};