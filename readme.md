# PALETTE

## Juego casual de **PilPilGames**

![Screenshoot](./screenshoot.png)

Primer juego casual de este estudio, consiste en un juego de puzzles en el que el usuario ha de
mezclar colores para pasar de nivel.

Se encuentra en pleno proceso de desarrollo, utilizando únicamente tecnologías web. En el futuro no
se descarta la posibilidad de migrar a un entorno Unity, Phaser, etc.

---

### INSTALAR
- Clona el proyecto:
```
git clone https://github.com/ZenekeZene/palette.git
```

- Instala las dependencias:
```
npm install
```
- Lanza la aplicación:
```
npm run start
```

**Nota:** Es importante para una correcta visualización de la aplicación en su formato web lanzarla en resolución mobile.
**Nota:** Ojo al recrear la plataforma nativa de cero:
AndroidManifes.xml
<application ... android:usesCleartextTraffic="true" ...
*Info.plist
<key>NSAppTransportSecurity</key>
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>
---

### TODO

-	[?] Abrir cuentas de developers (iOS, Android). Cuenta de Android abierta, pendiente iOS.
-	[ ] Integrar el plugin de compartir resultados (wassap, twitter, facebook...).
-	[ ] Integrar Cordova.
-	[ ] VETE A OPENBANK HÉCTOR!!! Integrar sistema de monetización. Idea: donativos voluntarios a través de Buy me a Coffee (botón en los créditos y cuando te pasas el  juego): ([Buy me a coffe](https://www.buymeacoffee.com/)). Es sencillo, pega mucho con el rollo "creativo" que llevamos y sólo supone un 5% de comisión. -> Falta vincular la cuenta de Paypal definitiva.
-	[x] Música ambient / chill
-	[x] Efectos de sonido: Cada vez que se consigue un match de color / Cuando hay un error / Cuando se pasa de nivel. **Note:** Los de ahora son provisionales.
	Funcionamiento de los efectos y música: Cuando se inicia el primer nivel de juego, se inicia la música de fondo, sobre la cual se van superponiendo los sonidos de acierto (no interrumpen la música). Si se da un fallo, la música se para y suena el sonido de fallo. Hasta que no se reinicia de nuevo el nivel no vuelve a arrancar la música (la pantalla de Try Again estaría entonces sobre silencio). No hay más efectos de sonido en todo el juego.
-	[ ] Subir a stores.
-	[ ] Integrar un botón en la home que dirija a las stores para conseguir valoraciones (debe detectar si es iOs o Android para dirigir a la store que corresponda). --> Pintado, falta integrar funcionalidad
-	[ ] Publicar.

-	[x] ¡Arreglar **EL BUG** que crashea el hilo de ejecución JS! ([Probar con esto](https://github.com/liriliri/eruda))
-	[x] Bug: Al guardar el record, registra un nivel menos.
-	[x] Bug: No se muestra corona de laureles.
-	[x] Modificar el sistema de adjudicación de vidas (Pasamos de un sistema lineal a una sucesión de Fibonacci):
			* Se comienza la partida con 5 vidas
			* Nivel 1 y 2 -> +1 vidas
			* Nivel 3 y 4 -> +2 vidas
			* Nivel 5 y 6 -> +3 vidas
			* Nivel 7 y 8 -> +5 vidas
			* Nivel 9 y 10 -> +8 vidas
			* Nivel 11 y 12 -> +13 vidas
			* Nivel 13 y 14 -> +21 vidas
-	[x] Todo colores naranjas en Iphone8.
- [x] El tutorial no se parece a lo que nos vamos a encontrar luego en el juego. OK, se parecerá lo máximo posible.
-	[x] Mínimo de luminosidad para el activo (ligeramente diferente, debe calcularse por la diferencia entre swatch y mixer).
-	[x] Deshabilitar el coeficiente diferencial para que no interfiera con el mínimo de luminosidad.
-	[x] Latido para el activo. --> No se ha podido integrar porque interfiere con el sistema de drag & drop ->Ver opciones alternativas (base, height-width-position...)
-	[x] Crear un sistema de vidas. Subtareas:
	-	[x] a) Crear un sistema de 25 vidas que reinician el juego cuando se agotan
	-	[x] b) Dar una vida extra al superar cada nivel
	-	[x] c) Modificar cabeceras (home y game) para reflejar vidas --> Pintado, falta integrar funcionalidad
	-	[x] d) Modificar la pantalla de fin de juego con dos versiones: Si terminas todos los niveles, y si se te acaban las vidas --> Pintado, falta integrar funcionalidad que muestre una u otra (conmutar entre las dos capas .final-message)
	-	[x] e) Modificar la pantalla intercalada entre niveles para reflejar la vida extra --> Pintado, falta hacer que el icono aparezca solamente cuando se sube de nivel, e integrar funcionalidad de +1 vida.
	-	[x] f) Eliminar botón de reinicio de la home.
	-	[x] g) Modificar el flujo de compartir resultado: Únicamente para juegos terminados.
-	[x] a) Crear página de EULA (en web externa, para hacer más fácil el mantenimiento).
-	[x] Crear un sistema de puntuación sencillo: Al hacer un match, se suman 10 puntos al marcador. Subtareas:
	- [x] a) Crear el sistema de generación y registro de la puntuación.
	- [x] b) Representar la puntuación en la cabecera del juego.--> Pintado, falta integrar funcionalidad
	- [x] c) Representar los mejores resultados del jugador en la home.--> Pintado, falta integrar funcionalidad.
	- [x] d) Sólo enseñar el cuadro de mejores resultados de haber resultados juas juas juas

---

###	TODO [DONE]

-	[x] Escribir informe de testing.
-	[x] Colores casi blancos
-	[x] Colores muy parecidos
-	[x] Bajar a local
-	[x] Persistir record (**Nota:** tambien estamos persistiendo el nivel actual)
-	[x] Cambiar el grid de Gridlayout a Flexbox
-	[x] Dar feedback del error
-	[x] Relacionado con tutorial y curva de aprendizaje: Modificar el sistema de niveles, para que el primer nivel tenga un solo círculo (aprender a arrastrar objetos sin frustraciones), el segundo con dos (ir cogiendo poco a poco la mecánica de colores), el tercero tres... y así hasta el nivel 15
-	[x] Explicativo al principio (flechas, tutorial...) -> Pintada, el funcionamiento es el siguiente: La primera vez que se usa el juego, el componente .active\_\_base tiene añadida la clase .tutorial. En el momento en el que se empieza a arrastrar el color activo, esta clase desaparece y todos los mixers reciben la clase .tutorial. En el momento en el que se suelta el primer activo sobre un mixer, desaparece la clase .tutorial de los mixers y no vuelve a aparecer en ningún componente.
-	[x] Hack en las unidades vh para evitar el descuadre por la barra de navegación
-	[x] Logo de Pil-Pil Games incluido en el juego
-	[X] Introducir elementos para facilitar comprensión del juego (líneas que relacionan muestras y mixers)
-	[x] Refactor CSS variables en progression for.
-	[x] Cuando se falla un color, emplear la clase .reset-swatch para resetear los demás colores (actualmente se utilizan las clases .match-swatch y .match-mixer, que tienen un pseudoelemento ::after para indicar cuándo se acierta).
-	[x] Home -> Pintada, falta funcionalidad en botones reset y about (acceder a las secciones, que están ocultas)y en sonido (conmutar entre sonido y silencio)
-	[x] Reset del juego -> Pintada, falta funcionalidad (borrar localstorage)
-	[x] Compartir resultado -> Pintada, falta generar dinámicamente el enlace con el resultado
-	[x] Visualizar progresión del juego -> Está pintado, con la progresión pintada mediante css. Únicamente sería necesario añadir las clases .level-1, .level-2... al elemento .progression, pero tal vez quieras refactorizar en js el funcionamiento (lo he adelantado así para ahorrarte trabajo por si acaso)
-	[x] Recompensa visual entre niveles (¿Quotes de artistas?)-> Pintada y creado quotes.json, un archivo con 40 frases para alimentarlas.
-	[x] Hacer que el contador de colores sea por color activo generado (en lugar de por match, así hacemos que el pique sea a ver quién se pasa el juego con menos colores)
-	[x] Pulir animaciones de entrada de créditos y reset.
-	[x] Quitar inertia en el drag.
-	[x] Insertar clase .initial en #swatchesGrid durante los 5 primeros niveles de Juego
-	[x] Corregir bug que duplica los colores activos
-	[x] Sistema de muteo de sonido.
-	[x] Pantalla final del juego, cuando se superan los 15 niveles -> Pintada, falta incorporar funcionalidad (aparición al superar el nivel 15, botón de compartir resultado)
-	[x] Añadir al share normal 'using X colors'.
-	[x] Mínimos de luminosidad para swatches (25, 30):
-	[x] Limitar el número máximo de veces (10) que se ejecuta la condicional de diferencia de colores, para evitar el bug de bucle infinito.
-	[x] Limitar el arrastre del swatch.
-	[x] Hacer testing con usuarios.
-	[ ] **Pospuestos:** (para más adelante, quizá)
	-	[ ] Mínimos de luminosidad para mixers (15).
	-	[ ] Mínimo de diferencial en la generación del mixer (de 0 a 0.9 ?).

---

### WISHLIST
-	[ ] Investigar integración con Google Play Services para creación de un ranking público global.
-	[ ] Integrar un sistema de "Mensajes" personales de los jugadores en el ranking.
-	[ ] Integrar, si fuese necesario, un sistema de métricas (Google Analytics, Firebase...). Si fuese el caso, subtarea.
---

### USERS A TESTAR
- [ ] Fran
- [ ] Iker
- [ ] Alex

### GASTOS REALIZADOS
- Hosting y dominio de landing: 43,56 €
- Plantilla de landing: 16,84€
- Tasa android developer: 23,16€
- Efectos de sonido: 38,72€
- Imagen para promoción 10,89€:

TOTAL GASTOS REALIZADOS: 133,17€
