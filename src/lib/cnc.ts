import { CommandType } from './types';

import Sheet = Models.Sheet;
import BoxSize = Models.BoxSize;
import Location = Models.Location;
import Command = Models.Command;
import { FORMS } from './form';
import { isBoxOverlapped } from './box';

export default class CNC {
    sheet: Sheet;
    box: BoxSize;
    points: Location[];
    boxLength: number;
    boxHeight: number;

    constructor(paper: Sheet, box: BoxSize) {
        this.sheet = paper;
        this.box = box;
        this.points = [];
        // Calculate the dimensions of the rectangle that could fit the box
        this.boxLength = 2 * this.box.h + 2 * this.box.w;
        this.boxHeight = 2 * this.box.h + this.box.d;
    }

    canBeUsed = (): boolean => {
        // Calculate the dimensions of the rectangle that could fit the box
        const x = this.boxLength;
        const y = this.boxHeight;
        // Min sheet side should fit min box side and the same for the max
        // TODO: Uncomment as soon as the algorithm is improved
        // return Math.min(sheet.l, sheet.w) >= Math.min(x, y) && Math.max(sheet.l, sheet.w) >= Math.max(x, y);
        return this.sheet.l >= y && this.sheet.w >= x;
    };

    combineBoxes = (): Location[] => {
        const x = this.boxLength;
        const y = this.boxHeight;
        const columns = Array.from(Array(Math.floor(this.sheet.w / x)).keys(), key => key * x);
        const rows = Array.from(Array(Math.floor(this.sheet.l / y)).keys(), key => key * y);
        columns.forEach(col =>
            rows.forEach(row => {
                this.points.push({ x: col, y: row });
            }),
        );
        return this.points;
    };

    // Backtracking algorithm to determine the better combination of boxes
    bestLocatedBoxes = (locatedBoxes = [] as Location[][]): Location[][] => {
        let bestLocation: Location[][] = [];
        // const form = FORMS[0];
        const smallestStep = Math.min(this.box.d, this.box.h, this.box.w);
        for (const form of FORMS) {
            for (let i = 0; i <= this.sheet.w - this.boxLength; i += smallestStep) {
                for (let j = 0; j <= this.sheet.l - this.boxHeight; j += smallestStep) {
                    // check the new location for box
                    const point = { x: i, y: j };
                    const box = form(this.box, point);
                    // check if it not overlaps with previous boxes
                    if (!isBoxOverlapped(locatedBoxes, box)) {
                        // calculate how many boxes can we put later
                        const result = this.bestLocatedBoxes([...locatedBoxes, box]);
                        // if more boxes fits, so select this solution
                        if (result.length + 1 > bestLocation.length) bestLocation = [box, ...result];
                    }
                }
            }
        }
        return bestLocation;
    }

    convertToCommands = (points: Location[]): Command[] => {
        const commands: Command[] = [{ command: CommandType.START }];

        points.forEach(boxLocation => {
            commands.push(...this.convertOnePointToCommand(boxLocation));
        });

        commands.push({
            command: CommandType.STOP,
        });

        return commands;
    };

    private convertOnePointToCommand = ({ x, y }: Location): Command[] => {
        const COMMAND = { command: CommandType.GOTO };
        const currentPoint: Location = { x, y: y + this.box.h };
        const commands: Command[] = [
            { ...COMMAND, ...currentPoint },
            { command: CommandType.DOWN },
        ];

        const form = [
            { x: this.box.h, y: 0 },
            { x: 0, y: -this.box.h },
            { x: this.box.w, y: 0 },
            { x: 0, y: this.box.h },
            { x: this.box.h + this.box.w, y: 0 },
            { x: 0, y: this.box.d },
            { x: -(this.box.h + this.box.w), y: 0 },
            { x: 0, y: this.box.h },
            { x: -this.box.w, y: 0 },
            { x: 0, y: -this.box.h },
            { x: -this.box.h, y: 0 },
            { x: 0, y: -this.box.d },
        ];

        form.forEach(change => {
            currentPoint.x += change.x;
            currentPoint.y += change.y;
            commands.push({ ...COMMAND, ...currentPoint });
        });

        commands.push({
            command: CommandType.UP,
        });

        return commands;
    };
}
