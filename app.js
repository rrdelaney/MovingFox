const game = new Phaser.Game(512, 512, Phaser.AUTO, 'root', {
  preload,
  create,
  update
})

function preload() {
  game.load.spritesheet('fox', 'assets/kit_from_firefox.png', 56, 80)
  game.load.spritesheet('tiles', 'assets/platformertiles.png', 32, 32)
}

let ground, player, cursors

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  cursors = game.input.keyboard.createCursorKeys()

  // Ground
  ground = game.add.group()
  ground.enableBody = true
  for (let i = 0; i < 16; ++i) {
    const tile = ground.create(i * 32, game.world.height - 32, 'tiles')
    tile.body.immovable = true

    if (i === 0) {
      tile.frame = 0
    } else if (i === 15) {
      tile.frame = 2
    } else {
      tile.frame = 1
    }
  }

  // Player
  player = game.add.sprite(32, game.world.height - 160, 'fox')
  game.physics.arcade.enable(player)
  player.body.bounce.y = 0.05
  player.body.gravity.y = 500
  player.body.collideWorldBounds = true
  player.animations.add('walk', [15, 16, 17], 10, true)
  player.animations.add('idle', [15, 9, 10, 11, 0], 8)
}

let idleTimeout = null

function update() {
  const hitGround = game.physics.arcade.collide(player, ground)

  if (player.body.velocity.x === 0 && player.body.touching.down) {
    if (!idleTimeout) {
      idleTimeout = setTimeout(() => {
        player.animations.play('idle')
        idleTimeout = null
      }, 3000)
    }
  } else {
    player.animations.stop()
    if (idleTimeout) clearTimeout(idleTimeout)
    idleTimeout = null
  }

  if (cursors.left.isDown) {
    player.body.velocity.x = -150
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150
  } else {
    player.body.velocity.x = 0
  }

  if (cursors.up.isDown && player.body.touching.down && hitGround) {
    player.body.velocity.y = -350
  }

  if (player.body.position.y >= 380 && player.body.velocity.y < -50) {
    player.frame = 6
  } else if (
    player.body.position.y >= 380 &&
    !player.animations.currentAnim.isPlaying
  ) {
    player.frame = 0
  } else if (player.body.velocity.y < -10) {
    player.frame = 7
  } else if (player.body.velocity.y > 10) {
    player.frame = 8
  }
}
