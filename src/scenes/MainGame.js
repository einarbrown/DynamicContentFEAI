import Phaser, { Loader } from 'phaser'

export default class MainGame extends Phaser.Scene
{


    // init(data) {
    //     this.environment = data.environment;
    //     this.introText = data.introText;
    //     this.enemy = data.Enemy;    
    //     this.hero = data.Hero;
    //     this.victim = data.Victim;
    // }
    
     preload() {
        if (!this.textures.exists('background')) {
            this.load.image('background', 'background.png');
            console.log('backgrund')
        }
        if (!this.textures.exists('enemy')) {
            this.load.image('enemy', 'tiger.png');
            console.log('enemy')
        }
        if (!this.textures.exists('hero')) {
            this.load.image('hero', 'parrot2.png');
            console.log('hero')
        }
        if (!this.textures.exists('victim')) {
            this.load.image('victim', 'panda.png');
            console.log('victim')
        }
        this.load.image('particle', 'particle.png');
        
    }

    create() {
        this.score = 0
        
        //Background
        this.physics.world.setBounds(0,0,this.game.config.width,this.game.config.height-50,false,false,true,true)
        this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5,'background')

        //poäng
        this.scoreText = this.add.text(1400, 100, 'Score: 0', { fontFamily: '"Press Start 2P"',fontSize: '32px', fill: '#ffffff' }); // Visa poängen på skärmen
        
        // Setup Hero
        this.heroSprite = this.physics.add.sprite(1100, 300, 'hero');
        this.setupSprite(this.heroSprite, 0.2, 0.2, 0, 1000)

        //Setup enemy
        this.enemySprite = this.physics.add.sprite(1400, 1100, 'enemy');
        this.setupSprite(this.enemySprite, 0.3, 0.2, 0, 1000)

        // Setup Victims
        this.victims = this.physics.add.group();

        //timer som skapar offer

        // Skapar en timer som anropar spawnVictim regelbundet
        this.currentDelay = 10000; // Starta med en fördröjning på 10 sekunder (10000 millisekunder)
        this.minimumDelay = 1000;  // Målet är att minska fördröjningen till 1 sekund
        this.decreaseAmount = 500; // Mängden att minska fördröjningen med varje steg

        this.spawnTimer = this.time.addEvent({
            delay: this.currentDelay,
            callback: () => {
                this.spawnVictim();

                // Uppdatera fördröjningen för nästa anrop om den är högre än minimumDelay
                if (this.currentDelay > this.minimumDelay) {
                    this.currentDelay -= this.decreaseAmount; // Minska fördröjningen
                    this.currentDelay = Math.max(this.currentDelay, this.minimumDelay); // Se till att inte gå under minimumDelay
                    this.spawnTimer.delay = this.currentDelay; // Uppdatera timerns fördröjning
                }
            },
            callbackScope: this,
            loop: true
        });

        

        //colliding
        this.physics.add.collider(this.heroSprite, this.enemySprite);
        this.physics.add.collider(this.victims, this.enemySprite, this.onVictimHitEnemy, null, this);
        

        // Skapa tangentbordshanterare
        this.cursors = this.input.keyboard.createCursorKeys();
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.returnKey.on("down", event => {
            this.scene.start("title")
        });

            // Aktivera pekinmatning
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointerup', this.onPointerUp, this);

        // Variabler för att spara startpositionen av en pekrörelse
        this.touchStartX = 0;
        this.touchStartY = 0;

        //partiklar
        this.emitter = this.add.particles(0,0,'particle',{
            speed: { min: -20, max: 20 }, // Partiklar rör sig åt olika håll med liten hastighet
            angle: { min: -50, max: -150 }, // Sprid partiklarna åt alla håll
            scale: { start: 0, end: 0.01 }, // Partiklarna börjar synliga men krymper bort
            alpha: { start: 1, end: 0 }, // Börjar helt opak och blir genomskinlig
            lifespan: 600, // Kort livslängd för att simulera snabbt försvinnande damm
            quantity: 100, // Antal partiklar som släpps ut vid varje stamp
            on: false, // Sätt till false för att inte börja emittera direkt
            blendMode:'ADD',
            
        });
        this.emitter.stop();
        // För att stoppa emittern efter en viss tid
        // this.time.addEvent({
        //     delay: 1000, // Stoppa efter 2000 millisekunder
        //     callback: () => {
        //         this.emitter.stop();
        //     }
        // });

        
    }

    update() {
        
        // Kontrollera om spelet körs på en enhet med pekskärm
        let isTouchDevice = this.sys.game.device.input.touch;

        // Hantera tangentbordsinput endast om det inte är en pekenhet
        if (!isTouchDevice) {

            // Hantera tangentbordsinput
            if (this.cursors.left.isDown) {
                this.heroSprite.setAccelerationX(-800);
            } else if (this.cursors.right.isDown) {
                this.heroSprite.setAccelerationX(800);
            }
            else {
                // Ingen tangent är nedtryckt, tillämpa inbromsning
                this.heroSprite.setAccelerationX(0);
            }
            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                // Knuffa hjälten uppåt
                this.heroSprite.setVelocityY(-250); // Justera värdet för att ändra "knuffens" styrka
            }

            this.victims.getChildren().forEach(vic => {
                if (vic.x > this.sys.game.config.width) {
                    this.score += 1;
                    this.scoreText.setText('Score: ' + this.score); 
                    vic.destroy();
                }
                if (vic.y > this.sys.game.config.height-150) {
                    this.particleEffect(vic.x,vic.y);
                }

            });
        }
    }

    spawnVictim() {
        // Skapa en ny panda-sprite vid en specifik position
        // Anpassa x och y koordinaterna efter var du vill att pandorna ska skapas
        let victimSprite = this.victims.create(0, Phaser.Math.Between(10, 400), 'victim');
        this.setupSprite(victimSprite, 0.2, 1,Phaser.Math.Between(50, 300),0)
        this.physics.add.collider(victimSprite, this.enemySprite,this.gameOver);
        this.physics.add.collider(victimSprite, this.heroSprite);
        this.physics.add.collider(victimSprite, this.victims);
        
    }

    particleEffect(x,y) 
    {
        this.emitter.explode(20, x , y);
    }

    setupSprite(sprite, scale, bounce, velocity, drag)
    {
        sprite.setScale(scale);
        sprite.setCollideWorldBounds(true)
        sprite.body.setSize(1024 -350, 1024 - 350);
        sprite.setBounce(bounce)
        sprite.setDrag(drag, 0); // Sätt inbromsning (x-axel, y-axel)
        sprite.setMaxVelocity(300, 1000); // Maxhastighet (x-axel, y-axel)
        sprite.body.setVelocityX(velocity)
    }

    onVictimHitEnemy(vitim, enemy)
    {
        console.log("gameover")
        this.scene.start('gameOver', this.score);
    }

    onPointerDown(pointer) {
        // Spara startpositionen för pekrörelsen
        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
    }
    
    onPointerUp(pointer) {
        // Beräkna rörelsen
        let dx = pointer.x - this.touchStartX;
        let dy = pointer.y - this.touchStartY;
    
        // Sätt en tröskel för hur lång svepet måste vara för att räknas (här: 10px)
        let swipeThreshold = 10;
    
        // Detektera sveprörelser
        if (dx < -swipeThreshold) {
            // Svep vänster
            this.heroSprite.setAccelerationX(-800);
        } else if (dx > swipeThreshold) {
            // Svep höger
            this.heroSprite.setAccelerationX(800);
        }
    
        if (dy < -swipeThreshold) {
            // Svep uppåt (för jump)
            this.heroSprite.setVelocityY(-250); // Justera värdet för att ändra "knuffens" styrka
        }
    }
    
    
}
