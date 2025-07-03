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
      frames: this.anims.generateFrameNumbers('play', { start: 1, end: 3 }),
      frameRate: 10
    });
    this.anims.create({
      key: 'idle_play',
      frames: [{ key: 'play', frame: 0 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'hover_opciones',
      frames: this.anims.generateFrameNumbers('opciones', { start: 1, end: 3 }),
      frameRate: 10
    });
    this.anims.create({
      key: 'idle_opciones',
      frames: [{ key: 'opciones', frame: 0 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'hover_salir',
      frames: this.anims.generateFrameNumbers('salir', { start: 1, end: 3 }),
      frameRate: 10
    });
    this.anims.create({
      key: 'idle_salir',
      frames: [{ key: 'salir', frame: 0 }],
      frameRate: 10
    });

    // Coordenadas base
    const portadaCentroX = this.scale.width / 2;
    const portadaCentroY = this.scale.height / 2;
    const margen = 40;

    // Botón Play (entre planeta azul y naranja)
    const playBtn = this.add.sprite(810, 390, 'play').setInteractive().setScale(3);
    playBtn.play('idle_play');
    playBtn.on('pointerover', () => playBtn.play('hover_play'));
    playBtn.on('pointerout', () => playBtn.play('idle_play'));
    playBtn.on('pointerdown', () => this.scene.start('Game'));
    playBtn.on('pointerdown', () => this.scene.start('Carga'));


    // Botón Opciones (esquina inferior izquierda)
    const opcionesX = portadaCentroX - (900 / 2) + margen;
    const opcionesY = portadaCentroY + (500 / 2) - margen;

    const opcionesBtn = this.add.sprite(opcionesX, opcionesY, 'opciones').setInteractive().setScale(1);
    opcionesBtn.play('idle_opciones');
    opcionesBtn.on('pointerover', () => opcionesBtn.play('hover_opciones'));
    opcionesBtn.on('pointerout', () => opcionesBtn.play('idle_opciones'));
    opcionesBtn.on('pointerdown', () => console.log('Opciones'));
    
    opcionesBtn.on('pointerdown', () => {
  this.scene.start('Pausa', { desde: 'Menu' });
});




    // Coordenadas calculadas dentro de la portada (esquina superior derecha)
    
    const salirX = portadaCentroX + (900 / 2) - margen;
    const salirY = portadaCentroY - (500 / 2) + margen;

    const salirBtn = this.add.sprite(salirX, salirY, 'salir')
    .setInteractive()
    .setScale(1); // Botón más grande

    salirBtn.play('idle_salir');
    salirBtn.on('pointerover', () => salirBtn.play('hover_salir'));
    salirBtn.on('pointerout', () => salirBtn.play('idle_salir'));
    salirBtn.on('pointerdown', () => console.log('Salir'));

  }
}

// Exportar globalmente
window.Menu = Menu;
