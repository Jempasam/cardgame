
/**
 * An animation that can be played in any speed and order.
 */
export class Animation{

    /**
     * Initialize the animation.
     */
    init(){ }

    /**
     * Show the given animation frame.
     * Should be called will always be called with 0 and 1.
     * The animation can be player in any order and speed.
     * @param {number} advancment - The animation frame to show between 0 and 1. 
     */
    animate(advancment){ }

    /**
     * Dispose the animation.
     */
    dispose(){ }
}

/**
 * An animation slot, only one animation can be player per slot.
 * If a new animation is then played the old one is stopped.
 */
export class AnimationSlot{
    
    /** @type {Animation|null} */
    #current_animation = null
    
    /** @type {number|null} */
    #current_callback = null

    /** @type {(value:any)=>void} */
    #resolve = null

    /** @type {number} */
    #end_frame = 1  
    
    /**
     * Play a animation from start to end in the given duration.
     * @param {Animation} animation - The uninitialized animation to play.
     * @param {number} duration - Duration of the animation in milliseconds.
     * @param {(x:number)=>number=} progression_function - The progression function to use.
     * @returns {Promise<void>} - A promise that resolves when the animation is done.
     */
    play(animation, duration, progression_function=AnimationSlot.LINEAR){
        this.stop()
        const promise = new Promise((resolve)=>this.#resolve=resolve)
        requestAnimationFrame((timestamp)=>{
            this.#current_animation = animation
            this.#end_frame = progression_function(1)
            animation.init()
            animation.animate(progression_function(0))
            const manager = this
            let start_time = timestamp
            this.#current_callback = requestAnimationFrame(function fn(timestamp){
                let advancement = (timestamp-start_time)/duration
                if(advancement>1){
                    animation.animate(progression_function(1))
                    animation.dispose()
                    manager.#current_animation = null
                    manager.#current_callback = null
                    manager.#resolve()
                }
                else{
                    animation.animate(progression_function(advancement))
                    manager.#current_callback = requestAnimationFrame(fn)
                }
            })
        })
        return promise
    }

    stop(){
        if(this.#current_animation){
            this.#current_animation.animate(this.#end_frame)
            this.#current_animation.dispose()
            cancelAnimationFrame(this.#current_callback)
            this.#current_animation = null
            this.#current_callback = null
            this.#resolve()
        }
    }

    static LINEAR = x => x
    static EASE_IN = x => x*x
    static EASE_OUT = x => 1-(1-x)*(1-x)
}