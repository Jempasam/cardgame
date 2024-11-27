import { Card } from "../card/Card.js";
import { Game } from "../Game.js";
import { Player } from "../Player.js";
import { Status } from "../status/Status.js";


/**
 * A controller whome role is to control a player.
 */
export class Controller{

    /**
     * Ask the controller an action from a list of action.
     * @param {Game} game The game
     * @param {Player} player The player controlled by the controller
     * @param {Iterable<keyof Controller|"stop">} actions The list of actions to choose from
     * @returns {Promise<keyof Controller|"stop">} The action
     */
    async askForAction(game, player, actions){
        throw Error("Not implemented")
    }

    /**
     * Ask the controller a card from a list of card
     * @param {Game} game The game
     * @param {Player} player The player controlled by the controller
     * @param {Iterable<Card>} from The list of cards to choose from 
     * @param {string} reason The reason of the request
     * @param {number} retry_count The number of time the request has been retried because the previous answer was invalid
     * @param {string} retry_reason The reason of why the previous answer was invalid
     * @returns {Promise<number>} The index of the card in the hand
     */
    async askForCard(game, player, from, reason, retry_count, retry_reason){
        throw Error("Not implemented")
    }

    /**
     * Ask the controller to order a list of cards
     * @param {Game} game The game
     * @param {Player} player The player controlled by the controller
     * @param {Iterable<Card>} from The list of cards to choose from
     * @param {string} reason The reason of the request
     * @param {number} retry_count The number of time the request has been retried because the previous answer was invalid
     * @param {string} retry_reason The reason of why the previous answer was invalid
     * @returns {Promise<Card[]>} The list of cards in the order
     */
    async askForCardOrder(game, player, from, reason, retry_count, retry_reason){
        throw Error("Not implemented")
    }

    
    /**
     * Ask the controller a status from a list of status
     * @param {Game} game The game
     * @param {Player} player The player controlled by the controller
     * @param {Iterable<Status>} from The list of status to choose from
     * @param {string} reason The reason of the request
     * @param {number} retry_count The number of time the request has been retried because the previous answer was invalid
     * @param {string} retry_reason The reason of why the previous answer was invalid
     * @returns {Promise<number>} The index of the status in the status list
     */
    askForStatus(game, player, from, reason, retry_count, retry_reason){
        throw Error("Not implemented")
    }

    /**
     * Ask the controller a number
     * @param {Game} game The game
     * @param {Player} player The player controlled by the controller
     * @param {[number,number]} range The range of the number to choose from
     * @param {string} reason The reason of the request
     * @param {number} retry_count The number of time the request has been retried because the previous answer was invalid
     * @param {string} retry_reason The reason of why the previous answer was invalid
     * @returns {Promise<number>} The number
     */
    async askForNumber(game, player, range, reason, retry_count, retry_reason){
        throw Error("Not implemented")
    }

    /**
     * Ask the controller a boolean
     * @param {Game} game The game
     * @param {Player} player The player controlled by the controller
     * @param {string} reason The reason of the request
     * @param {number} retry_count The number of time the request has been retried because the previous answer was invalid
     * @param {string} retry_reason The reason of why the previous answer was invalid
     * @returns {Promise<boolean>} The answer
     */
    async askForBoolean(game, player, reason, retry_count, retry_reason){
        throw Error("Not implemented")
    }

    /**
     * Ask the controller a string
     * @param {Game} game The game
     * @param {Player} player The player controlled by the controller
     * @param {string} reason The reason of the request
     * @param {number} retry_count The number of time the request has been retried because the previous answer was invalid
     * @param {string} retry_reason The reason of why the previous answer was invalid
     * @returns {Promise<string>} The answer
     */
    async askForString(game, player, reason, retry_count, retry_reason){
        throw Error("Not implemented")
    }


}