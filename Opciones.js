class Opciones extends Phaser.Scene {
  constructor() {
    super('Opciones');
    this.musicaActiva = true;
    this.sonidoActivo = true;
  }

  preload() {
    this.load.image('opcionesUI', 'assets/Interfaz/Pausa3.png');

    this.load.spritesheet('musicaBtn', 'assets/Sprite/musica.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('sonidoBtn', 'assets/Sprite/sonido.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('controlesBtn', 'assets/Sprite/controles.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('salirBtn', 'assets/Sprite/salir.png', { frameWidth: 32, frameHeight: 32 });
  }

  create(data) {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Fondo semitransparente
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0);

    // Imagen central del panel de opciones
    const fondoUI = this.add.image(centerX, centerY, 'opcionesUI').setDisplaySize(700, 600).setOrigin(0.5);

    // Animaciones
    this.anims.create({ key: 'idle_musica', frames: [{ key: 'musicaBtn', frame: 1 }] });
    this.anims.create({ key: 'activo_musica', frames: [{ key: 'musicaBtn', frame: 3 }] });

    this.anims.create({ key: 'idle_sonido', frames: [{ key: 'sonidoBtn', frame: 1 }] });
    this.anims.create({ key: 'activo_sonido', frames: [{ key: 'sonidoBtn', frame: 3 }] });

    this.anims.create({ key: 'idle_controles', frames: [{ key: 'controlesBtn', frame: 1 }] });
    this.anims.create({ key: 'hover_controles', frames: [{ key: 'controlesBtn', frame: 3 }] });

    this.anims.create({ key: 'idle_salir', frames: [{ key: 'salirBtn', frame: 1 }] });
    this.anims.create({ key: 'hover_salir', frames: [{ key: 'salirBtn', frame: 3 }] });

    // Botón de música
    const musicaBtn = this.add.sprite(centerX - 100, centerY + 30, 'musicaBtn').setInteractive().setScale(1.5);
    musicaBtn.play('activo_musica');
    musicaBtn.on('pointerdown', () => {
      this.musicaActiva = !this.musicaActiva;
      musicaBtn.play(this.musicaActiva ? 'activo_musica' : 'idle_musica');
      console.log(`Música ${this.musicaActiva ? 'activada' : 'desactivada'}`);
    });

    // Botón de sonido
    const sonidoBtn = this.add.sprite(centerX + 100, centerY + 30, 'sonidoBtn').setInteractive().setScale(1.5);
    sonidoBtn.play('activo_sonido');
    sonidoBtn.on('pointerdown', () => {
      this.sonidoActivo = !this.sonidoActivo;
      sonidoBtn.play(this.sonidoActivo ? 'activo_sonido' : 'idle_sonido');
      console.log(`Sonido ${this.sonidoActivo ? 'activado' : 'desactivado'}`);
    });

    // Botón de controles
    const controlesBtn = this.add.sprite(centerX, centerY - 60, 'controlesBtn').setInteractive().setScale(1.5);
    controlesBtn.play('idle_controles');
    controlesBtn.on('pointerover', () => controlesBtn.play('hover_controles'));
    controlesBtn.on('pointerout', () => controlesBtn.play('idle_controles'));
    controlesBtn.on('pointerdown', () => {
      this.scene.start('Controles', { desde: 'Opciones' });
    });

    // Botón de salir en la ESQUINA SUPERIOR DERECHA del panel
    const salirBtn = this.add.sprite(centerX + 420, centerY - 230, 'salirBtn').setInteractive().setScale(2.5);
    salirBtn.play('idle_salir');
    salirBtn.on('pointerover', () => salirBtn.play('hover_salir'));
    salirBtn.on('pointerout', () => salirBtn.play('idle_salir'));
    salirBtn.on('pointerdown', () => {
      this.scene.start('Menu');
    });

    // Salir también con ESC
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('Menu');
    });
  }
}

window.Opciones = Opciones;
