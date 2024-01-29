export class Utils {

    public static leftPad(value: string,
                          length: number = 64): string {
        return value.padStart(length, '0');
    }
}
