#= require jquery
#= require_tree .

$ ->
  # the canvas size should be (480, 480)
  canvas = CE.defines("canvas").extend([Animation, Text, Input]).ready ->
    canvas.Scene.call("Title")

  canvas.Scene.New {
    name: "Title"

    materials: {
      images: {
        static: "http://dummyimage.com/100x30.png",
        leftUpper:  "http://dummyimage.com/100x30.png",
        rightUpper: "http://dummyimage.com/100x30.png"
      }
      fonts: {
        google: {
          families: ["Share"]
        }
      }
    }

    ready: (stage) ->
      # message "Press Enter"
      pressEnter = @createElement()
      pressEnter.font = '16pt "Share"'
      pressEnter.fillText("Press Enter", 195, 350)
      stage.append(pressEnter)

      # watch keyboard
      canvas.Input.keyDown Input.Enter, () ->
        canvas.Input.clearKeys Input.Enter
        canvas.Scene.call("Game")

    render: (stage) ->
      stage.refresh()
  }

  canvas.Scene.New {
    name: "Game"

    materials: {
      images: {
        inactive:   "http://dummyimage.com/100x30.png&text=inac",
        raiseLeft:  "http://dummyimage.com/100x30.png&text=left",
        raiseRight: "http://dummyimage.com/100x30.png&text=right"
      }
    }

    ready: (stage, params) ->
      @state = "inactive"
      @lock = @time = 0

      # draw character
      @me = @createElement()
      @me.drawImage @state, 190, 225
      stage.append(@me)

      canvas.Input.keyDown Input.Left, () =>
        if @lock == 0
          @state = "raiseLeft"
          @lock = 50
      canvas.Input.keyDown Input.Right, () =>
        if @lock == 0
          @state = "raiseRight"
          @lock = 50

    render: (stage) ->
      if @lock == 0
        @state = "inactive"
      else
        @lock -= 1

      if @time < 300
        @time += 1
      else
        console.log "hey"

      @me.drawImage @state, 190, 225
      stage.refresh()
  }
