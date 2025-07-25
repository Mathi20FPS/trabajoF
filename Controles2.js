class Controles2 extends Phaser.Scene {
  constructor() {
    super('Controles2');
  }

  preload() {
    this.load.spritesheet('arriba', 'assets/Sprite/arriba.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('izquierda', 'assets/Sprite/izquierda.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('derecha', 'assets/Sprite/derecha.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('esc', 'assets/Sprite/esc.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('salirBtn', 'assets/Sprite/salir.png', { frameWidth: 32, frameHeight: 32 });
  }

  create(data) {
    this.cameras.main.setBackgroundColor('#000000');

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x111111, 1).setOrigin(0);

    this.add.text(centerX, 80, 'CONTROLES DEL JUEGO', {
      fontSize: '36px',
      fontFamily: 'monospace',
      color: '#ffcc00'
    }).setOrigin(0.5);

    ['arriba', 'izquierda', 'derecha', 'esc'].forEach(nombre => {
      this.anims.create({
        key: `idle_${nombre}_2`,
        frames: this.anims.generateFrameNumbers(nombre, { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
      });
    });

    this.add.sprite(centerX, centerY - 70, 'arriba').setInteractive().setScale(2).play('idle_arriba_2');
    this.add.text(centerX, centerY - 110, 'Salto', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    this.add.sprite(centerX - 80, centerY - 20, 'izquierda').setInteractive().setScale(2).play('idle_izquierda_2');
    this.add.text(centerX - 150, centerY - 20, 'Izquierda', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    this.add.sprite(centerX + 80, centerY - 20, 'derecha').setInteractive().setScale(2).play('idle_derecha_2');
    this.add.text(centerX + 150, centerY - 20, 'Derecha', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    this.add.sprite(centerX + 200, centerY - 140, 'esc').setInteractive().setScale(2).play('idle_esc_2');
    this.add.text(centerX + 200, centerY - 180, 'Pausa', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    this.anims.create({ key: 'hover_salir_2', frames: [{ key: 'salirBtn', frame: 1 }], frameRate: 10 });
    this.anims.create({ key: 'idle_salir_2', frames: [{ key: 'salirBtn', frame: 0 }], frameRate: 10 });

    const salirBtn = this.add.sprite(centerX + 460, centerY - 240, 'salirBtn')
      .setInteractive()
      .setScale(2.5)
      .play('idle_salir_2');

    salirBtn.on('pointerover', () => salirBtn.play('hover_salir_2'));
    salirBtn.on('pointerout', () => salirBtn.play('idle_salir_2'));

    salirBtn.on('pointerdown', () => {
      this.scene.stop();
      this.scene.resume('Pausa');
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume('Pausa');
    });
  }
}

window.Controles2 = Controles2;
