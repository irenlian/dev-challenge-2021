export enum CommandType {
    START = 'START',
    DOWN = 'DOWN',
    UP = 'UP',
    GOTO = 'GOTO',
    STOP = 'STOP',
}

export type Form = (b: Models.BoxSize, startPoint: Models.Location) => Models.Location[];

export type Memo = Record<number, Record<number, Record<number, Models.Location[][]>>>;

export type Option = {
    locatedBoxes: Models.Location[][];
    form: Form;
};
