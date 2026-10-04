# Seguridad — Rizzoma Arquitectura

La web actual es una aplicación **estática** construida con Astro y desplegada en GitHub Pages. No existe backend propio, base de datos, sistema de autenticación, sesiones, contraseñas ni subida de archivos.

Este documento traduce el checklist de seguridad del proyecto a controles reales y evita crear una falsa sensación de protección para componentes que no existen.

## Estado del checklist

1. **Ocultar claves API — Implementado / preventivo.** No hay claves API en el frontend. `.gitignore` excluye `.env*`, claves privadas, credenciales y archivos de secretos.
2. **Eliminar secretos de Git — Verificado en el árbol actual.** No se encontraron patrones comunes de tokens o claves en el código actual. Si alguna credencial real llegara a publicarse, debe rotarse inmediatamente y limpiarse también del historial.
3. **Usar una clave pública de DB — No aplica.** La web no usa base de datos.
4. **Activar RLS — No aplica.** No existe base de datos. Será obligatorio si se incorpora Supabase u otra DB con acceso desde cliente.
5. **Cifrar datos sensibles — No aplica al almacenamiento.** La web no almacena los datos del formulario en una base propia. HTTPS protege el transporte.
6. **Forzar autenticación del servidor — No aplica.** No existe servidor privado ni endpoints autenticados.
7. **Restringir acceso a registros — No aplica.** No existen registros de usuarios o clientes en una DB.
8. **Bloquear manipulación de campos — Implementado para el formulario existente.** Solo se aceptan campos y servicios explícitamente esperados; los datos se normalizan, limitan y validan antes de construir el mensaje.
9. **Proteger cookies de sesión — No aplica.** Rizzoma no crea sesiones ni cookies de autenticación.
10. **Hashear contraseñas — No aplica.** No existen cuentas ni contraseñas.
11. **Limitar intentos de inicio — No aplica a login.** No hay inicio de sesión. El formulario sí limita intentos repetidos en la sesión del navegador.
12. **Protección contra bots — Implementado en cliente como primera barrera.** Honeypot, tiempo mínimo antes de envío y límite de intentos. Al migrar a Cloudflare, se recomienda Turnstile para protección verificable del lado del servicio.
13. **Monitorizar consultas DB — No aplica.** No existe base de datos.
14. **Validar todas las entradas — Implementado.** Restricciones HTML + validación, longitudes, listas permitidas y normalización en JavaScript.
15. **Escapar contenido del usuario — Implementado.** Astro escapa contenido renderizado por defecto; el formulario no inserta datos del usuario en HTML y limpia caracteres de control antes de enviarlos a WhatsApp.
16. **Restringir subida de archivos — No aplica.** No existe funcionalidad de subida. Si se añade, deberá validar tipo MIME, extensión, tamaño y almacenamiento fuera del directorio público.
17. **Limitar respuestas API — No aplica.** No existe API propia.
18. **Cabeceras de seguridad — Implementado.** Se incluye CSP en la página y un archivo `public/_headers` listo para Cloudflare Pages con CSP, HSTS, nosniff, anti-framing, Permissions Policy, Referrer Policy y COOP.
19. **Forzar HTTPS — Implementado en el despliegue actual.** GitHub Pages sirve la URL mediante HTTPS. El archivo de cabeceras incluye HSTS para el futuro despliegue en Cloudflare Pages.
20. **Escanear dependencias — Implementado.** Dependabot revisa npm y GitHub Actions; un workflow ejecuta `npm audit`; CodeQL analiza JavaScript/TypeScript periódicamente.

## Reglas para futuras funciones

Si Rizzoma incorpora formularios almacenados, CMS, autenticación, pagos, uploads, Supabase/Firebase o una API, no se considerará segura por heredar esta configuración. Esos componentes deberán añadir controles del lado del servidor, autorización por recurso, límites de tasa reales, protección CSRF cuando corresponda, validación de archivos y registros de auditoría.

## Reporte de vulnerabilidades

No publiques claves, tokens ni datos sensibles en Issues. Si se detecta un problema de seguridad, comunícalo de forma privada al responsable del repositorio y rota cualquier credencial expuesta antes de intentar ocultarla del historial.
