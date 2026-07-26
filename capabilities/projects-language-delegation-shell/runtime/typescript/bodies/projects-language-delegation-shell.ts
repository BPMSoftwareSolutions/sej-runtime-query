import type { ProjectsLanguageDelegationShellContext } from "../types/projects-language-delegation-shell-context.type.js";

export async function projectsLanguageDelegationShell(context: ProjectsLanguageDelegationShellContext): Promise<unknown> {
  const authority = await context.edges.invokes("resolves-projects-language-delegation-shell-authority", context);
  const execution = await context.edges.invokes("executes-resolved-projects-language-delegation-shell", authority);
  const receipt = context.edges.projects("projects-projects-language-delegation-shell-receipt", execution);
  return context.edges.invokes("validates-projects-language-delegation-shell-receipt", receipt);
}
