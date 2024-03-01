import Phaser, { Loader } from 'phaser'

export default class Intro extends Phaser.Scene
{

    init(data) {
        this.introText = data.introText
        //this.introText = "Dyk ner i det djupa havet och anta rollen som den modiga och skickliga dykaren som ska rädda de stackars strandsatta sjöhästarna från den hungriga och luriga hajen. Använd piltangenterna och låt äventyret börja..."
    }

    create() {
        const fullText = this.introText + "\n\n Tryck enter för att starta.";
        let currentText = '';
        let displayText = this.add.text(0, 0, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '39px',
            fill: '#ffffff',
            wordWrap: { width: 1000 } // Maximal bredd för texten innan radbrytning
        });

             // Funktion för att lägga till en bokstav till textobjektet
        const addLetter = () => {
            // Lägg till nästa bokstav i strängen
            currentText += fullText[currentText.length];
            displayText.setPosition(
                (this.cameras.main.width - displayText.width) / 2, 
                (this.cameras.main.height - displayText.height) / 2
            );

            // Uppdatera textobjektet med den nya strängen
            displayText.setText(currentText);

            // Kontrollera om hela texten har skrivits ut
            if (currentText.length === fullText.length) {
                this.time.removeEvent(typingTimer);
            }
        };

        // Skapa en timer som kallar på addLetter var 100:e millisekund
        const typingTimer = this.time.addEvent({
            delay: 100, // Tiden mellan varje bokstav i millisekunder
            callback: addLetter,
            callbackScope: this,
            loop: true
        });



        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
                this.scene.start('game')
        });
    }
    
}
