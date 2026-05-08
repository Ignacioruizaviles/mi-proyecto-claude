# mi-proyecto-claude

Proyecto configurado con **Claude Code + GitHub Actions**.

## ¿Qué puede hacer Claude aquí?

Escribe `@claude` en cualquier issue o PR:

| Ejemplo | Resultado |
|---------|-----------|
| `@claude implementa un endpoint REST para usuarios` | Escribe el código, hace commits y abre un PR |
| `@claude refactoriza este archivo` | Aplica los cambios en el PR |
| `@claude hay un bug en login, arréglalo` | Investiga, corrige y explica qué cambió |
| `@claude añade tests unitarios` | Crea los tests y los añade al PR |

## Setup: añadir tu API key (solo una vez)

1. Ve a **Settings → Secrets and variables → Actions → New repository secret**
2. Nombre: `ANTHROPIC_API_KEY`
3. Valor: tu API key de [console.anthropic.com](https://console.anthropic.com)

Luego activa permisos de escritura en **Settings → Actions → General → Workflow permissions → Read and write permissions**.

## Workflows incluidos

- **`claude.yml`** — Responde a `@claude` en issues y comentarios
- **`claude-review.yml`** — Revisa automáticamente cada nuevo PR

## Personalización

Edita `CLAUDE.md` para dar contexto a Claude sobre tu proyecto: stack, convenciones, comandos, etc.
