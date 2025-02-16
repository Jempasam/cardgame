/**
 * Stringify a number to a roman number.
 * @param {number} number 
 */
export function getRomanNumber(number){
    let final = "";
    if (number > 1000) final += "M".repeat(Math.floor(number / 1000)), number %= 1000;
    if (number > 900) final += "CM", number -= 900;
    if (number > 500) final += "D", number -= 500;
    if (number > 400) final += "CD", number -= 400;
    if (number > 100) final += "C".repeat(Math.floor(number / 100)), number %= 100;
    if (number > 90) final += "XC", number -= 90;
    if (number > 50) final += "L", number -= 50;
    if (number > 40) final += "XL", number -= 40;
    if (number > 10) final += "X".repeat(Math.floor(number / 10)), number %= 10;
    if (number > 9) final += "IX", number -= 9;
    if (number > 5) final += "V", number -= 5;
    if (number > 4) final += "IV", number -= 4;
    final += "I".repeat(number);
    return final;
}
