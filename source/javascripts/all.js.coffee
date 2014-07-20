#= require jquery
#= require velocity/jquery.velocity.min.js
#= require_tree .

$ ->
  materials = {
    images: {
      inactive:   "images/me/inactive.png"
      raiseLeft:  "images/me/raiseLeft.png"
      raiseRight: "images/me/raiseRight.png"
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
      @me.drawImage "inactive", 210, 233
      stage.append(@me)

    ready: (stage, params) ->
      @params = params
      @time  = CE.random(90, 120)

      # kurukuru
      score = @params.score
      if score >= 3
        max = Math.pow(2, score-3) * 90
        angle = CE.random(Math.floor(max*0.8), max)
        $('#canvas').velocity({rotateZ: "#{angle}deg"}, 40*score + 900, "linear")

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
      @me.rect(60, 15)
      @me.position(210, 233)
      @me.el.drawImage("inactive")
      stage.append(@me.el)

    ready: (stage, params) ->
      @state = "inactive"
      @score = params.score
      direction = [1, -1][Math.round(Math.random())]
      speed = Math.min(0.7*@score + 1, 6)
      @speed = direction * (@score*0.7 + 1)
      @stateToWin = ["raiseRight", "raiseLeft"][(direction+1)/2]
      @lock  = 0
      @result = ""

      # summon enemy
      @enemy = Class.New("Entity", [stage])
      @enemy.rect(7.5)
      @enemy.position(270*(1 - direction) - 30, 233)
      @enemy.el.strokeStyle = "222222"
      @enemy.el.lineWidth = 2
      @enemy.el.strokeCircle(7.5)
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
      # decrement lock
      if @lock == 0
        @state = "inactive"
      else
        @lock -= 1

      # render character
      if @state == "inactive"
        @me.rect(60, 15)
        @me.position(210, 233)
      else
        @me.rect(100, 15)
        @me.position(190, 233)
      @me.el.drawImage(@state)

      switch @result
        when "win"
          @enemy.move(-@speed, -Math.abs(@speed))
          if (@enemy.el.x < -70 or 550 < @enemy.el.x)
            canvas.Scene.call("Wait",  {params: {score: @score+1}})
        when "lose"
          canvas.Scene.call("Score", {params: {score: @score}})
        when ""
          @enemy.move(@speed)
          # judge win or lose
          @enemy.hit [@me], (el) =>
            @result = (if @state == @stateToWin then "win" else "lose")

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

      enterToRetry = @createElement()
      enterToRetry.font = '16pt "Share"'
      enterToRetry.fillText("GAME OVER", 190, 350)
      stage.append(enterToRetry)

    render: (stage) ->
      stage.refresh()
  }
