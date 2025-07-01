// Escena de Menú principal con animaciones y escala reducida

class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  preload() {
    // Fondo
    this.load.image('portada', 'assets/Interfaz/portada.png');

    // Spritesheet de botones con animaciones
    this.load.spritesheet('play', 'assets/Sprite/play.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('opciones', 'assets/Sprite/opciones.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('salir', 'assets/Sprite/salir.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    // Fondo más chico y centrado
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'portada')
      .setDisplaySize(900, 500)
      .setOrigin(0.5);

    // Animaciones de botones (hover y click visuales)
    this.anims.create({
      key: 'hover_play',
      frames: this.anims.generateFrameNumbers('play', { start: 1, end: 1 }),
      frameRate: 10
    });
    this.anims.create({
      key: 'idle_play',
      frames: [{ key: 'play', frame: 0 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'hover_opciones',
      frames: this.anims.generateFrameNumbers('opciones', { start: 1, end: 1 }),
      frameRate: 10
    });
    this.anims.create({
      key: 'idle_opciones',
      frames: [{ key: 'opciones', frame: 0 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'hover_salir',
      frames: this.anims.generateFrameNumbers('salir', { start: 1, end: 1 }),
      frameRate: 10
    });
    this.anims.create({
      key: 'idle_salir',
      frames: [{ key: 'salir', frame: 0 }],
      frameRate: 10
    });

    // Botón Play
    const playBtn = this.add.sprite(1000, 470, 'play').setInteractive().setScale(1.5);
    playBtn.play('idle_play');
    playBtn.on('pointerover', () => playBtn.play('hover_play'));
    playBtn.on('pointerout', () => playBtn.play('idle_play'));
    playBtn.on('pointerdown', () => this.scene.start('Game'));

    // Botón Opciones
    const opcionesBtn = this.add.sprite(250, 500, 'opciones').setInteractive().setScale(1.5);
    opcionesBtn.play('idle_opciones');
    opcionesBtn.on('pointerover', () => opcionesBtn.play('hover_opciones'));
    opcionesBtn.on('pointerout', () => opcionesBtn.play('idle_opciones'));
    opcionesBtn.on('pointerdown', () => console.log('Opciones'));

    // Botón Salir
    const salirBtn = this.add.sprite(1180, 80, 'salir').setInteractive().setScale(1.5);
    salirBtn.play('idle_salir');
    salirBtn.on('pointerover', () => salirBtn.play('hover_salir'));
    salirBtn.on('pointerout', () => salirBtn.play('idle_salir'));
    salirBtn.on('pointerdown', () => console.log('Salir'));
  }
}

// Exportar globalmente
window.Menu = Menu;
