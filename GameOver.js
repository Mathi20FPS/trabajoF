class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    this.metros = data.metros || 0;
    this.tiempo = parseFloat(data.tiempo) || 0;
  }

  create() {
  this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setOrigin(0.5);
  this.add.text(400, 200, 'MORISTE POR CAÍDA', {
    fontSize: '40px', color: '#FF5555', fontFamily: 'Arial'
  }).setOrigin(0.5);

  this.add.text(400, 270, `Recorriste ${this.alturaRecorrida} metros`, {
    fontSize: '28px', color: '#FFFFFF'
  }).setOrigin(0.5);

  this.add.text(400, 320, `Tiempo: ${this.tiempoFinal}`, {
    fontSize: '24px', color: '#AAAAAA'
  }).setOrigin(0.5);

  this.contador = 10;
  this.textoContador = this.add.text(400, 400, `Reiniciando en ${this.contador}`, {
    fontSize: '20px', color: '#CCCCCC'
  }).setOrigin(0.5);

  this.time.addEvent({
    delay: 1000,
    repeat: 9,
    callback: () => {
      this.contador--;
      this.textoContador.setText(`Reiniciando en ${this.contador}`);
      if (this.contador <= 0) {
        this.scene.start('Game');
      }
    }
  });
  this.scene.stop('Game');
  this.scene.start('Game');

}

}
