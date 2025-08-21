# 🚀 Guía Rápida de Git y VS Code (Windows + Ubuntu)

## 📌 Configuración Inicial (Solo una vez)

### Windows
```bash
# Configurar Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global core.autocrlf true  # Conversión de líneas para Windows

# Clonar proyecto
git clone https://github.com/clevervi/Integrative-Proyect---Catalyst-.git
cd Integrative-Proyect---Catalyst-
```

### Ubuntu/Linux
```bash
# Configurar Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global core.autocrlf input  # Conversión para Linux

# Instalar dependencias si es necesario
sudo apt update
sudo apt install git nodejs npm

# Clonar proyecto
git clone https://github.com/clevervi/Integrative-Proyect---Catalyst-.git
cd Integrative-Proyect---Catalyst-
```

## 🔄 Flujo de Trabajo Diario (Multiplataforma)

### 1. Actualizar y crear rama
```bash
# Funciona igual en Windows y Ubuntu
git checkout main
git pull origin main
git checkout -b feat/nueva-funcionalidad  # Ej: feat/search-bar
```

### 2. Trabajar y hacer commits
```bash
# Comandos universales
git add .
git commit -m "feat: añade barra de búsqueda con validación"
git push origin feat/nueva-funcionalidad
```

### 3. Mantener la rama actualizada
```bash
# Mismo comando para ambos SO
git checkout main
git pull origin main
git checkout feat/nueva-funcionalidad
git merge main
```

## 🚨 Solución de Problemas (Multiplataforma)

### Conflictos de merge
```bash
# Resolución universal
# Editar archivos con conflictos (<<<<<<< >>>>>>>)
git add .
git commit -m "fix: resuelve conflictos de merge"
```

### Deshacer cambios
```bash
# Windows y Ubuntu
git restore .  # Descarta todos los cambios
git restore archivo.html  # Archivo específico
```

### Permisos en Ubuntu
```bash
# Si hay problemas de permisos en Linux
sudo chmod -R 755 .git/  # Dar permisos adecuados
```

## 🛠️ Comandos Esenciales Universales

```bash
# Estado e historial (funciona igual)
git status
git log --oneline --graph --all

# Ramas
git branch -a
git branch -d rama-vieja

# Stash
git stash
git stash pop
```

## 🌐 Trabajo con Remotos

### Ambos sistemas
```bash
git push -u origin mi-rama
git fetch origin
git checkout --track origin/rama-compañero
git fetch --prune
```

### Diferencias en paths
```bash
# Windows (usar / o \)
git add src/components/Header.js
git add src\components\Header.js

# Ubuntu (solo /)
git add src/components/Header.js
```

## 📋 Checklist Pre-Push Universal
- [ ] `git status` muestra cambios esperados
- [ ] Rama actualizada con main
- [ ] Código funciona en local
- [ ] Mensajes de commit claros

## ⚡ Ejemplos de Comandos CRUCIALES

### Para Windows (CMD/PowerShell)
```bash
# Si fallan permisos
git config --global core.longpaths true  # Para paths largos
```

### Para Ubuntu
```bash
# Si falla autenticación
git config --global credential.helper store  # Guardar credenciales
```

## 🆘 Recuperación de Emergencia

### Windows
```batch
# Crear backup con fecha
git branch backup-%DATE%-%TIME%
```

### Ubuntu
```bash
# Crear backup
git branch backup-$(date +%Y-%m-%d-%H%M)
```

### Comando universal para recuperar
```bash
git reflog
git reset --hard <hash-estable>
```

## 🎯 Final del Día (Ambos SO)

```bash
# Comandos universales
git push origin mi-rama
# Crear PR en GitHub desde cualquier navegador
```

## 🔧 Configuraciones Específicas

### Windows (PowerShell)
```powershell
# Habilitar ejecución de scripts si es necesario
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Ubuntu
```bash
# Configurar editor por defecto
git config --global core.editor "nano"  # o "code --wait" para VS Code
```

## 📞 Soporte Rápido por SO

### Si en Windows aparece:
```
error: cannot spawn .git/hooks/pre-commit: No such file or directory
```
**Solución:** Ejecutar Git Bash como Administrador

### Si en Ubuntu aparece:
```
Permission denied (publickey)
```
**Solución:**
```bash
ssh-keygen -t rsa -b 4096 -C "tu@email.com"
cat ~/.ssh/id_rsa.pub  # Copiar y agregar a GitHub
```

Recuerda. la practica hace al maestro, pero el maestro lo reportaron por tener cp en el discord 🚀