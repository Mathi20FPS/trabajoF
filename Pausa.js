class Pausa extends Phaser.Scene {
  constructor() {
    super('Pausa');
  }

  preload() {
    this.load.image('opcionesUI', 'assets/Interfaz/pausa3.png');
    this.load.spritesheet('musicaBtn', 'assets/Sprite/musica.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('sonidoBtn', 'assets/Sprite/sonido.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('controlesBtn', 'assets/Sprite/controles.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('salirBtn', 'assets/Sprite/salir.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7).setOrigin(0);

    // Tamaño original menú
    let menuWidth = 700;
    let menuHeight = 600;

    // Límites máximos (90%)
    const maxWidth = this.scale.width * 0.9;
    const maxHeight = this.scale.height * 0.9;

    // Escalar ancho si necesario
    if (menuWidth > maxWidth) {
      const scale = maxWidth / menuWidth;
      menuWidth = maxWidth;
      menuHeight = menuHeight * scale;
    }

    // Escalar alto si necesario
    if (menuHeight > maxHeight) {
      const scale = maxHeight / menuHeight;
      menuHeight = maxHeight;
      menuWidth = menuWidth * scale;
    }

    this.add.image(centerX, centerY, 'opcionesUI').setDisplaySize(menuWidth, menuHeight).setOrigin(0.5);

    this.musicaOn = true;
    this.sonidoOn = true;

    // Animaciones
    this.anims.create({ key: 'activo_musica', frames: [{ key: 'musicaBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'inactivo_musica', frames: [{ key: 'musicaBtn', frame: 2 }], frameRate: 10 });

    this.anims.create({ key: 'activo_sonido', frames: [{ key: 'sonidoBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'inactivo_sonido', frames: [{ key: 'sonidoBtn', frame: 2 }], frameRate: 10 });

    this.anims.create({ key: 'idle_controles', frames: [{ key: 'controlesBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'hover_controles', frames: [{ key: 'controlesBtn', frame: 2 }], frameRate: 10 });

    this.anims.create({ key: 'idle_salir', frames: [{ key: 'salirBtn', frame: 0 }], frameRate: 10 });
    this.anims.create({ key: 'hover_salir', frames: [{ key: 'salirBtn', frame: 2 }], frameRate: 10 });

    // Posiciones relativas a menú (proporción según tamaño original 900x500)
    const relativePositions = {
      musicaBtn: { x: centerX - (90 / 900) * menuWidth, y: centerY + (100 / 500) * menuHeight },
      sonidoBtn: { x: centerX + (100 / 900) * menuWidth, y: centerY + (100 / 500) * menuHeight },
      controlesBtn: { x: centerX, y: centerY - (50 / 500) * menuHeight },
      salirBtn: { x: centerX + (169 / 900) * menuWidth, y: centerY - (180 / 500) * menuHeight }
    };

    // Crear botones con posiciones ajustadas y escalas fijas (puedes ajustar escalas si querés)
    const musicaBtn = this.add.sprite(relativePositions.musicaBtn.x, relativePositions.musicaBtn.y, 'musicaBtn').setInteractive().setScale(1.5);
    musicaBtn.play('activo_musica');
    musicaBtn.on('pointerdown', () => {
      this.musicaOn = !this.musicaOn;
      musicaBtn.play(this.musicaOn ? 'activo_musica' : 'inactivo_musica');
      console.log(`Música ${this.musicaOn ? 'activada' : 'desactivada'}`);
    });

    const sonidoBtn = this.add.sprite(relativePositions.sonidoBtn.x, relativePositions.sonidoBtn.y, 'sonidoBtn').setInteractive().setScale(1.5);
    sonidoBtn.play('activo_sonido');
    sonidoBtn.on('pointerdown', () => {
      this.sonidoOn = !this.sonidoOn;
      sonidoBtn.play(this.sonidoOn ? 'activo_sonido' : 'inactivo_sonido');
      console.log(`Sonido ${this.sonidoOn ? 'activado' : 'desactivado'}`);
    });

    const controlesBtn = this.add.sprite(relativePositions.controlesBtn.x, relativePositions.controlesBtn.y, 'controlesBtn').setInteractive().setScale(1.5);
    controlesBtn.play('idle_controles');
    controlesBtn.on('pointerover', () => controlesBtn.play('hover_controles'));
    controlesBtn.on('pointerout', () => controlesBtn.play('idle_controles'));
    controlesBtn.on('pointerdown', () => {
      this.scene.pause();
      this.scene.launch('Controles2');
    });

    const salirBtn = this.add.sprite(relativePositions.salirBtn.x, relativePositions.salirBtn.y, 'salirBtn').setInteractive().setScale(2);
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
