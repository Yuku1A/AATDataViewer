import * as yaml from "js-yaml"

export async function readTextFile(file) {
  return await file.text();
}

export async function readYamlFile(file) {
  const text = await readTextFile(file);
  return yaml.load(text);
}