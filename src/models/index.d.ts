declare namespace Models {
    export type Nullable<T> = null | T;

    export interface Paper {
        w: number;
        l: number;
    }

    export interface BoxSize {
        w: number;
        d: number;
        h: number;
    }

    export interface Location {
        x: number;
        y: number;
    }

    export type CommandType = 'START' | 'DOWN' | 'UP' | 'GOTO' | 'STOP';

    export interface Command {
        command: CommandType;
        x?: number;
        y?: number;
    }
}
