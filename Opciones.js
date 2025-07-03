class Opciones extends Phaser.Scene {
  constructor() {
    super('Opciones');
    this.musicaActiva = true;
    this.sonidoActivo = true;
  }

  preload() {
    this.load.image('opcionesUI', 'assets/Interfaz/opciones.png');

    this.load.spritesheet('musicaBtn', 'assets/Sprite/musica.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('sonidoBtn', 'assets/Sprite/sonido.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('controlesBtn', 'assets/Sprite/controles.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('salirBtn', 'assets/Sprite/salir.png', { frameWidth: 32, frameHeight: 32 });
  }

  create(data) {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Fondo oscuro
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0);

    // Interfaz de fondo
    this.add.image(centerX, centerY, 'opcionesUI').setDisplaySize(900, 500).setOrigin(0.5);

    // ─── Botón MÚSICA (abajo izquierda) ───
    const musicaBtn = this.add.sprite(centerX - 90, centerY + 100, 'musicaBtn')
      .setInteractive()
      .setScale(1.5)
      .setFrame(0);

    musicaBtn.on('pointerdown', () => {
      this.musicaActiva = !this.musicaActiva;
      musicaBtn.setFrame(this.musicaActiva ? 0 : 3);
      console.log(`Música ${this.musicaActiva ? 'activada' : 'desactivada'}`);
    });

    // ─── Botón SONIDO (abajo derecha) ───
    const sonidoBtn = this.add.sprite(centerX + 100, centerY + 100, 'sonidoBtn')
      .setInteractive()
      .setScale(1.5)
      .setFrame(0);

    sonidoBtn.on('pointerdown', () => {
      this.sonidoActivo = !this.sonidoActivo;
      sonidoBtn.setFrame(this.sonidoActivo ? 0 : 3);
      console.log(`Sonido ${this.sonidoActivo ? 'activado' : 'desactivado'}`);
    });

    // ─── Animaciones para controles y salir ───
    this.anims.create({
      key: 'hover_controles',
      frames: [{ key: 'controlesBtn', frame: 1 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'idle_controles',
      frames: [{ key: 'controlesBtn', frame: 0 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'hover_salir',
      frames: [{ key: 'salirBtn', frame: 1 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'idle_salir',
      frames: [{ key: 'salirBtn', frame: 0 }],
      frameRate: 10
    });

    // ─── Botón CONTROLES (debajo de "CONTROLES") ───
    const controlesBtn = this.add.sprite(centerX, centerY - 50, 'controlesBtn')
      .setInteractive()
      .setScale(1.5);

    controlesBtn.play('idle_controles');
    controlesBtn.on('pointerover', () => controlesBtn.play('hover_controles'));
    controlesBtn.on('pointerout', () => controlesBtn.play('idle_controles'));
    controlesBtn.on('pointerdown', () => {
      console.log('Mostrar controles (próximamente)');
    });

    // ─── Botón SALIR (esquina superior derecha) ───
    const salirBtn = this.add.sprite(centerX + 169, centerY - 180, 'salirBtn')
      .setInteractive()
      .setScale(2.5);

    salirBtn.play('idle_salir');
    salirBtn.on('pointerover', () => salirBtn.play('hover_salir'));
    salirBtn.on('pointerout', () => salirBtn.play('idle_salir'));
    salirBtn.on('pointerdown', () => {
      this.scene.start('Menu');
    });

    // ESC para volver
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('Menu');
    });

    controlesBtn.on('pointerdown', () => {
    this.scene.start('Controles', { desde: 'Opciones' });
    });


  }
}

window.Opciones = Opciones;
