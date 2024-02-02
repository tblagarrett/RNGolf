class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.score = 0
        this.shots = 0
        this.success = this.score / this.shots
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)
        this.scoreDisplay = this.add.text(50, 50, 'Score: ' + this.score.toString())
        this.scoreDisplay.scale = 2

        this.shotDisplay = this.add.text(50, 100, 'Shots: ' + this.shots.toString())
        this.shotDisplay.scale = 2

        this.successDisplay = this.add.text(50, 150, 'Success: %' + Phaser.Math.FloorTo(this.success))
        this.successDisplay.scale = 2

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(.5)
        this.ball.body.setDamping(true).setDrag(.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.body.setImmovable(true)
        wallA.setCollideWorldBounds(true)
        wallA.setBounce(1)
        wallA.setDrag(0)
        wallA.setVelocityX(500)


        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y < this.ball.y ? 1 : -1
            let xDirection = pointer.x < this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(50, this.SHOT_VELOCITY_X) * xDirection)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
            this.shots++
            this.success = this.score / this.shots
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.body.setVelocityX(0)
            ball.body.setVelocityY(0)
            ball.setPosition(width / 2, height - height / 10)
            this.score++
            this.success = this.score / this.shots
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        this.scoreDisplay.text = 'Score: ' + this.score.toString()
        this.shotDisplay.text = 'Shots: ' + this.shots.toString()
        this.successDisplay.text = 'Success: %' + Phaser.Math.FloorTo(this.success)
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ ] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/