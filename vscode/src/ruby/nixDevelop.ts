import * as vscode from "vscode";

import { ActivationResult, VersionManager } from "./versionManager";

export class NixDevelop extends VersionManager {
  async activate(): Promise<ActivationResult> {
    const flakeDir = this.flakeDirectory();
    this.outputChannel.info(`Nix flake directory: ${flakeDir || "(empty - using current directory)"}`);

    const command = ["nix", "develop", flakeDir, "--command", "ruby"].filter((part) => part !== "").join(" ");
    const parsedResult = await this.runEnvActivationScript(command);

    return {
      env: { ...process.env, ...parsedResult.env },
      yjit: parsedResult.yjit,
      version: parsedResult.version,
      gemPath: parsedResult.gemPath,
    };
  }

  flakeDirectory() {
    const configuration = vscode.workspace.getConfiguration("rubyLsp");
    const flakeDirectory: string | undefined = configuration.get("flakeDirectory");

    return flakeDirectory || "";
  }
}
