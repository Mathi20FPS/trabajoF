export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.alturaMaxima = 600;
  }

  preload() {
    this.load.image('cielo', 'assets/Tiles/cielo.jpg');
    this.load.image('pared', 'assets/Tiles/pared.png');
    this.load.image('fondo', 'assets/Tiles/fondo.png');
    this.load.image('suelo', 'assets/Tiles/suelo.png');
    this.load.image('plataforma', 'assets/Tiles/plataforma.png');
    this.load.tilemapTiledJSON('fondoC', 'assets/Tilemaps/Fondo C.json');
  }

  create() {
    // Mapa y tilesets
    this.map = this.make.tilemap({ key: 'fondoC' });
    const tilesetCielo = this.map.addTilesetImage('cielo', 'cielo');
    const tilesetFondo = this.map.addTilesetImage('fondo', 'fondo');
    const tilesetPared = this.map.addTilesetImage('pared', 'pared');
    const tilesetSuelo = this.map.addTilesetImage('suelo', 'suelo');

    this.map.createLayer('Fondo', [tilesetCielo, tilesetFondo], 0, 0);
    const capaSuelo = this.map.createLayer('Suelo', [tilesetSuelo, tilesetPared], 0, 0);
    capaSuelo.setCollisionByProperty({ colision: true });

    // Grupo de plataformas
    this.plataformas = this.physics.add.staticGroup();

    // Jugador
    const xInicial = this.map.widthInPixels / 2;
    const yInicial = this.map.heightInPixels - 64;
    this.jugador = this.add.rectangle(xInicial, yInicial, 32, 32, 0xff0000);
    this.physics.add.existing(this.jugador);
    this.jugador.body.setCollideWorldBounds(true);
    this.jugador.body.setBounce(0.2);

    // Plataforma base (justo debajo del jugador)
    this.plataformas.create(xInicial, yInicial + 40, 'plataforma').refreshBody();

    // Plataformas hacia arriba
    this.generarPlataformas(yInicial - 100, 0);

    // Colisiones
    this.physics.add.collider(this.jugador, capaSuelo);
    this.physics.add.overlap(this.jugador, this.plataformas, this.tocarPlataforma, null, this);

    // Cámara
    this.cameras.main.startFollow(this.jugador);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.alturaMaxima = yInicial;
  }

  update() {
    const body = this.jugador.body;

    // Movimiento
    if (this.cursors.left.isDown) {
      body.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(160);
    } else {
      body.setVelocityX(0);
    }

    if (this.cursors.up.isDown && body.blocked.down) {
      body.setVelocityY(-350);
    }

    // Plataformas infinitas
    if (this.jugador.y < this.alturaMaxima - 200) {
      this.generarPlataformas(this.alturaMaxima - 400, this.alturaMaxima - 100);
      this.alturaMaxima -= 300;
    }

    // Reiniciar si se cae
    if (this.jugador.y > this.map.heightInPixels + 200) {
      this.scene.restart();
    }
  }

  generarPlataformas(yMin, yMax) {
    const margen = 64;
    const ancho = this.map.widthInPixels;

    for (let y = yMax; y > yMin; y -= Phaser.Math.Between(120, 160)) {
      const cantidad = Phaser.Math.Between(1, 2);
      for (let i = 0; i < cantidad; i++) {
        const x = Phaser.Math.Between(margen, ancho - margen);
        this.plataformas.create(x, y, 'plataforma').refreshBody();
      }
    }
  }

  tocarPlataforma(jugador, plataforma) {
    const body = jugador.body;
    if (body.velocity.y > 0 && jugador.y < plataforma.y) {
      body.y = plataforma.y - body.height;
      body.velocity.y = 0;
      body.blocked.down = true;
    }
  }
}
