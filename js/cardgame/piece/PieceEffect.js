/**
 * A card effect.
 */
export class PieceEffect{

    onPlay(card, effect, game){
        console.log('Card played');
    }

    onDiscard(card, effect, game){
    }

    onEndOfTurn(card, effect, game){
    }

    decorateName(card, effect, game, name){
    }

    decorateIcon(card, effect, game, icon){
    }

}