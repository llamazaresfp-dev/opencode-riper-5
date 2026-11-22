# Instrucciones del proyecto

## Workflow

**Este proyecto usa RIPER-5:** planificación explícita antes de implementación.

| Fase | Agent/Skill | Artefacto |
|------|-------------|-----------|
| **RESEARCH** | `vc-research-agent` | Context gathered in chat |
| **SPEC** | `vc-spec-agent` | `_SPEC_*.md` (requirements doc) |
| **INNOVATE** | `vc-innovate-agent` | Decision summary |
| **PLAN** | `vc-plan-agent` | `_PLAN_*.md` en `process/general-plans/active/` o `process/features/*/active/` |
| **VALIDATE** | `vc-validate-agent` | Validate-contract (V1-V7) en plan file |
| **EXECUTE** | `vc-execute-agent` | Edits a source files |
| **UPDATE PROCESS** | `vc-update-process-agent` | Archived plan, context updates |

**Phase gates:** No saltar directamente de PLAN a EXECUTE sin "ENTER EXECUTE MODE". Ejecutar VALIDATE antes.



## Uso de Skills

- Antes de comenzar una tarea, revisa las Skills disponibles.
- Identifica cuáles son relevantes para la tarea solicitada.
- Utiliza automáticamente las Skills pertinentes.
- No esperes a que el usuario invoque las Skills mediante @.
- Si una tarea requiere varias Skills, utiliza todas las necesarias.
- Sigue las instrucciones de las Skills durante todo el trabajo.
- No cargues Skills que no tengan relación con la tarea