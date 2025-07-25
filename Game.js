class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.alturaMaxima = 600;
    this.paused = false;
    this.puntos = 0;
    this.metros = 0;
    this.usaPlataforma2 = false; // 🔸 Cambio importante
  }

  preload() {
    this.load.image('espacio', 'assets/tiles/espacio.png');
    this.load.image('suelo', 'assets/tiles/suelo.png');
    this.load.image('pared', 'assets/tiles/pared.png');
    this.load.image('cielo', 'assets/tiles/cielo.jpg');
    this.load.image('plataforma', 'assets/tiles/plataforma.png');
    this.load.image('plataforma2', 'assets/tiles/plataforma2.png'); // 🔸 Nueva imagen
    this.load.image('fondo', 'assets/tiles/fondo.png');
    this.load.tilemapTiledJSON('mapaf', 'assets/Tilemaps/mapaf.json');

    this.load.spritesheet('jugador', 'assets/Sprite/Caminar-32x32.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.image('pausaUI', 'assets/Interfaz/pausa.png');
  }

  create() {
    this.plataformas = this.physics.add.staticGroup();
    this.cargarMapa('mapaf');

    this.cursors = this.input.keyboard.createCursorKeys();

    this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.pKey.on('down', () => {
      this.scene.pause('Game');
      this.scene.launch('Pausa');
    });

    this.pausaUI = this.add.image(640, 360, 'pausaUI').setVisible(false).setDepth(10);

    this.metrosText = this.add.text(16, 16, 'Metros: 0', { fontSize: '20px', fill: '#ffffff' }).setScrollFactor(0);
    this.puntosText = this.add.text(16, 40, 'Puntos: 0', { fontSize: '20px', fill: '#ffffff' }).setScrollFactor(0);
  }

  update() {
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

    const metrosActuales = Math.floor((this.alturaInicial - this.jugador.y) / 10);
    if (metrosActuales > this.metros) {
      this.metros = metrosActuales;
      this.metrosText.setText('Metros: ' + this.metros);
    }

    // 🔸 Cambio de plataforma al llegar a 300 metros
    if (this.metros >= 300 && !this.usaPlataforma2) {
      this.usaPlataforma2 = true;
    }

    if (this.salirZone && Phaser.Geom.Intersects.RectangleToRectangle(this.jugador.getBounds(), this.salirZone.getBounds())) {
      this.scene.start('Win');
    }

    if (this.jugador.y < this.alturaMaxima - 200) {
      const nuevoMinY = this.alturaMaxima - 400;
      const nuevoMaxY = this.alturaMaxima - 100;
      this.generarPlataformas(nuevoMinY, nuevoMaxY, this.map.widthInPixels, this.offsetX);
      this.alturaMaxima = nuevoMinY;
    }

    if (this.jugador.y > this.alturaMaxima + 800) {
      this.scene.restart();
    }
  }

  generarPlataformas(yMin, yMax, anchoMapa, offsetX = 0) {
    const margenLateral = 150;
    const anchoJugable = anchoMapa - 2 * margenLateral;
    const saltoY = 140;

    let y = yMax;
    let lado = Phaser.Math.Between(0, 1);

    while (y > yMin) {
      const mitad = anchoJugable / 2;
      let x = lado === 0
        ? margenLateral + Phaser.Math.Between(50, mitad - 50)
        : margenLateral + mitad + Phaser.Math.Between(50, mitad - 50);

      const tipo = this.usaPlataforma2 ? 'plataforma2' : 'plataforma'; // 🔸 Usa plataforma2 si ya pasamos los 300m
      const plataforma = this.plataformas.create(x + offsetX, y, tipo).refreshBody();
      plataforma.setData('contado', false);
      y -= saltoY;
      lado = 1 - lado;
    }
  }

  cargarMapa(nombreMapa) {
    if (this.map) {
      this.layers?.forEach(layer => layer.destroy());
      this.plataformas?.clear(true, true);
      if (this.salirZone) this.salirZone.destroy();
    }

    const map = this.make.tilemap({ key: nombreMapa });
    const espacio = map.addTilesetImage('espacio', 'espacio');
    const fondo = map.addTilesetImage('fondo', 'fondo');
    const cielo = map.addTilesetImage('cielo', 'cielo');
    const pared = map.addTilesetImage('pared', 'pared');
    const suelo = map.addTilesetImage('suelo', 'suelo');

    const offsetX = (this.scale.width - map.widthInPixels) / 2;
    this.offsetX = offsetX;
    const offsetY = 0;

    map.createLayer('Fondo', [espacio, fondo, cielo], offsetX, offsetY);
    const capaSuelo = map.createLayer('Suelo', [pared, suelo], offsetX, offsetY);
    capaSuelo.setCollisionByProperty({ colled: true });

    let x0 = offsetX + map.widthInPixels / 2;
    let y0 = map.heightInPixels - 64;

    const objetosLayer = map.getObjectLayer('Objetos');
    if (objetosLayer) {
      const salida = objetosLayer.objects.find(obj => obj.name === 'salir' && obj.class === 'puerta');
      if (salida) {
        y0 = salida.y;
        x0 = offsetX + salida.x;

        this.salirZone = this.add.zone(offsetX + salida.x, salida.y, salida.width, salida.height);
        this.physics.world.enable(this.salirZone);
        this.salirZone.body.setAllowGravity(false);
        this.salirZone.body.setImmovable(true);
        this.salirZone.setVisible(false);
      }
    }

    if (!this.jugador) {
      this.jugador = this.physics.add.sprite(x0, y0, 'jugador', 0)
        .setOrigin(0.5, 1)
        .setBounce(0.1)
        .setCollideWorldBounds(true);
      this.jugador.body.setGravityY(15);

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
      this.cameras.main.startFollow(this.jugador);
    } else {
      this.jugador.setPosition(x0, y0);
      this.jugador.setVelocity(0, 0);
    }

    this.alturaInicial = y0;
    this.cameras.main.setBounds(0, 0, this.scale.width, map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.scale.width, map.heightInPixels);

    this.physics.add.collider(this.jugador, capaSuelo);

    this.physics.add.collider(this.jugador, this.plataformas, (jugador, plataforma) => {
      if (jugador.body.velocity.y > 0 && jugador.y < plataforma.y) {
        if (!plataforma.getData('contado')) {
          plataforma.setData('contado', true);
          this.puntos += 10;
          this.puntosText.setText('Puntos: ' + this.puntos);
        }
        return true;
      }
      return false;
    }, null, this);

    this.map = map;
    this.alturaMaxima = y0;

    const plataformaInicial = this.plataformas.create(x0, y0 + 4, 'plataforma').refreshBody();
    plataformaInicial.setData('contado', true);
    this.generarPlataformas(0, y0 - 100, map.widthInPixels, offsetX);
  }
}

window.Game = Game;
