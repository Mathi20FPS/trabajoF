class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.alturaMaxima = 600;
    this.paused = false;
    this.spawnTimers = {
      pajaro: 0,
      nave: 0,
      enemigoE: 0
    };
  }

  preload() {
    this.load.image('cielo', 'assets/tiles/cielo.jpg');
    this.load.image('plataforma', 'assets/tiles/plataforma.png');
    this.load.image('fondo', 'assets/tiles/fondo.png');
    this.load.spritesheet('player', 'assets/Sprite/caminar-32x32.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('pajaro', 'assets/Sprite/pajaro.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('pajaro2', 'assets/Sprite/pajaro2.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('nave', 'assets/Sprite/nave.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('huevo', 'assets/Sprite/huevo.png');
    this.load.spritesheet('rayo', 'assets/Sprite/rayo.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('enemigoE', 'assets/Sprite/enemigoE.png');
  }

  create() {
    this.add.image(240, 400, 'cielo').setScrollFactor(0);
    this.player = this.physics.add.sprite(240, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(500);

    this.plataformas = this.physics.add.staticGroup();
    this.generarPlataformasIniciales();

    this.enemigos = this.add.group();
    this.proyectiles = this.physics.add.group();

    this.physics.add.collider(this.player, this.plataformas);
    this.physics.add.overlap(this.player, this.proyectiles, this.morir, null, this);
    this.physics.add.overlap(this.player, this.enemigos, this.morir, null, this);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setLerp(0, 0.1);
   
    this.time.addEvent({
  delay: 8000,
  loop: true,
  callback: () => {
    if (this.metros >= 400) {
      this.generarEnemigoE();
    }
  }
});

  }

  update(time, delta) {
    this.moverJugador();

    const alturaJugador = Math.floor(this.player.y * -1 + 600);
    if (alturaJugador > this.alturaMaxima) {
      this.alturaMaxima = alturaJugador;
      this.generarPlataformas();
    }

    if (alturaJugador >= 100) this.spawnearPajaro(delta);
    if (alturaJugador >= 300) this.spawnearNave(delta);
    if (alturaJugador >= 400) this.spawnearEnemigoE();

    this.enemigos.children.iterate(enemigo => {
      if (enemigo.tipo === 'pajaro') {
        enemigo.x += enemigo.direccion * 1.5;
        if (enemigo.x < 0 || enemigo.x > 480) enemigo.direccion *= -1;
      }
      if (enemigo.tipo === 'nave' && enemigo.delay > 0) {
        enemigo.delay -= delta;
        if (enemigo.delay <= 0) {
          this.lanzarRayo(enemigo);
        }
      }
      if (enemigo.tipo === 'enemigoE') {
        if (this.jugadorVisible(enemigo)) {
          if (!enemigo.disparando) {
            enemigo.disparando = true;
            this.time.delayedCall(500, () => {
              this.lanzarRayo(enemigo);
              enemigo.disparando = false;
            });
          }
        }
      }
    });

    // Verifica si el jugador cae demasiado
    if (this.player.y > this.alturaMaxima + 400) {
      this.morir();
    }
  }

  moverJugador() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }
  }

  morir() {
    this.scene.restart();
  }

  generarPlataformasIniciales() {
    for (let y = 600; y > -400; y -= 100) {
      this.crearPlataforma(Phaser.Math.Between(50, 430), y);
    }
  }

  generarPlataformas() {
    let y = this.alturaMaxima * -1;
    for (let i = 0; i < 5; i++) {
      this.crearPlataforma(Phaser.Math.Between(50, 430), y);
      y -= 100;
    }
  }

  crearPlataforma(x, y) {
    this.plataformas.create(x, y, 'plataforma').refreshBody();
  }

  spawnearPajaro(delta) {
    this.spawnTimers.pajaro += delta;
    if (this.spawnTimers.pajaro >= 7000) {
      const lado = Phaser.Math.Between(0, 1);
      const x = lado === 0 ? -20 : 500;
      const y = this.player.y - 300;
      const sprite = lado === 0 ? 'pajaro2' : 'pajaro';
      const pajaro = this.enemigos.create(x, y, sprite);
      pajaro.tipo = 'pajaro';
      pajaro.direccion = lado === 0 ? 1 : -1;
      this.time.addEvent({
        delay: 1500,
        callback: () => {
          const huevo = this.proyectiles.create(pajaro.x, pajaro.y, 'huevo');
          huevo.setVelocityY(200);
        },
        callbackScope: this,
        loop: true
      });
      this.spawnTimers.pajaro = 0;
    }
  }

  spawnearNave(delta) {
    this.spawnTimers.nave += delta;
    if (this.spawnTimers.nave >= 7000) {
      const x = Phaser.Math.Between(50, 430);
      const y = this.player.y - 350;
      const nave = this.enemigos.create(x, y, 'nave');
      nave.tipo = 'nave';
      nave.delay = 500;
      this.spawnTimers.nave = 0;
    }
  }

  lanzarRayo(origen) {
    const rayo = this.proyectiles.create(origen.x, origen.y, 'rayo');
    rayo.setVelocityY(250);
  }

  generarEnemigoE() {
  const plataformasVisibles = this.plataformas.getChildren().filter(plataforma => {
    return plataforma.y < this.jugador.y - 100 && plataforma.y > this.jugador.y - 500;
  });

  if (plataformasVisibles.length === 0) return;

  const plataforma = Phaser.Utils.Array.GetRandom(plataformasVisibles);
  const enemigoE = this.enemigos.create(plataforma.x, plataforma.y - 20, 'enemigoE');
  enemigoE.body.allowGravity = false;
  enemigoE.setImmovable(true);
  enemigoE.tipo = 'enemigoE';
  enemigoE.disparando = false;

  this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      if (!enemigoE.active || !this.jugador.active) return;
      if (this.jugadorVisibleDesde(enemigoE)) {
        if (!enemigoE.disparando) {
          enemigoE.disparando = true;
          this.lanzarRayo(enemigoE.x, enemigoE.y + 10);
          this.time.delayedCall(1000, () => enemigoE.disparando = false);
        }
      }
    }
  });
}


  jugadorVisible(enemigo) {
    const jugador = this.player;
    const x1 = Math.min(enemigo.x, jugador.x);
    const x2 = Math.max(enemigo.x, jugador.x);
    const y1 = Math.min(enemigo.y, jugador.y);
    const y2 = Math.max(enemigo.y, jugador.y);

    const bloqueando = this.plataformas.getChildren().some(plataforma => {
      return plataforma.x >= x1 && plataforma.x <= x2 &&
             plataforma.y >= y1 && plataforma.y <= y2;
    });

    return !bloqueando;
  }
}
