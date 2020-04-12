import {capitalize} from '@angular-devkit/core/src/utils/strings';
import {apply, url, template, move, mergeWith, Rule, MergeStrategy, filter, Tree, noop} from '@angular-devkit/schematics';
import {Schema} from './schema';

export function addFiles(options: Schema, scopeWithName: string, tree: Tree): Rule {
  return mergeWith(apply(url(`./files`), [
    template({
      ...options,
      scopeWithName,
      capitalize
    }),
    filter(path => !tree.exists(path)),
    move('/')
  ]), MergeStrategy.Overwrite);
}
