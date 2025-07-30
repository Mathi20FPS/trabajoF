class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('espacio', 'assets/Tiles/espacio.png');
    this.load.image('suelo', 'assets/Tiles/suelo.png');
    this.load.image('pared', 'assets/Tiles/pared.png');
    this.load.image('cielo', 'assets/Tiles/cielo.jpg');
    this.load.image('plataforma', 'assets/Tiles/plataforma.png');
    this.load.image('fondo', 'assets/Tiles/fondo.png');
    this.load.tilemapTiledJSON('mapaf', 'assets/Tilemaps/mapaf.json');
    this.load.spritesheet('jugador', 'assets/Sprite/Caminar-32x32.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('pajaro', 'assets/Sprite/pajaro.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('pajaro2', 'assets/Sprite/pajaro2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('huevo', 'assets/Sprite/huevo.png');
    this.load.spritesheet('nave', 'assets/Sprite/nave.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('rayo', 'assets/Sprite/rayo.png', { frameWidth: 2, frameHeight: 40 });
    this.load.spritesheet('enemigoE', 'assets/Sprite/enemigoE.png', { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    this.alturaMaxima = 1000;
    this.paused = false;
    this.puntos = 0;
    this.metros = 0;
    this.tiempo = 0;

    if (this.jugador) {
      this.jugador.destroy();
      this.jugador = null;
    }

    this.plataformas = this.physics.add.group({ immovable: true, allowGravity: false });
    this.enemigos = this.physics.add.group();
    this.proyectiles = this.physics.add.group();

    this.cargarMapa('mapaf');

    this.metrosText = this.add.text(16, 16, 'Metros: 0', { fontSize: '20px', fill: '#ffffff' }).setScrollFactor(0);
    this.puntosText = this.add.text(16, 40, 'Puntos: 0', { fontSize: '20px', fill: '#ffffff' }).setScrollFactor(0);
    this.timerText = this.add.text(16, 64, 'Tiempo: 0s', { fontSize: '20px', fill: '#ffffff' }).setScrollFactor(0);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.tiempo++;
        this.timerText.setText('Tiempo: ' + this.tiempo + 's');
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.scene.isPaused('Game')) {
        this.scene.launch('Pausa');
        this.scene.pause();
      }
    });

    this.time.addEvent({
      delay: 7000,
      loop: true,
      callback: () => {
        if (this.metros >= 400) {
          this.generarEnemigoE();
        } else if (this.metros >= 300) {
          this.generarNave();
        } else if (this.metros >= 100) {
          this.generarPajaro();
        }
      }
    });

    this.anims.create({ key: 'pajaro_volar', frames: this.anims.generateFrameNumbers('pajaro', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'pajaro2_volar', frames: this.anims.generateFrameNumbers('pajaro2', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'nave_idle', frames: this.anims.generateFrameNumbers('nave', { start: 0, end: 3 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: 'rayo_anim', frames: this.anims.generateFrameNumbers('rayo', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });

    this.physics.add.overlap(this.jugador, this.proyectiles, () => {
      this.reiniciarJuego();
    });

    this.physics.add.collider(this.jugador, this.enemigos, (jugador, enemigo) => {
      if (jugador.body.velocity.y > 0 && jugador.y < enemigo.y) {
        enemigo.destroy();
        jugador.setVelocityY(-200);
      } else {
        this.reiniciarJuego();
      }
    });

    this.physics.add.collider(this.proyectiles, this.plataformas, (proj, plat) => {
      plat.destroy();
      proj.destroy();
    });

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
  }

  update() {
    if (!this.jugador || !this.jugador.body) return;

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

    if (this.spaceKey.isDown && body.blocked.down) {
      body.setVelocityY(-350);
    }

    const metrosActuales = Math.floor((this.alturaInicial - this.jugador.y) / 10);
    if (metrosActuales > this.metros) {
      this.metros = metrosActuales;
      this.metrosText.setText('Metros: ' + this.metros);
    }

    while (this.jugador.y < this.alturaMaxima - 200) {
      const nuevoMinY = this.alturaMaxima - 400;
      const nuevoMaxY = this.alturaMaxima - 100;
      this.generarPlataformas(nuevoMinY, nuevoMaxY, this.map.widthInPixels, this.offsetX);
      this.alturaMaxima = nuevoMinY;
    }

    if (this.jugador.y > this.alturaMaxima + 800) {
      this.reiniciarJuego();
    }
  }

  reiniciarJuego() {
    this.scene.start('GameOver', { altura: this.metros, tiempo: this.tiempo });
    this.metros = 0;
    this.tiempo = 0;
    this.puntos = 0;
  }

 generarPajaro() {
  const y = this.jugador.y - 200;
  const lado = Phaser.Math.Between(0, 1);
  const x = lado === 0
    ? this.offsetX + 20
    : this.offsetX + this.map.widthInPixels - 20;

  const velocidad = lado === 0 ? 100 : -100;
  const textura = lado === 0 ? 'pajaro2' : 'pajaro';
  const animacion = lado === 0 ? 'pajaro2_volar' : 'pajaro_volar';

  const pajaro = this.enemigos.create(x, y, textura);
  pajaro.setVelocityX(velocidad);
  pajaro.anims.play(animacion, true);
  pajaro.setDepth(1);
  pajaro.body.allowGravity = false;

  pajaro.huevoTimer = this.time.addEvent({
    delay: 1500,
    loop: true,
    callback: () => {
      if (!pajaro.active) {
        pajaro.huevoTimer.remove();
        return;
      }
      this.lanzarHuevo(pajaro.x, pajaro.y);
    }
  });
}


  lanzarHuevo(x, y) {
    const huevo = this.proyectiles.create(x, y, 'huevo');
    huevo.setVelocityY(200);
    huevo.body.allowGravity = false;
  }

  generarNave() {
  const y = this.jugador.y - 200;
  const lado = Phaser.Math.Between(0, 1);
  const x = lado === 0
    ? this.offsetX + 20
    : this.offsetX + this.map.widthInPixels - 20;

  const velocidad = lado === 0 ? 80 : -80;

  const nave = this.enemigos.create(x, y, 'nave');
  nave.body.allowGravity = false;
  nave.setVelocityX(velocidad);
  nave.play('nave_idle');

  this.time.delayedCall(Phaser.Math.Between(1000, 1500), () => {
    if (!nave.active) return;
    nave.setVelocityX(0);
    this.lanzarRayo(nave.x, nave.y + 10);

    this.time.delayedCall(1000, () => {
      if (nave.active) nave.setVelocityX(velocidad);
    });

    nave.rayoTimer = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        if (!nave.active) {
          nave.rayoTimer.remove();
          return;
        }
        this.lanzarRayo(nave.x, nave.y + 10);
      }
    });
  });
}
  lanzarRayo(x, y) {
    const rayo = this.proyectiles.create(x, y, 'rayo');
    rayo.play('rayo_anim');
    rayo.setVelocityY(300);
    rayo.body.allowGravity = false;

    this.time.delayedCall(3000, () => {
      if (rayo && rayo.active) rayo.destroy();
    });
  }

  generarEnemigoE() {
    const plataformasVisibles = this.plataformas.getChildren().filter(p =>
      p.y < this.jugador.y && p.y > this.jugador.y - 600
    );
    if (plataformasVisibles.length === 0) return;

    const plataforma = Phaser.Utils.Array.GetRandom(plataformasVisibles);
    const x = plataforma.x;
    const y = plataforma.y - 16;

    const enemigo = this.enemigos.create(x, y, 'enemigoE');
    enemigo.setImmovable(true);
    enemigo.body.allowGravity = false;

    enemigo.visionTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (!enemigo.active || !this.jugador.active) return;
        if (this.jugador.y > enemigo.y) return;

        const bloqueaVista = this.plataformas.getChildren().some(p => {
          return p.y < enemigo.y && p.y > this.jugador.y && Math.abs(p.x - this.jugador.x) < 32;
        });

        if (!bloqueaVista && Math.abs(this.jugador.x - enemigo.x) < 200) {
          this.lanzarRayo(enemigo.x, enemigo.y + 10);
        }
      }
    });
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

      const plataforma = this.plataformas.create(x + offsetX, y, 'plataforma').refreshBody();
      plataforma.setData('contado', false);

      y -= saltoY;
      lado = 1 - lado;
    }
  }

  cargarMapa(nombreMapa) {
    if (this.map) {
      this.layers?.forEach(layer => layer.destroy());
      this.plataformas?.clear(true, true);
    }

    const map = this.make.tilemap({ key: nombreMapa });
    const espacio = map.addTilesetImage('espacio', 'espacio');
    const fondo = map.addTilesetImage('fondo', 'fondo');
    const cielo = map.addTilesetImage('cielo', 'cielo');
    const pared = map.addTilesetImage('pared', 'pared');
    const suelo = map.addTilesetImage('suelo', 'suelo');

    const offsetX = (this.scale.width - map.widthInPixels) / 2;
    this.offsetX = offsetX;

    map.createLayer('Fondo', [espacio, fondo, cielo], offsetX, 0);
    const capaSuelo = map.createLayer('Suelo', [pared, suelo], offsetX, 0);
    capaSuelo.setCollisionByProperty({ colled: true });

    let x0 = offsetX + map.widthInPixels / 2;
    let y0 = map.heightInPixels - 64;

    this.jugador = this.physics.add.sprite(x0, y0, 'jugador', 0)
      .setOrigin(0.5, 1)
      .setBounce(0.1)
      .setCollideWorldBounds(true);
    this.jugador.body.setGravityY(15);

    this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('jugador', { start: 4, end: 9 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'idle', frames: [{ key: 'jugador', frame: 0 }], frameRate: 10 });

    this.jugador.anims.play('idle');
    this.cameras.main.startFollow(this.jugador);
    this.alturaInicial = y0;
    this.cameras.main.setBounds(0, 0, this.scale.width, map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.scale.width, map.heightInPixels);

    this.physics.add.collider(this.jugador, capaSuelo);

    this.map = map;
    this.alturaMaxima = y0;

    const plataformaInicial = this.plataformas.create(x0, y0 + 4, 'plataforma').refreshBody();
    plataformaInicial.setData('contado', true);

    this.generarPlataformas(0, y0 - 100, map.widthInPixels, offsetX);
  }
}
window.Game = Game;