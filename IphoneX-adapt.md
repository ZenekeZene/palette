
# LA MALDITA MUESCA DEL IPHONE-X
![LA MUESCA](https://i.blogs.es/cac9fc/notch1/1366_2000.jpg)
### Contexto:
La siguiente documentación está basada en la experiencia con **Línea Directa ([Link](https://docs.google.com/document/d/18G0xheo5q0rLkafXSjzM8t1M1bb_B88gjaY97bmvISU/edit))**.
Es decir, hay que aplicar los pasos de actualizar los plugins Statusbar, Splashscreen, crear nuevas Launch Images, etc, aunque esto puede diferir dependiendo del proyecto y del stack técnologico usado.

Esto nos ayudará a eliminar la barra blanca vertical y adaptar las splashcreens, pero tambien hay que amoldar ciertos elementos como header, footers y elementos fijos en pantalla para que no se vean solapados por el **notch/muesca del IphoneX**. Por ejemplo, este es el aspecto de Línea Directa antes de adaptar nuestro CSS:

![Ejemplo Linea Directa](https://dl2.pushbulletusercontent.com/X9kaaM8IEjWKSqMKYMu2xmwJoGsk4Heu/asset.PNG)

Y aquí es dónde entran las soluciones por CSS.

---

### Soluciones:
En cuanto a CSS, tenemos 2 mecanismos para adaptar elementos de nuestra web/app en IphoneX:

- **env/constant**:

	Primero, es importante tener la siguiente meta-tag en nuestro documento HTML:
	```html
	<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
	```
	Lo siguiente es usar la constante ``safe-area-inset-*`` donde el sufijo * pueden ser los offsets ``top | right | left | bottom``.

	Podemos aplicar esta constante en las propiedades ``margin``, ``padding`` o en propiedades ``top``, ``right``, ``left`` o ``bottom`` de elementos con ``position: relative | absolute``.
	
	Estas constantes, para que puedan ser interpretadas por Webkit, hay que envolverlas con ``env()``(*).

	Por ejemplo:
	```scss
	padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
	```

	>*: cuando salió el iPhone X, se usaba ``constant()`` en vez de ``env()``, pero con la salida de iOS 11.2 constant() fue deprecado.
	Por lo que, para adaptarse a iPhone X con versiones anteriores a esta, debemos usar las 2. Por ejemplo:
	```scss
	.selector {
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}
	```

	[Más info](https://css-tricks.com/the-notch-and-css/).

- **Media Query**:

	Esta media-query nos garantiza que se trata de un iphone X y no de otro dispositivo.

	```css
	@media only screen and (device-width: 375px)
	and (device-height: 812px)
	and (-webkit-device-pixel-ratio: 3) {
		.platform-ios { /* (Note) */
			/* 
				Aquí apuntamos a los selectores CSS 
				que queramos adaptar. 
			*/
		}
	}
	```
	Si además, queremos segmentar por orientación de dispositivo, añadiremos a la media-query:

	**Portrait**

	`` and (orientation: portrait)``

	**Landscape**

	`` and (orientation: landscape)``

	>**Note**: 

	>**``.platform-ios``**, classname propietaria de Ionic, 
	añade otro mecanismo de seguridad 
	para cercionarnos que nos encontramos 
	con un dispositivo que corre iOS. 
	Es totalmente opcional **DE MOMENTO**, pero esta bien usar este tipo de seguridad porque en el futuro algunas marcas corriendo en Android terminarán por añadir un notch/muesca parecida, pero habrá mecanismos diferentes [tanto constant() como env() sólo funciona en motores Webkit => Safari, Mail, App Store], por lo que será obligatorio segmentar hasta que se estandarize todo.

	[Más info](https://stackoverflow.com/questions/46313640/iphone-x-8-8-plus-css-media-queries).
---
### ¿Qué método elegir?

**La mejor opción es la primera** por ser más orgánica y añadir menos complejidad a nuestro CSS. De hecho, muchos frameworks y librerías ya incorporan este mecanismo para adaptar los elementos ráiz de nuestro árbol DOM.

La segunda opción, aunque más farragosa, nos da un control total de cómo queremos que se vean nuestros elementos en iPhone X.