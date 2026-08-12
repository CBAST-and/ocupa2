# APP OCUPA2: Busca empleos en linea

Proyecto de [Expo](https://expo.dev) creado con [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### INDICE
   1. [Para iniciar](#para-iniciar)
   2. [Como organizar archivos](#organización-de-archivos)
   3. [Consideraciones y tips](#consideraciones)

## Para iniciar

1. Instala las dependencias

   ```bash
   npm install
   ```

2. Inicia el app:

   ```bash
   npx expo start
   ```

3. Crea una build en linea
   ```bash
   npx eas build --profile preview --platform android
   ```
   - Usa el perfil preview para que sea una APK, el perfil production crea un app bundle para Play Store
   - Cuando lo ejecutes inicia sesion con la cuenta asociada a la organizacion del proyecto

En el resultado encontraras varias opciones para abrir el app en un/a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Paginas que se van a ver en la app van en el directorio **app**. Este proyecto usa [enrutamiento basado en archivos](https://docs.expo.dev/router/introduction).

## Organización de archivos

1. Toda **pantalla** va en el directorio `app`.
2. **Componentes** utilizados en la app van en el directorio `components`
   * Subdividir en folders especificos para lo que estan asociados (ej. `auth` para todo de login y registro)
3. **Configuración** o **valores de variables** globales pueden ponerse en `config`
   * Ej. Valor de la parte base del URL para todos los requests del api del profesor van en `config/api.ts`
4. **Servicios de APIs** se deben poner en **services**
   * Subdividir en archivos que sean especificos para el dominio especifico del API (ej. todos los de auth en `services/auth.ts`)
5. **Estilos** que no tengan que ser especificos para una pagina se ponen en `styles`
6. **Tipos** usados en varios archivos se pueden definir en `types`

## Consideraciones

1. Siempre que añadas una *pantalla* nueva a `/app` recuerda ponerla dentro del archivo `_layout.tsx` en el stack en forma de un elemento **<Stack.Screen/>**
2. Para recuperar el valor del token, añade esto a tu codigo:
 ```typescript
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