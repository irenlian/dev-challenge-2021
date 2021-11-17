import get from 'lodash/get';
import { CommandType } from './types';

import Sheet = Models.Sheet;
import BoxSize = Models.BoxSize;
import Location = Models.Location;
import Command = Models.Command;
import {
    Form,
    FORMS,
    getHorizontalLeftForm,
    getHorizontalRightForm,
    getVerticalBottomForm,
    getVerticalTopForm,
} from './form';
import { isBoxOverlapped, push } from '../utils';

type Memo = Record<number, Record<number, Record<number, Location[][]>>>;

type Option = {
    locatedBoxes: Location[][];
    form: Form;
};

export default class CNC {
    sheet: Sheet;
    box: BoxSize;
    points: Location[];
    boxLength: number;
    boxHeight: number;
    memo: Memo;

    constructor(paper: Sheet, box: BoxSize) {
        this.sheet = paper;
        this.box = box;
        this.points = [];
        // Calculate the dimensions of the rectangle that could fit the box
        this.boxLength = 2 * this.box.h + 2 * this.box.w;
        this.boxHeight = 2 * this.box.h + this.box.d;
        this.memo = {};
    }

    canBeUsed = (): boolean => {
        // Calculate the dimensions of the rectangle that could fit the box
        const x = this.boxLength;
        const y = this.boxHeight;
        // Min sheet side should fit min box side and the same for the max
        return Math.min(this.sheet.l, this.sheet.w) >= Math.min(x, y) && Math.max(this.sheet.l, this.sheet.w) >= Math.max(x, y);
    };

    // Simple algorithm that uses a single form which stands one by one
    cutV1 = (): Location[] => {
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

    // Backtracking recursive algorithm with memoization to determine the better combination of boxes
    cutV2 = (locatedBoxes = [] as Location[][], startX = 0, startY = 0): Location[][] => {
        let bestLocation: Location[][] = [];
        const start = Date.now();
        const smallestStep = Math.min(this.box.d, this.box.h, this.box.w);
        for (let k = 0; k < FORMS.length; k++) {
            const form = FORMS[k];
            for (let i = startX; i <= this.sheet.w - this.boxLength; i += smallestStep) {
                for (let j = startY; j <= this.sheet.l - this.boxHeight; j += smallestStep) {
                    // check the new location for box
                    const point = { x: i, y: j };
                    const box = form(this.box, point);
                    // check if it not overlaps with previous boxes
                    if (!isBoxOverlapped(locatedBoxes, box)) {
                        // calculate how many boxes can we put later
                        const result = get(this.memo, [i, j, k], this.cutV2([...locatedBoxes, box], i, j));
                        push(this.memo, [i, j, k], result);
                        // if more boxes fits, so select this solution
                        if (result.length + 1 > bestLocation.length) bestLocation = [box, ...result];
                    }
                    // Stop long iteration
                    const end = Date.now();
                    if ((end - start) / 1000 > 8) {
                        return bestLocation;
                    }
                }
            }
        }
        return bestLocation;
    };

    // Backtracking iterative algorithm with just a single try to locate a specific form
    cutV3 = (): Location[][] => {
        const start = Date.now();
        const smallestStep = 1;
        let bestLocation: Location[][] = [];
        const queue: Option[] = FORMS.map(f => ({ form: f, locatedBoxes: [] as Location[][] }));
        while (queue.length && (Date.now() - start) / 1000 < 9) {
            const option = queue.shift();
            if (!option) break;
            const { form, locatedBoxes } = option;
            let located = false;
            for (let i = 0; i <= this.sheet.w - this.boxLength; i += smallestStep) {
                for (let j = 0; j <= this.sheet.l - this.boxHeight; j += smallestStep) {
                    const point = { x: i, y: j };
                    const box = form(this.box, point);
                    const newCombination = [...locatedBoxes, box];
                    if (!isBoxOverlapped(locatedBoxes, box)) {
                        queue.push(...FORMS.map(f => ({ form: f, locatedBoxes: newCombination })));
                        located = true;
                        break;
                    }
                }
                if (located) break;
            }
            if (locatedBoxes.length > bestLocation.length) bestLocation = locatedBoxes;
        }
        return bestLocation;
    };

    private stackingHorizontally = (): Location[][] => {
        const x = this.boxLength;
        const y = this.box.h + this.box.d;
        const columns = Array.from(Array(Math.floor(this.sheet.w / x)).keys(), key => key * x);
        const rows = Array.from(Array(Math.max(Math.floor((this.sheet.l - this.box.h) / y), 0)).keys(), key => key * y);
        const locatedBoxes: Location[][] = [];
        columns.forEach(col =>
            rows.forEach((row, i) => {
                const point = { x: col, y: row };
                locatedBoxes.push(
                    i % 2 === 0 ? getHorizontalLeftForm(this.box, point) : getHorizontalRightForm(this.box, point),
                );
            }),
        );
        return locatedBoxes;
    };

    private stackingVertically = (): Location[][] => {
        const x = this.box.h + this.box.d;
        const y = 2 * this.box.h + 2 * this.box.w;
        const columns = Array.from(
            Array(Math.max(Math.floor((this.sheet.w - this.box.h) / x), 0)).keys(),
            key => key * x,
        );
        const rows = Array.from(Array(Math.floor(this.sheet.l / y)).keys(), key => key * y);
        const locatedBoxes: Location[][] = [];
        rows.forEach(row =>
            columns.forEach((col, i) => {
                const point = { x: col, y: row };
                locatedBoxes.push(
                    i % 2 === 0 ? getVerticalTopForm(this.box, point) : getVerticalBottomForm(this.box, point),
                );
            }),
        );
        return locatedBoxes;
    };

    // Simple algorithm that uses a single form which stands closer
    cutV4 = (): Location[][] => {
        const r1 = this.stackingHorizontally();
        const r2 = this.stackingVertically();
        return r1.length >= r2.length ? r1 : r2;
    };

    convertToCommands = (points: Location[][]): Command[] => {
        const commands: Command[] = [{ command: CommandType.START }];

        points.forEach(boxLocation => {
            commands.push(...this.convertOnePointToCommand(boxLocation));
        });

        commands.push({
            command: CommandType.STOP,
        });

        return commands;
    };

    private convertOnePointToCommand = (dots: Location[]): Command[] => {
        const COMMAND = { command: CommandType.GOTO };
        const commands: Command[] = [{ ...COMMAND, ...dots[0] }, { command: CommandType.DOWN }];

        dots.forEach((d, i) => {
            if (i === 0) return;
            commands.push({ ...COMMAND, ...d });
        });

        commands.push({
            command: CommandType.UP,
        });

        return commands;
    };
}
