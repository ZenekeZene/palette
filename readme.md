# PALETTE

## Juego casual de **PilPilGames**

![Screenshoot](./screenshoot.png)

Primer juego casual de este estudio, consiste en un juego de puzzles en el que el usuario ha de
mezclar colores para pasar de nivel.

Se encuentra en pleno proceso de desarrollo, utilizando únicamente tecnologías web. En el futuro no
se descarta la posibilidad de migrar a un entorno Unity, Phaser, etc.

### TODO

-   [x] Colores casi blancos
-   [x] Colores muy parecidos
-   [x] Bajar a local
-   [x] Persistir record (**Nota:** tambien estamos persistiendo el nivel actual)
-   [x] Cambiar el grid de Gridlayout a Flexbox
-   [x] Dar feedback del error
-   [x] Relacionado con tutorial y curva de aprendizaje: Modificar el sistema de niveles, para que
        el primer nivel tenga un solo círculo (aprender a arrastrar objetos sin frustraciones), el
        segundo con dos (ir cogiendo poco a poco la mecánica de colores), el tercero tres... y así
        hasta el nivel 15
-   [x] Explicativo al principio (flechas, tutorial...) -> Pintada, el funcionamiento es el
        siguiente: La primera vez que se usa el juego, el componente .active\_\_base tiene añadida
        la clase .tutorial. En el momento en el que se empieza a arrastrar el color activo, esta
        clase desaparece y todos los mixers reciben la clase .tutorial. En el momento en el que se
        suelta el primer activo sobre un mixer, desaparece la clase .tutorial de los mixers y no
        vuelve a aparecer en ningún componente.
-   [ ] Música ambient / chill / Mobi / ([Música procedural](https://github.com/Tonejs/Tone.js/))
-   [ ] Efectos de sonido: Cada vez que se consigue un match de color / Cuando hay un error / Cuando
        se pasa de nivel
-   [ ] Home -> Pintada, falta funcionalidad en botones compartir, sonido y about
-   [ ] Settings
-   [x] Recompensa visual entre niveles (¿Quotes de artistas?)-> Pintada y creado quotes.json, un
        archivo con 40 frases para alimentarlas. -> FALTA la función que lo alimenta
-   [ ] Mínimos de luminosidad para mixers (15) y para swatches (25)
-   [ ] Mínimo de diferencial en la generación del mixer (de 0 a 0.9 ?)
-   [ ] Limitar el número máximo de veces (10) que se ejecuta la condicional de diferencia de
        colores, para evitar el bug de bucle infinito
-   [ ] Hacer que los colores sean un countdown
-   [ ] Integrar sistema de monetización (pop-up y plataforma de pago)
-   [ ] Hacer testing con usuarios
-   [ ] Sistema para registrar datos del testing automáticamente (?)

### ROADMAP

-   [ ] Monetización
-   [ ] Compartir en redes
-   [ ] Marketing de guerrilla
-   [ ] Crowfunding

### MODELO DE MONETIZACIÓN

Esto es una idea, que tendremos que testar y discutir. Con este juego tenemos dos objetivos: La
rentabilidad económica y comenzar a hacer "ruido" como estudio de videojuegos. Por este último
motivo es necesario que el juego sea una experiencia totalmente disfrutable por sí mismo, de forma
independiente a su monetización. La publicidad es intrusiva y nos va a hacer perder usuarios, y el
modelo freemium puro hace que el juego tenga un recorrido muy corto. Por eso propongo esta idea:

-   El juego Palette se ofrece íntegro, sin publicidad ni necesidad de micropagos para disfrutar al
    100% de sus prestaciones. La única limitación es que los usuarios tienen limitado el número de
    "activos" que se generan (una cantidad suficiente como para pasarse los 15 niveles del juego,
    tal vez 300 o 500)
-   El juego Palette Unlimited, por otro lado, no tiene esta limitación y presenta algún tipo de
    funcionalidad extra (combos, otros tipos de niveles o mecánicas, etc.). Cuando un usuario se
    queda sin colores, recibe una notificación con estas ventajas, para motivarle a la compra por un
    precio muy razonable (0,99€) Con este modelo nos ahorramos bastantes problemas, así a bote
    pronto, se me ocurren:
-   Evitamos las restricciones legales de los freemium (autorizaciones para microcompras, validación
    de edad, etc), así como el desarrollo necesario para articular el sistema de micropagos.
-   Quitamos cualquier barrera para que el juego se difunda por sí mismo, sin nada que interfiera en
    una experiencia satisfactoria.
-   Prolongamos la vida del juego a través de su segunda versión. En la versión sencilla de Palette
    hemos educado el ojo del usuario, y le hemos motivado haciendo que sea cada vez mejor. Sobre esa
    base, en la versión Unlimited podemos construir experiencias más complejas que lleven más allá
    la experiencia de juego (por ejemplo, que el match de colores sea una herramienta para resolver
    otro tipo de rompecabezas, o integrar el juego competitivo...)
-   La idea es que la versión Unlimited tendría un evolutivo a futuro, mientras que la Básica es lo
    que es.
