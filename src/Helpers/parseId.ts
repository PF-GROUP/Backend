const parseId = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new Error('ID no proporcionado');
  }
    if (Array.isArray(id)) {
    return id[0];
  }
    return id;
};
export default parseId;