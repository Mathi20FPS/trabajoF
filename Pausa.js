class Pausa extends Phaser.Scene {
  constructor() {
    super('Pausa');
  }

  preload() {
    this.load.image('opcionesUI', 'assets/Interfaz/opciones.png');
    this.load.spritesheet('musicaBtn', 'assets/Sprite/musica.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('sonidoBtn', 'assets/Sprite/sonido.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('controlesBtn', 'assets/Sprite/controles.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('salirBtn', 'assets/Sprite/salir.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7).setOrigin(0);
    this.add.image(centerX, centerY, 'opcionesUI').setDisplaySize(900, 500).setOrigin(0.5);

    this.musicaOn = true;
    this.sonidoOn = true;

    const musicaBtn = this.add.sprite(centerX - 120, centerY + 40, 'musicaBtn').setInteractive().setScale(1.5);
    const sonidoBtn = this.add.sprite(centerX + 10, centerY + 10, 'sonidoBtn').setInteractive().setScale(1.5);
    const controlesBtn = this.add.sprite(centerX, centerY + 100, 'controlesBtn').setInteractive().setScale(1.5);
    const salirBtn = this.add.sprite(centerX + 150, centerY - 165, 'salirBtn').setInteractive().setScale(2);

    this.anims.create({
      key: 'animMusica',
      frames: this.anims.generateFrameNumbers('musicaBtn', { start: 0, end: 1 }),
      frameRate: 2,

    });
    this.anims.create({
      key: 'animSonido',
      frames: this.anims.generateFrameNumbers('sonidoBtn', { start: 0, end: 1 }),
      frameRate: 2,
    });
    this.anims.create({
      key: 'animControles',
      frames: this.anims.generateFrameNumbers('controlesBtn', { start: 0, end: 1 }),
      frameRate: 2,
    });
    this.anims.create({
      key: 'animSalir',
      frames: this.anims.generateFrameNumbers('salirBtn', { start: 0, end: 1 }),
      frameRate: 2,
    });

    musicaBtn.play('animMusica');
    sonidoBtn.play('animSonido');
    controlesBtn.play('animControles');
    salirBtn.play('animSalir');

    musicaBtn.on('pointerdown', () => {
      this.musicaOn = !this.musicaOn;
      musicaBtn.setFrame(this.musicaOn ? 0 : 1);
    });

    sonidoBtn.on('pointerdown', () => {
      this.sonidoOn = !this.sonidoOn;
      sonidoBtn.setFrame(this.sonidoOn ? 0 : 1);
    });

    controlesBtn.on('pointerdown', () => {
      this.scene.start('Controles');
    });

    salirBtn.on('pointerdown', () => {
      this.scene.resume('Game');
      this.scene.stop();
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.resume('Game');
      this.scene.stop();
    });
    
    controlesBtn.on('pointerdown', () => {
    this.scene.pause();
    this.scene.launch('Controles', { desde: 'Pausa' });
    });

  }
}

window.Pausa = Pausa;