class Carga extends Phaser.Scene {
  constructor() {
    super('Carga');
  }

  preload() {
    // Imagen de la interfaz de carga
    this.load.image('fondoCarga', 'assets/Interfaz/Carga.png');

    // Sprite sheet animado
    this.load.spritesheet('cargaAnim', 'assets/Sprite/carga.png', {
      frameWidth: 90, // ajustá según tu sprite sheet
      frameHeight: 32
    });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Fondo oscuro que cubre toda la pantalla
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 1).setOrigin(0);

    // Interfaz de carga centrada (como el menú)
    this.add.image(centerX, centerY, 'fondoCarga')
      .setDisplaySize(900, 500)
      .setOrigin(0.5);

    // Crear animación
    this.anims.create({
      key: 'animandoCarga',
      frames: this.anims.generateFrameNumbers('cargaAnim', { start: 0, end: 9 }),
      frameRate: 2,
      repeat: 0
    });

    // Sprite que se animará abajo en la interfaz
    const spriteCarga = this.add.sprite(centerX, centerY + 130, 'cargaAnim')
      .setOrigin(0.5)
      .setScale(3);

    spriteCarga.play('animandoCarga');

    // Cuando termina, pasa al juego
    spriteCarga.on('animationcomplete', () => {
      this.scene.start('Game');
    });
  }
}

window.Carga = Carga;
