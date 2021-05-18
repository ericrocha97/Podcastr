export function substringGUID(guid: string) {
  const idreal = guid.substr(27, guid.length);
  //console.log(idreal)

  return idreal;
}