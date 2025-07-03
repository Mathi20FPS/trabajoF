class Pausa extends Phaser.Scene {
  constructor() {
    super('Pausa');
  }

  preload() {
    this.load.image('opcionesUI', 'assets/Interfaz/pausa2.png');
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

    // Animaciones para música y sonido (2 estados)
    this.anims.create({ key: 'activo_musica', frames: [{ key: 'musicaBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'inactivo_musica', frames: [{ key: 'musicaBtn', frame: 2 }], frameRate: 10 });

    this.anims.create({ key: 'activo_sonido', frames: [{ key: 'sonidoBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'inactivo_sonido', frames: [{ key: 'sonidoBtn', frame: 2 }], frameRate: 10 });

    // Animaciones controles y salir con hover
    this.anims.create({ key: 'idle_controles', frames: [{ key: 'controlesBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'hover_controles', frames: [{ key: 'controlesBtn', frame: 2 }], frameRate: 10 });

    this.anims.create({ key: 'idle_salir', frames: [{ key: 'salirBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'hover_salir', frames: [{ key: 'salirBtn', frame: 2 }], frameRate: 10 });

    const musicaBtn = this.add.sprite(centerX - 90, centerY + 100, 'musicaBtn').setInteractive().setScale(1.5);
    musicaBtn.play('activo_musica');
    musicaBtn.on('pointerdown', () => {
      this.musicaOn = !this.musicaOn;
      musicaBtn.play(this.musicaOn ? 'activo_musica' : 'inactivo_musica');
      console.log(`Música ${this.musicaOn ? 'activada' : 'desactivada'}`);
    });

    const sonidoBtn = this.add.sprite(centerX + 100, centerY + 100, 'sonidoBtn').setInteractive().setScale(1.5);
    sonidoBtn.play('activo_sonido');
    sonidoBtn.on('pointerdown', () => {
      this.sonidoOn = !this.sonidoOn;
      sonidoBtn.play(this.sonidoOn ? 'activo_sonido' : 'inactivo_sonido');
      console.log(`Sonido ${this.sonidoOn ? 'activado' : 'desactivado'}`);
    });

    const controlesBtn = this.add.sprite(centerX, centerY - 50, 'controlesBtn').setInteractive().setScale(1.5);
    controlesBtn.play('idle_controles');
    controlesBtn.on('pointerover', () => controlesBtn.play('hover_controles'));
    controlesBtn.on('pointerout', () => controlesBtn.play('idle_controles'));
    controlesBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.launch('Controles', { desde: 'Pausa' });
    });

    const salirBtn = this.add.sprite(centerX + 169, centerY - 180, 'salirBtn').setInteractive().setScale(2);
    salirBtn.play('idle_salir');
    salirBtn.on('pointerover', () => salirBtn.play('hover_salir'));
    salirBtn.on('pointerout', () => salirBtn.play('idle_salir'));
    salirBtn.on('pointerdown', () => {
      this.scene.resume('Game');
      this.scene.stop();
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.resume('Game');
      this.scene.stop();
    });
  }
}

window.Pausa = Pausa;
