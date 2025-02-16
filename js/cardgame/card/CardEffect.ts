import { Game } from "../Game.js";
import { Picture } from "../icon/Picture.js";
import { Player } from "../Player.js";
import { Text } from "../text/Text.js";
import { Card } from "./Card.js";

export interface CardEffectContext{
    game: Game,
    player: Player,
    card: Card,
    effect: CardEffect
}

/**
 * A card effect.
 */
export class CardEffect{

    /**
     * Called when a card with this effect is played.
     * @returns True if the card was played, false if it was cancelled.
     */
    onPlay(context: CardEffectContext): boolean{
        return false
    }

    /**
     * Called when a card with this effect is drawn.
     * @returns True if the card was played, false if it was cancelled.
     */
    onDraw(context: CardEffectContext): boolean{
        return false
    }

    /**
     * Called when a card with this effect is discarded from the hand.
     * @returns True if the card was played, false if it was cancelled.
     */
    onDiscard(context: CardEffectContext): boolean{
        return false
    }

    /**
     * Called when the game starts if this card is in the deck, discardpile or hand of any player.
     * @returns True if the card was played, false if it was cancelled.
     */
    onGameStart(context: CardEffectContext): boolean{
        return false
    }

    /**
     * Called on the card name to decorate it.
     */
    decorateName(name: string): string{
        return name
    }

    /**
     * Called on the card .
     */
    decoratePicture(picture: Picture): Picture{
        return picture
    }

    /**
     * Get the description of the effect.
     */
    getDescription(): Text{
        return null;
    }

    /**
     * Get the color of the effect.
     */
    getColor(): [number,number,number]{
        return [0,0,0]
    }

}