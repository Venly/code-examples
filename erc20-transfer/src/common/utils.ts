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

    public static getRunArgument(name: string) {
        const args = process.argv;
        const filtered = args.map(a => a.split('='))
                             .filter(arg => arg[0] === name)
                             .map(arg => arg[1]);
        return filtered.length === 0 ? null : filtered[0];
    }

    public static numberToHex(nr: number,
                              options?: { padding: { padWith: string, length: number } }) {
        let output = nr.toString(16);
        if (options) {
            output = output.padStart(options.padding.length, options.padding.padWith)
        }
        return `0x${output}`;
    }

}
