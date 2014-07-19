#= require jquery
#= require_tree .

$ ->
  materials = {
    images: {
      inactive:   "http://dummyimage.com/100x30.png&text=inac"
      raiseLeft:  "http://dummyimage.com/100x30.png&text=left"
      raiseRight: "http://dummyimage.com/100x30.png&text=right"
      enemy:      "http://dummyimage.com/30x30.png&text=e"
    }
    fonts: {
      google: {
        families: ["Share"]
      }
    }
  }

  # the canvas size should be (480, 480)
  canvas = CE.defines("canvas").extend([Animation, Hit, Input]).ready ->
    canvas.Scene.call("Title")

  canvas.Scene.New {
    name: "Title"
    materials: materials

    ready: (stage) ->
      # message "Press Enter"
      pressEnter = @createElement()
      pressEnter.font = '16pt "Share"'
      pressEnter.fillText("PRESS ENTER", 185, 350)
      stage.append(pressEnter)

      # watch keyboard
      canvas.Input.keyDown Input.Enter, () ->
        canvas.Input.clearKeys Input.Enter
        canvas.Scene.call("Wait", {params: {score: 0}})

    render: (stage) ->
      stage.refresh()
  }

  canvas.Scene.New {
    name: "Wait"
    materials: materials

    called: (stage) ->
      # draw character
      @me = @createElement()
      @me.drawImage "inactive", 190, 225
      stage.append(@me)

    ready: (stage, params) ->
      @params = params
      @time  = Math.floor(Math.random() * 50) + 100

    render: (stage) ->
      isTimeToFight = () =>
        if @time == 0
          true
        else
          @time -= 1
          false

      if isTimeToFight()
        canvas.Scene.call("Fight", {params: @params})
      else
        stage.refresh()
  }

  canvas.Scene.New {
    name: "Fight"
    materials: materials

    called: (stage) ->
      # draw character first to avoid glitch
      @me = Class.New("Entity", [stage])
      @me.rect(100, 30)
      @me.position(190, 225)
      @me.el.drawImage("inactive")
      stage.append(@me.el)

    ready: (stage, params) ->
      @state = "inactive"
      @score = params.score
      direction = [1, -1][Math.round(Math.random())]
      @speed = direction * (@score + 2)
      @stateToWin = ["raiseRight", "raiseLeft"][(direction+1)/2]
      @lock  = 0

      # summon enemy
      @enemy = Class.New("Entity", [stage])
      @enemy.rect(30)
      @enemy.position(270*(1 - direction) - 30, 225)
      @enemy.el.drawImage("enemy")
      stage.append(@enemy.el)

      canvas.Input.keyDown Input.Left, () =>
        if @lock == 0
          @state = "raiseLeft"
          @lock = 60
      canvas.Input.keyDown Input.Right, () =>
        if @lock == 0
          @state = "raiseRight"
          @lock = 60

    render: (stage) ->
      processLock = () =>
        if @lock == 0
          @state = "inactive"
        else
          @lock -= 1

      judgeAndCall = () =>
        @enemy.hit [@me], (el) =>
          if @state == @stateToWin
            canvas.Scene.call("Wait",  {params: {score: @score+1}})
          else
            canvas.Scene.call("Score", {params: {score: @score}})

      processLock()
      judgeAndCall()

      @me.el.drawImage(@state)
      @enemy.move(@speed)
      stage.refresh()
  }

  canvas.Scene.New {
    name: "Score"
    materials: materials

    ready: (stage, params) ->
      score = params.score
      result = @createElement()
      result.font = '16pt "Share"'
      result.fillText("SCORE: #{score}", 200, 200)
      stage.append(result)

      escToTitle = @createElement()
      escToTitle.font = '16pt "Share"'
      escToTitle.fillText("ESC TO TITLE", 185, 350)
      stage.append(escToTitle)

      canvas.Input.keyDown Input.Esc, () ->
        canvas.Scene.call("Title")

    render: (stage) ->
      stage.refresh()
  }
