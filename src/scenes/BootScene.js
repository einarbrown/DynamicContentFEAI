import Phaser, { Loader } from 'phaser'

export default class BootScene extends Phaser.Scene {
    // constructor() {
    //     super('BootScene');
    // }

    preload() {
        // Laddar Google Fonts genom WebFont Loader
        console.log("start loading font");
        this.loadGoogleFont('Press Start 2P');
        console.log("preload font loaded");
    }

    create() {
        // Efter att typsnittet har laddats, går vi vidare till nästa scen
        console.log("starting scene");
        this.scene.start('title');
    }

    loadGoogleFont(fontName) {
        const fontConfig = {
            google: {
                families: [fontName]
            },
            active: () => {
                // Kallas när typsnittet har laddats och är aktivt
                this.fontLoaded(fontName);
            }
        };

        WebFont.load(fontConfig);
    }

    fontLoaded(fontName) {
        console.log(`${fontName} font loaded`);
        // Här kan du initialisera spelet eller gå vidare till nästa scen
        // Eftersom vi använder 'active' callback, kommer denna funktion att köras när typsnittet är laddat
    }
}
