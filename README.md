# APP OCUPA2: Busca empleos en linea

Proyecto de [Expo](https://expo.dev/) creado con `create-expo-app`.

## INDICE

1. [Para iniciar](#para-iniciar)
2. [Como organizar archivos](#organización-de-archivos)
3. [Actualizaciones en caliente (EAS Update)](#actualizaciones-en-caliente-eas-update)
4. [Consideraciones y tips](#consideraciones)

## Para iniciar

1. Instala las dependencias

```
npm install
```

2. Inicia el app:

```
npx expo start
```

3. Instala el development build en tu celular o emulador (solo se hace una vez por persona). Ver la sección [Actualizaciones en caliente (EAS Update)](#actualizaciones-en-caliente-eas-update) para el link de descarga y el flujo de trabajo diario.

Paginas que se van a ver en la app van en el directorio app. Este proyecto usa [enrutamiento basado en archivos](https://docs.expo.dev/router/introduction).

## Organización de archivos

1. Toda pantalla va en el directorio `app`.
2. Componentes utilizados en la app van en el directorio `components`
   * Subdividir en folders especificos para lo que estan asociados (ej. `auth` para todo de login y registro)
3. Configuración o valores de variables globales pueden ponerse en `config`
   * Ej. Valor de la parte base del URL para todos los requests del api del profesor van en `config/api.ts`
4. Servicios de APIs se deben poner en services
   * Subdividir en archivos que sean especificos para el dominio especifico del API (ej. todos los de auth en `services/auth.ts`)
5. Estilos que no tengan que ser especificos para una pagina se ponen en `styles`
6. Tipos usados en varios archivos se pueden definir en `types`

## Actualizaciones en caliente (EAS Update)

Este proyecto usa **EAS Update** para que todo el equipo pueda probar sus cambios sin gastar las 15 builds de EAS que tenemos disponibles. Solo se gasta una build cuando cambia algo nativo (una librería nueva con código nativo, configuración de Android, etc.) — para cambios normales de código (pantallas, componentes, estilos, lógica) no hace falta generar una build nueva.

### Instalación inicial (solo una vez por persona)

1. Descarga el APK de development build. Hay dos formas:

   * **Link directo** (más rápido, no requiere cuenta): [descargar APK](https://expo.dev/artifacts/eas/snM2jVEly0QIxqJKmA9ZkEf76MR_2Nyfsa2EnaIixLA.apk)
   * **Desde el dashboard del equipo** (útil para ver el historial de builds y descargar la más reciente en el futuro): [Ocupa2 — Builds](https://expo.dev/accounts/hard-devs/projects/ocupa2/builds)
     * Esta opción requiere iniciar sesión con una cuenta de Expo que esté invitada a la organización `hard-devs`. Si no tienes acceso, pide que te inviten o usa el link directo de arriba mientras tanto.
     * Una vez dentro, busca la build más reciente en la lista, entra a su página de detalle, y descarga el APK desde el botón correspondiente.
2. Instala ese APK en tu celular o emulador. Esta es la única build que vas a necesitar por un buen tiempo — si más adelante se genera una build nueva, el equipo avisará y se debe reinstalar solo en ese caso.

### Flujo de trabajo diario

1. Crea tu propia rama para trabajar, partiendo siempre de `main` actualizada:
   ```
   git checkout main
   git pull origin main
   git checkout -b feature/tu-rama
   ```
2. Trabaja normalmente en tu código.
3. Cuando quieras probar tus cambios en tu celular, sube tus cambios a GitHub:
   ```
   git add .
   git commit -m "Descripcion de tus cambios"
   git push origin feature/tu-rama
   ```
4. Ese push dispara automáticamente una actualización en la nube (no gasta ninguna de las 15 builds).
5. Abre la app instalada en tu celular. En la pantalla del launcher de Expo (donde aparece el logo y las opciones), busca la sección **Branches** y selecciona el nombre de tu rama (ej. `feature/tu-rama`).
6. La app va a descargar y cargar tu código más reciente.

Cada rama tiene su propia actualización independiente, así que el trabajo de un compañero nunca sobrescribe el de otro.

### ¿Cuándo SÍ necesito una build nueva?

Solo en estos casos, que consumen una de las 15 builds disponibles:

* Agregaste una librería con código nativo (revisa si el paquete menciona "native module" o si trae carpetas `android`/`ios`).
* Cambiaste configuración nativa en `app.json` (permisos, ícono, splash screen, plugins nativos).
* Modificaste algo directamente en la carpeta `android/`.

Si no estás seguro, pregunta antes de correr una build nueva — normalmente basta con `git push` y seleccionar tu rama desde el launcher.

## Consideraciones

1. Siempre que añadas una pantalla nueva a `/app` recuerda ponerla dentro del archivo `_layout.tsx` en el stack en forma de un elemento `<Stack.Screen/>`
2. Para recuperar el valor del token, añade esto a tu codigo:

```
//import useEffect para ejecutar codigo desde que cargue la pantalla
import { useEffect } from "react";
import { getToken } from "../services/auth.ts";
...

useEffect(() => {
   const checkToken = async () => {
     const tempToken = await getToken();
     if (tempToken) {
        //Usar setter o cualquier otra forma de guardar token aquí:
        setToken(tempToken);
     }
   };

   checkToken();
 }, []);
```
