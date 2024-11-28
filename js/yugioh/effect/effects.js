import { DamageCardEffect } from "./Damage.js";
import { HealCardEffect } from "./Heal.js";

export const SMALL_DAMAGE=new DamageCardEffect(5)
export const MEDIUM_DAMAGE=new DamageCardEffect(10)
export const BIG_DAMAGE=new DamageCardEffect(15)

export const SMALL_HEAL=new HealCardEffect(3)
export const MEDIUM_HEAL=new HealCardEffect(5)
export const BIG_HEAL=new HealCardEffect(8)