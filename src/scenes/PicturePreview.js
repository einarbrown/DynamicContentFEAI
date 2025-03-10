import Phaser, { Loader } from 'phaser'

export default class PicturePreview extends Phaser.Scene
{
    
    init(data) {
        this.picturePosition = 0
        this.gameData = data
        this.gameContext = data.gameContext
    }

    preload() {
       
    }

    create() {
        
        //Create placeholders for images (empty squars)
        this.emptyPic1 = this.add.graphics();
        this.emptyPic1.fillStyle(0x808080, 1);
        this.emptyPic1.fillRect(320, 200, 360, 205);

        this.emptyPic2 = this.add.graphics();
        this.emptyPic2.fillStyle(0x808080, 1);
        this.emptyPic2.fillRect(700, 200, 205, 205);

        this.emptyPic3 = this.add.graphics();
        this.emptyPic3.fillStyle(0x808080, 1);
        this.emptyPic3.fillRect(925, 200, 205, 205);

        this.emptyPic4 = this.add.graphics();
        this.emptyPic4.fillStyle(0x808080, 1);
        this.emptyPic4.fillRect(1150, 200, 205, 205);

        // Initialisera färger för interpolering
        this.startColor = Phaser.Display.Color.ValueToColor(0x808080);
        this.endColor = Phaser.Display.Color.ValueToColor(0xFFFFFF);
        this.currentColor = Phaser.Display.Color.ValueToColor(0x808080);

        // Används för att hålla reda på interpoleringens riktning
        this.colorLerp = 0;
        this.lerpSpeed = 0.005; // Hastighet på interpoleringen

        //this.updateProgressBar(this.gameData.loaded)
        this.loadingtext = this.add.text(300, 300, `Background is loading. `, 
        {   fontFamily: '"Press Start 2P"',
            fontSize: '30px', fill: '#ffffff' ,
            align: 'center'
        });
        this.loadingtext.setPosition(
            (this.cameras.main.width - this.loadingtext.width) / 2, 
            (this.cameras.main.height - this.loadingtext.height) / 2
        );

        this.load.image('background', this.getBackgroundUrl(this.gameContext.environment))
        this.load.once('complete', () => {
            this.gameData.imagesPreviewed = 0
            this.gameData.loaded = 0.1
            this.gameData.newLoad = 0.3
            this.loadImage(`Hero is loading. ` + this.gameContext.Hero, 'hero', 'background', this.gameContext.Hero, 480, 0.24)
        });
        this.load.start();

       
    }

    update()
    {
        if(this.gameData.imagesPreviewed == -1)
        {
            this.emptyPicPulsing(this.emptyPic1, 320, 200, 360, 205)
        }
        if(this.gameData.imagesPreviewed == 0)
        {
            this.emptyPicPulsing(this.emptyPic2, 700, 200, 205, 205)
        }
        if(this.gameData.imagesPreviewed == 1)
        {
            this.emptyPicPulsing(this.emptyPic3, 925, 200, 205, 205)
        }
        if(this.gameData.imagesPreviewed == 2)
        {
            this.emptyPicPulsing(this.emptyPic4, 1150, 200, 205, 205)
        }
        

    }

    emptyPicPulsing(emptyPic, x, y, width, height)
    {
                //pulserande färg
            // Uppdatera colorLerp-värdet för att skapa en pulserande effekt
            this.colorLerp += this.lerpSpeed;
            if (this.colorLerp >= 1 || this.colorLerp <= 0) {
                this.lerpSpeed *= -1; // Ändra riktning när vi når slutet eller början av interpoleringen
            }
    
            // Interpolera mellan start- och slutvärdet för färgen baserat på colorLerp
            let newColor = Phaser.Display.Color.Interpolate.ColorWithColor(
                this.startColor,
                this.endColor,
                100,
                this.colorLerp * 100
            );
    
        // Uppdatera färgen på rektangeln
        emptyPic.clear(); // Rensa tidigare ritning
        emptyPic.fillStyle(Phaser.Display.Color.GetColor(newColor.r, newColor.g, newColor.b), 1);
        emptyPic.fillRect(x, y, width, height);
    }

    loadImage(loadingText, imageToLoad, imageToShow, description, pictureWidth, scale)
    {
        this.picturePosition += pictureWidth + 20

        this.loadingtext.destroy()
        this.loadingtext = this.add.text(300, 100, loadingText, 
            { fontFamily: '"Press Start 2P"',
                fontSize: '30px', fill: '#ffffff',
                align: 'center'
            });
            this.loadingtext.setPosition(
                (this.cameras.main.width - this.loadingtext.width) / 2, 
                (this.cameras.main.height - this.loadingtext.height) / 2
            );

        this.add.image(this.picturePosition, 302,imageToShow).setScale(scale);
        this.load.image(imageToLoad, this.GetSpriteUrl(description));

        this.load.once('complete', () => {
            console.log('completed  ' + imageToLoad)
            this.gameData.imagesPreviewed += 1
            this.gameData.loaded +=0.2
            this.gameData.newLoad +=0.2

            if(this.gameData.imagesPreviewed == 1)
            {
                this.loadImage(`Enemy is loading. ` + this.gameContext.Enemy, 'enemy', 'hero', this.gameContext.Enemy, 280, 0.2)
            }
            else if(this.gameData.imagesPreviewed == 2)
            {
                this.loadImage(`Victim is loading. ` + this.gameContext.Victim, 'victim', 'enemy',this.gameContext.Victim, 205, 0.2)
            }
            else if(this.gameData.imagesPreviewed == 3)
            {

                this.add.image(this.picturePosition + pictureWidth + 20, 302,'victim').setScale(0.2);
                
                this.time.delayedCall(3000, () => {
                    // Koden här körs efter 3 sekunders fördröjning
                    this.scene.start('intro',this.gameContext)
                });
            }

        });
        this.load.start();
    }

    GetSpriteUrl(description) {
        //return 'http://localhost:3002/getSprite?description=' + encodeURIComponent(description);
        return 'https://dynamicdefencegameaibe.azurewebsites.net/getSprite?description=' + encodeURIComponent(description);
    }

    getBackgroundUrl(environment) {
        //return 'http://localhost:3002/getBackground?environment=' + encodeURIComponent(environment);
        return 'https://dynamicdefencegameaibe.azurewebsites.net/getBackground?environment=' + encodeURIComponent(environment);
    }
    
}
