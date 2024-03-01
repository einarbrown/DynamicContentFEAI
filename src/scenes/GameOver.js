import Phaser, { Loader } from 'phaser'

export default class GameOver extends Phaser.Scene
{

    init(score) {
        this.finalScore = score
    }

    create() {
        let displayText = this.add.text(300, 500, `Game over! \n\nDin poäng blev: ` + this.finalScore, { 
            fontFamily: '"Press Start 2P"',
            fontSize: '40px', 
            fill: '#ffffff' ,
            align: 'center' });

        displayText.setPosition(
            (this.cameras.main.width - displayText.width) / 2, 
            (this.cameras.main.height - displayText.height) / 2
        );

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
                this.scene.start('title')
        });
    }
    
}
