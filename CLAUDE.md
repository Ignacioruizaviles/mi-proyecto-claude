# Instrucciones para Claude Code

## Identidad del proyecto
Este repositorio usa Claude Code a través de GitHub Actions.
Cuando alguien menciona `@claude` en un issue o PR, Claude actúa como agente de desarrollo.

## Cómo comportarse

### Al implementar features
- Lee el issue completo antes de empezar
- Crea una rama nueva con formato `claude/descripcion-breve`
- Haz commits atómicos con mensajes claros
- Abre un PR cuando termines con un resumen de los cambios

### Estilo de código
- Sigue las convenciones ya presentes en el repositorio
- Añade comentarios en código no obvio
- Escribe tests cuando sea relevante

### Al revisar PRs
- Sé específico y constructivo
- Distingue entre bloqueantes (bugs, seguridad) y sugerencias (estilo, mejoras)
- Sugiere soluciones concretas, no solo señala problemas

### Límites
- No hagas push directamente a `main` o `master`
- No borres archivos sin confirmar en el issue que es lo pedido
- Si algo no está claro, pregunta en el issue antes de implementar

## Stack tecnológico
<!-- Actualiza esto con tu stack real -->
- Lenguaje principal: (por definir)
- Framework: (por definir)
- Testing: (por definir)

## Comandos útiles
<!-- Añade los comandos relevantes de tu proyecto -->
```bash
# Instalar dependencias
# npm install / pip install -r requirements.txt

# Tests
# npm test / pytest

# Build
# npm run build
```
