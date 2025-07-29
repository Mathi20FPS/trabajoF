# Juego de Plataformas Infinito con Enemigos

Este es un juego vertical desarrollado en **Phaser 3**, donde el jugador asciende por plataformas generadas infinitamente mientras esquiva enemigos que lanzan proyectiles y destruyen plataformas.

## 🎮 Mecánicas principales

- **Plataformas infinitas**: Se generan automáticamente a medida que el jugador sube.
- **Gravedad ajustada**: El jugador asciende con una gravedad constante de 500.
- **Caída mortal**: Si el jugador cae demasiado o no encuentra plataformas, muere.
- **Enemigos por altura**:
  - **Desde 100m**: Aparece el *pájaro*, que vuela de lado a lado y lanza *huevos* que destruyen plataformas y matan al jugador.
  - **Desde 300m**: Aparece la *nave*, que se queda quieta un momento y lanza *rayos* con el mismo efecto destructivo.
  - **Desde 400m**: Aparece *enemigoE*, un enemigo fijo sobre plataformas que lanza *rayos* solo si tiene línea de visión con el jugador (sin plataformas entre ambos).

## 📁 Estructura del proyecto

/assets
/sprites
pajaro.png
pajaro2.png
huevo.png
nave.png
rayo.png
enemigoE.png
/js
game.js → Lógica del juego
player.js → Control del jugador
plataformas.js → Generación de plataformas
enemigos.js → Control de enemigos y proyectiles
index.html


## ▶️ Cómo ejecutar

1. Cloná el proyecto:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git

🛠️ Tecnologías
Phaser 3

JavaScript

HTML5

VS Code

✍️ Autor
Matías Pérez – 2025