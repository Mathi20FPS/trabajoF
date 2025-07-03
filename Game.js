class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.alturaMaxima = 600;
    this.paused = false;
  }

  preload() {
    this.load.image('cielo', 'assets/tiles/cielo.jpg');
    this.load.image('fondo', 'assets/tiles/fondo.png');
    this.load.image('pared', 'assets/tiles/pared.png');
    this.load.image('suelo', 'assets/tiles/suelo.png');
    this.load.image('plataforma', 'assets/tiles/plataforma.png');
    this.load.tilemapTiledJSON('fondoC', 'assets/Tilemaps/Fondo C.json');
    this.load.spritesheet('jugador', 'assets/Sprite/Caminar-32x32.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    // UI pausa corregida
    this.load.image('pausaUI', 'assets/Interfaz/pausa.png');
  }

  create() {
    const map = this.make.tilemap({ key: 'fondoC' });
    const cielo = map.addTilesetImage('cielo', 'cielo');
    const fondo = map.addTilesetImage('fondo', 'fondo');
    const pared = map.addTilesetImage('pared', 'pared');
    const suelo = map.addTilesetImage('suelo', 'suelo');

    map.createLayer('Fondo', [cielo, fondo], 0, 0);
    const capaSuelo = map.createLayer('Suelo', [suelo, pared], 0, 0);
    capaSuelo.setCollisionByProperty({ colled: true });

    this.plataformas = this.physics.add.staticGroup();

    const x0 = map.widthInPixels / 2;
    const y0 = map.heightInPixels - 64;

    this.jugador = this.physics.add.sprite(x0, y0, 'jugador', 0)
      .setOrigin(0.5, 1)
      .setBounce(0.1)
      .setCollideWorldBounds(true);

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('jugador', { start: 4, end: 9 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'jugador', frame: 0 }],
      frameRate: 10
    });

    this.jugador.anims.play('idle');

    this.plataformas.create(x0, y0 + 4, 'plataforma').refreshBody();
    this.generarPlataformas(0, y0 - 100, map.widthInPixels);

    this.physics.add.collider(this.jugador, capaSuelo);
    this.physics.add.collider(this.jugador, this.plataformas, (jugador, plataforma) => {
      return jugador.body.velocity.y > 0 && jugador.y < plataforma.y;
    }, null, this);

    this.cameras.main.startFollow(this.jugador);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.map = map;
    this.alturaMaxima = y0;

    // Pausa
    this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.pausaUI = this.add.image(640, 360, 'pausaUI').setVisible(false).setDepth(10);
  }

  update() {
   /* if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
      this.paused = !this.paused;
      this.pausaUI.setVisible(this.paused);
      if (this.paused) {
        this.physics.pause();
        this.jugador.anims.pause();
      } else {
        this.physics.resume();
        this.jugador.anims.resume();
      }
    }

    if (this.paused) return;*/
   this.input.keyboard.on('keydown-ESC', () => {
  this.scene.launch('Pausa', { desde: 'Game' });
  this.scene.pause();
});





    const body = this.jugador.body;
    const animActual = this.jugador.anims.getName();

    if (this.cursors.left.isDown) {
      body.setVelocityX(-160);
      this.jugador.setFlipX(true);
      if (animActual !== 'run') this.jugador.anims.play('run');
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(160);
      this.jugador.setFlipX(false);
      if (animActual !== 'run') this.jugador.anims.play('run');
    } else {
      body.setVelocityX(0);
      if (animActual !== 'idle') this.jugador.anims.play('idle');
    }

    if (this.cursors.up.isDown && body.blocked.down) {
      body.setVelocityY(-350);
    }

    if (this.jugador.y < this.alturaMaxima - 200) {
      this.generarPlataformas(
        this.alturaMaxima - 400,
        this.alturaMaxima - 100,
        this.map.widthInPixels
      );
      this.alturaMaxima -= 300;
    }

    if (this.jugador.y > this.map.heightInPixels + 200) {
      this.scene.restart();
    }
  }

  generarPlataformas(yMin, yMax, anchoMapa) {
    const margenX = 64;
    const saltoMinY = 100;
    const saltoMaxY = 160;
    let y = yMax;

    while (y > yMin) {
      const x = Phaser.Math.Between(margenX, anchoMapa - margenX);
      this.plataformas.create(x, y, 'plataforma').refreshBody();
      y -= Phaser.Math.Between(saltoMinY, saltoMaxY);
    }
  }
}

// Export global
window.Game = Game;
