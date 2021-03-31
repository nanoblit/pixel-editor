const getCoords = (coordsStr: string) => {
  return coordsStr.split(',').map(Number);
}

export default getCoords;