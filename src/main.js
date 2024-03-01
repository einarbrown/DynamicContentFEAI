import Phaser from 'phaser'
import TitleScreen from './scenes/TitleScreen'
import MainGame from './scenes/MainGame'
import GameOver from './scenes/GameOver'
import PicturePreview from './scenes/PicturePreview'
import Intro from './scenes/Intro'
import BootScene from './scenes/BootScene'


const config = {
    width: 1792,
    height: 1024,
    backgroundColor:  "#A8DADC",
    type: Phaser.AUTO,
    parent: "game",
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // Sätt till true för att visa fysik-debbugeringsdata
        }
    },
    scale: {
        mode: Phaser.Scale.FIT, // Skalar spelet för att passa tillgängligt utrymme, bevarar aspektförhållandet
        autoCenter: Phaser.Scale.CENTER_BOTH // Centrerar spelet både horisontellt och vertikalt
    }
}

const game = new Phaser.Game(config)
game.scene.add('title',TitleScreen)
game.scene.add('game',MainGame)
game.scene.add('gameOver',GameOver)
game.scene.add('picturePreview',PicturePreview)
game.scene.add('intro',Intro)
game.scene.add('boot',BootScene)
//game.scene.start('title')
game.scene.start('boot')
//game.scene.start('game')

