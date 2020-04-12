/** Loads the full version from the given package gracefully. */
export function getVersion(packageName: string, defaultVer = 'latest'): string | null {
  try {
    return require(`${packageName}/package.json`).version;
  } catch {
    return defaultVer;
  }
}
