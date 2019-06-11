# PALETTE

## Juego casual de **PilPilGames**

![Screenshoot](./screenshoot.png)

Primer juego casual de este estudio, consiste en un juego de puzzles en el que el usuario ha de
mezclar colores para pasar de nivel.

Se encuentra en pleno proceso de desarrollo, utilizando únicamente tecnologías web. En el futuro no
se descarta la posibilidad de migrar a un entorno Unity, Phaser, etc.

---

### INSTALAR Y LANZAR VERSIÓN WEB
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

---

### RECREAR LA PLATAFORMA NATIVA DE CERO:

#### AndroidManifes.xml
```
<application ... android:usesCleartextTraffic="true" ...
...
<activity ... android:screenOrientation="portrait" ...
```
#### Info.plist
```
<key>CFBundleURLTypes</key>
<array>
	<dict>
		<key>CFBundleURLName</key>
		<string>com.pilpilgames.palette</string>
		<key>CFBundleURLSchemes</key>
		<array>
			<string>palette</string>
		</array>
	</dict>
</array>
.....
<key>NSAppTransportSecurity</key>
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>
...
<key>ITSAppUsesNonExemptEncryption</key>
	<false/>
```

---

### TODO
Hasta que no se cumplen todas las tareas de una fase, no se da por cerrada

#### FASE 1
Para el Indie Burguer, ASAP. No se hace difusión de la publicación.
-	[x] Subir a stores.
-	[x] Integrar un botón en la home que dirija a las stores para conseguir valoraciones (debe detectar si es iOs o Android para dirigir a la store que corresponda). --> Pintado, falta integrar funcionalidad
-	[x] Publicar.

#### FASE 2
Para difundir la versión 1.0 del juego
-	[x] VETE A OPENBANK HÉCTOR!!! Integrar sistema de monetización. Idea: donativos voluntarios a través de Buy me a Coffee
-	[x] Arreglar el inapp browser de Twitter.
-	[x] Mejorar la solución de los headers para iOS (ahora está metido un padding de 24 px para todos los dispositivos). => Testear posible fix.
-	[ ] El sonido queda siempre en background en android y a veces se corta. Probar a enlazarlo desde nativo solamente.

#### FASE 3
Para estabilizar la versión 1.1 del juego
-	[ ] Pasar el juego a vue
-	[ ] Integrar el plugin de compartir resultados (wassap, twitter, facebook...). [Link](https://capacitor.ionicframework.com/docs/apis/share/)

#### FASE 4
Para evolucionar a la versión 1.2 del juego
-	[ ] Desarrollar sistema de combos y bonus
-	[ ] Investigar integración con Google Play Services para creación de un ranking público global.

---

### WISHLIST
-	[ ] Integrar un sistema de "Mensajes" personales de los jugadores en el ranking.
-	[ ] Integrar, si fuese necesario, un sistema de métricas (Google Analytics, Firebase...).

---

### GASTOS REALIZADOS
- Hosting y dominio de landing: 43,56 €
- Plantilla de landing: 16,84€
- Tasa android developer: 23,16€
- Efectos de sonido: 38,72€
- Imagen para promoción: 10,89€
- Tasa iOS developer: 99,00€:

TOTAL GASTOS REALIZADOS: 232,17€