import * as yaml from "js-yaml"

export async function readTextFile(file: File) {
  return await file.text();
}

export async function readYamlFile(file: File) {
  const text = await readTextFile(file);
  return yaml.load(text);
}