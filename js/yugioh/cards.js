import { CardType } from "../cardgame/card/CardType.js";
import * as pictures from "./pictures.js";
import * as effects from "./effect/effects.js"
import { Picture } from "../cardgame/icon/Picture.js";

export const SWORD = new CardType("Sword", pictures.sword, ["a cool sword"], [effects.MEDIUM_DAMAGE])
export const BIG_SWORD = new CardType("Big Sword", pictures.sword, ["a cool big sword"], [effects.BIG_DAMAGE])

export const HEAL_BLOOD = new CardType("Heal Blood", pictures.blood, ["heal a bit"], [effects.SMALL_HEAL])

export const BIG_DRAGON = new CardType("Big Dragon", pictures.dragon, ["a big dragon"], [effects.BIG_DAMAGE, effects.SMALL_HEAL])