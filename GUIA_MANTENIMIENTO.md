# 📘 Guía Maestra de Mantenimiento - Wishly

¡Bienvenido a la sala de control de Wishly! Este documento resume cómo gestionar tu aplicación, desde actualizaciones automáticas hasta pruebas experimentales.

---

## 🚀 1. Ciclo de Actualización OTA (Over-The-Air)

El sistema OTA permite actualizar la app **sin que el usuario descargue una nueva APK**.

**Pasos para lanzar una actualización:**

1.  **Modifica el código**: Haz tus cambios en los componentes, estilos o lógica.
2.  **Sube la versión**: Cambia el campo `"version"` en el archivo `package.json` (ej: de `0.0.6` a `0.0.7`).
3.  **Publica los cambios**:
    ```bash
    git add .
    git commit -m "Descripción de la mejora"
    git push origin main
    ```
4.  **Verificación**: GitHub Actions compilará la web y creará la release. Los usuarios verán el aviso de "Actualización Disponible" al abrir la app.

---

## 🌳 2. Gestión de Ramas (Probar cosas nuevas)

Para no romper la versión que usan los usuarios, usa ramas.

- **Crear rama de pruebas**: `git checkout -b nombre-de-la-prueba`
- **Volver a la versión segura**: `git checkout main`
- **Fusionar cambios probados a la versión oficial**:
  1. Estar en `main`: `git checkout main`
  2. Fusionar: `git merge nombre-de-la-prueba`
  3. Subir versión en `package.json`.
  4. Hacer `git push origin main`.

---

## 📱 3. ¿Cuándo hace falta crear una nueva APK?

No todo se puede actualizar por el aire.

| Tipo de Cambio                                             | ¿Requiere nueva APK? | Método de entrega |
| :--------------------------------------------------------- | :------------------- | :---------------- |
| **Diseño Web** (Colores, Textos, React)                    | **NO**               | OTA (Git Push)    |
| **Lógica de negocio** (Cumpleaños, Notificaciones locales) | **NO**               | OTA (Git Push)    |
| **Icono de la App** o Splash Screen                        | **SÍ**               | Nueva APK         |
| **Nombre de la App**                                       | **SÍ**               | Nueva APK         |
| **Nuevos Plugins nativos** (Cámara, biometría, etc)        | **SÍ**               | Nueva APK         |
| **Permisos de Android**                                    | **SÍ**               | Nueva APK         |

_Si necesitas crear una APK, recuerda siempre hacer `npx cap sync` antes en la terminal._

---

## 🛠️ 4. Características Especiales

### Novedades del Sistema

Cuando lances una OTA, puedes actualizar el componente `WhatIsNewModal.tsx` para listar los cambios. La app los mostrará automáticamente una sola vez tras la actualización.

### Privacidad y Seguridad

Los datos se guardan en `LocalStorage` y se cifran con AES-256 (en `utils.ts`). El "Check de Vida" (`notifyAppReady`) asegura que si algo falla, la app vuelve a la versión anterior estable automáticamente.

---

¡Disfruta construyendo el futuro de Wishly! 🚀
