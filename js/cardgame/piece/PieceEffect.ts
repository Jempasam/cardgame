import { Card } from "../card/Card.js";
import { CardEffect } from "../card/CardEffect.js";
import { Game } from "../Game.js";
import { Picture } from "../icon/Picture.js";

/**
 * A card effect.
 */
export interface PieceEffect{

    onPlay(card: Card, effect: CardEffect, game: Game)

    onDiscard(card: Card, effect: CardEffect, game: Game)

    onEndOfTurn(card: Card, effect: CardEffect, game: Game)

    decorateName(card: Card, effect: CardEffect, game: Game, name: string): string

    decorateIcon(card: Card, effect: CardEffect, game: Game, picture: Picture): Picture

}