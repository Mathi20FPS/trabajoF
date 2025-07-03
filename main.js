const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: [Menu, Opciones, Controles, Game, Pausa, Carga],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  }
};

const game = new Phaser.Game(config);

