import * as crypto from "crypto";

export class Utils {

    public static leftPad(value: string,
                          length: number = 64): string {
        return value.padStart(length, '0');
    }

    public static toRawAmount({
                                  amount,
                                  decimals
                              }: { amount: number, decimals: number }): string {
        return Number(amount * Math.pow(10, decimals)).toString();
    }

    public static randomNonce(): string {
        return '0x' + crypto.randomBytes(32).toString('hex');
    }
}
