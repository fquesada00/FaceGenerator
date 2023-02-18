[//]: # (Agregar el nombre de la tarjeta de JIRA al nombre del PR, por ejemplo: BIT-135)
## ¿Qué cambios agrega?  
[//]: # (Breve explicación del feature-hotfix-hotfeature-etc que se 
        incluye en el PR, y los flujos afectados) 

## Auto-evaluación
[//]: # (Marcar con una [x] los casos que se cumplan.)  

- [ ] Agrego los tests unitarios correspondientes.
- [ ] Deployé en un scope de prueba y probé los flujos afectados.

## Screenshots
[//]: # (Si se puede, agregar. Si no es el caso, eliminar este título.)


## ¿Merge con “merge commit” o “squash”?
Esta es una pregunta muy recurrente y debemos prestar especial atención cuando estemos a punto de darle al botón, dado que podemos dañar la trazabilidad de los cambios en el repositorio. La regla general es la siguiente:
“Siempre usar merge commit, a menos que estemos introduciendo nuevos cambios, como por ejemplo un feature branch”
Ejemplos:

- feature/my-uber-feature -> develop [SQUASH] (nuevos cambios!)
- hotfix/my-fix ->release/my-release [SQUASH] (nuevos cambios!)
- hotfix/my-fix -> master [SQUASH] (nuevos cambios!)
- release/my-release -> master [MERGE]
- master -> develop (backport) [MERGE]
