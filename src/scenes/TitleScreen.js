import Phaser, { Loader } from 'phaser'

export default class TitleScreen extends Phaser.Scene
{
    
     preload() {
        this.load.html('input','input.html');

        if (this.textures.exists('background')) {
            this.textures.remove('background');
        }
        if (this.textures.exists('enemy')) {
            this.textures.remove('enemy');
        }
        if (this.textures.exists('hero')) {
            this.textures.remove('hero');
        }
        if (this.textures.exists('victim')) {
            this.textures.remove('victim');
        }
        
    }

    create() {
        let environmentInput = this.add.dom(800,200).createFromCache("input");
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        let button = environmentInput.node.querySelector("button");

        this.returnKey.on("down", event => {
            this.StartGame(environmentInput);
        });

        // Lägg till en eventlyssnare till knappen
        button.addEventListener("click", () => {
            this.StartGame(environmentInput);
        });

    }


    // update()
    // {
    //     pingRemoveBG();
    // }

    pingRemoveBG()
    {
        fetch('https://removebgnow.azurewebsites.net/api/http_trigger?code='+ removeBgCode)
        .then(response => response.json())
        .then(gameContext => {
        
            let gameData = {
                gameContext: gameContext,
                loaded: 0,
                newLoad:0.1,
                imagesPreviewed: -1
            };
            this.scene.start('picturePreview', gameData)


        })
        .catch(error => {
            console.error('Fel vid hämtning av game context:', error);
        });
    }

    StartGame(environmentInput) {
        let environment = environmentInput.getChildByName("environment");
        if (environment.value != "") {
            this.add.text(550, 600, `Creating environment.`, {  fontFamily: '"Press Start 2P"',fontSize: '39px', fill: '#ffffff' });
            console.log("skapar miljö: " + environment.value)
            this.fetchGameContext(environment.value);


        }
    }

    fetchGameContext(environment) {

        //fetch('http://localhost:3002/getGameContext?environment='+ environment)
        fetch('https://dynamicdefencegameaibe.azurewebsites.net/getGameContext?environment='+ environment)
        .then(response => response.json())
        .then(gameContext => {
        
            let gameData = {
                gameContext: gameContext,
                loaded: 0,
                newLoad:0.1,
                imagesPreviewed: -1
            };
            this.scene.start('picturePreview', gameData)


        })
        .catch(error => {
            console.error('Fel vid hämtning av game context:', error);
        });

    }
    
}
