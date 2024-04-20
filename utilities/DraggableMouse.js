
class DraggableMouse {
    /**
     * One draggable mouse, for a page that may include many p5 instances
     * and other places to drag and drop things to
     * 
     * We want to 
     * - know which p element we are on top of
     * - pick up any draggables where we are
     * - track things we are holding
     * - hover over hovered things
     * - drop any currently held things 
     * - know the speed of mouse movement 
     * - remember past positions (global and relative to p5)
     * 
     * 
     * Interactions:
     *  only start dragging from a p5 instance
     *      to avoid UI collision (ie, no "dragging" from a slider nearby)
     *  but release whenever
     **/

    constructor() {
        this.windows = []
        this.windowPositions = []

        document.addEventListener('touchdown',  () => this.startTouch())
        document.addEventListener('mousedown',  () => this.startTouch())
        document.addEventListener('touchmove',  () => this.move())
        document.addEventListener('mousemove',  () => this.move())
        document.addEventListener('mouseup',    () => this.endTouch())
        document.addEventListener('touchup',    () => this.endTouch())
        

    }

    get overWindows() {
        return this.windows.filter(({p}) => {
            return p.mouseX >= 0 && p.mouseX < p.width
            && p.mouseY >= 0 && p.mouseY < p.height
        })
    }
 
    startTouch() {
        // Get touchables - in what P5 instance?

    }

    endTouch() {
        
    }

    get touchablesInRange() {

        let minDist = 10
        let closest = undefined
        let inRange = []
        this.overWindows.forEach((window,index) => {
            let pos = this.windowPositions[index]
            pos.setTo(window.p.mouseX, window.p.mouseY)
            
            let touchables = window.getTouchables?.()
            
           

            touchables?.forEach(touchable => {
                let d = 0
                if (touchable.getDistanceTo) 
                    d = touchable.getDistanceTo()
                else {
                    d = pos.getDistanceTo(touchable)
                }

                if (d < minDist) {
                    
                  inRange.push({
                    touchable,
                    window,
                    d
                  })
                }  
            })
            
        })
        return inRange
    }

    move() {
        // console.log("move", this.overWindows)

        // console.log(this.touchablesInRange)

    }
    addWindow(window) {
        this.windows.push(window)
        this.windowPositions.push(new Vector2D())

    }

    updatePos() {
      
    }

    get inCanvas() {
       
    }

    getClosest(objs, range = 100) {
     
    }


}
