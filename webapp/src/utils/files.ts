import {SchematicsException, Tree} from '@angular-devkit/schematics';
import * as fs from 'fs';

function throwPathNotFound(path: string): never {
  throw new SchematicsException(`Could not find ${path}`);
}

export function readFileFromFS(path: string): string {
  return fs.readFileSync(path, {encoding: 'utf-8'})
}

export function readFile(host: Tree, path: string): string {
  return host.read(path)!.toString('utf-8');
}

export function writeFile(path: string, content: string, host: Tree) {
  host.overwrite(path, content);
}

export function getJSON<T = any>(host: Tree, path: string): T {
  if (!host.exists(path)) {
    throwPathNotFound(path);
  }
  const sourceText = readFile(host, path);
  return JSON.parse(sourceText);
}

export function getJSONFromFS<T = any>(path: string): T {
  if (!fs.existsSync(path)) {
    throwPathNotFound(path);
  }
  const sourceText = readFileFromFS(path);
  return JSON.parse(sourceText);
}

export function setJSON(host: Tree, path: string, content: object): Tree {
  host.overwrite(path, JSON.stringify(content, null, 2));

  return host;
}
