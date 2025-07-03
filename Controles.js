class Controles extends Phaser.Scene {
  constructor() {
    super('Controles');
  }

  preload() {
    this.load.image('fondoControles', 'assets/Interfaz/controlesUI.png'); // Opcional

    this.load.spritesheet('arriba', 'assets/Sprite/arriba.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('izquierda', 'assets/Sprite/izquierda.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('derecha', 'assets/Sprite/derecha.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('esc', 'assets/Sprite/esc.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('salirBtn', 'assets/Sprite/salir.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0);

    this.add.text(centerX, 100, '¿CÓMO JUGAR?', {
      fontSize: '40px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // ─── Crear animaciones en bucle ───
    const teclas = ['arriba', 'abajo', 'izquierda', 'derecha', 'esc'];
    teclas.forEach(nombre => {
      this.anims.create({
        key: `idle_${nombre}`,
        frames: this.anims.generateFrameNumbers(nombre, { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1 // Bucle infinito
      });
    });

    // ─── Botones estilo teclado ───
    const teclaArriba = this.add.sprite(centerX, centerY - 70, 'arriba').setInteractive().setScale(2).play('idle_arriba');
    const teclaIzquierda = this.add.sprite(centerX - 80, centerY - 20, 'izquierda').setInteractive().setScale(2).play('idle_izquierda');
    const teclaDerecha = this.add.sprite(centerX + 80, centerY - 20, 'derecha').setInteractive().setScale(2).play('idle_derecha');
    const teclaEsc = this.add.sprite(centerX + 200, centerY - 140, 'esc').setInteractive().setScale(2).play('idle_esc');

    // ─── Textos explicativos ───
    this.add.text(teclaArriba.x, teclaArriba.y - 50, 'Saltar', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.add.text(teclaIzquierda.x - 90, teclaIzquierda.y, 'Izquierda', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.add.text(teclaDerecha.x + 70, teclaDerecha.y, 'Derecha', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    this.add.text(teclaEsc.x, teclaEsc.y - 40, 'Pausa', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    // ─── Botón salir ───
    this.anims.create({
      key: 'hover_salir',
      frames: [{ key: 'salirBtn', frame: 1 }],
      frameRate: 10
    });

    this.anims.create({
      key: 'idle_salir',
      frames: [{ key: 'salirBtn', frame: 0 }],
      frameRate: 10,
      repeat: -1
    });

    const salirBtn = this.add.sprite(centerX + 460, centerY - 240, 'salirBtn')
      .setInteractive()
      .setScale(2.5)
      .play('idle_salir');

    salirBtn.on('pointerover', () => salirBtn.play('hover_salir'));
    salirBtn.on('pointerout', () => salirBtn.play('idle_salir'));
    salirBtn.on('pointerdown', () => {
  if (this.scene.settings.data?.desde === 'Pausa') {
    this.scene.stop();
    this.scene.resume('Pausa');
  } else {
    this.scene.start('Opciones');
  }
});



   

   this.input.keyboard.on('keydown-ESC', () => {
  if (data.desde === 'Pausa') {
    this.scene.stop(); // Cierra Controles
    this.scene.resume('Pausa'); // Retoma pausa
  } else {
    this.scene.start('Opciones'); // Vuelve a Opciones
  }
});



  }
}

window.Controles = Controles;
