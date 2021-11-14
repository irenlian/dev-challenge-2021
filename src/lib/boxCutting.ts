import Paper = Models.Paper;
import BoxSize = Models.BoxSize;
import Location = Models.Location;
import Command = Models.Command;

export default class CNC {
    paper: Paper;
    box: BoxSize;
    points: Location[];

    constructor(paper: Paper, box: BoxSize) {
        this.paper = paper;
        this.box = box;
        this.points = [];
    }

    canBeUsed = (): boolean => {
        // Calculate the dimensions of the rectangle that could fit the box
        const x = 2 * this.box.h + 2 * this.box.w;
        const y = 2 * this.box.h + this.box.d;
        // Min paper side should fit min box side and the same for the max
        // TODO: Uncomment as soon as the algorithm is improved
        // return Math.min(paper.l, paper.w) >= Math.min(x, y) && Math.max(paper.l, paper.w) >= Math.max(x, y);
        return this.paper.l >= y && this.paper.w >= x;
    }

    combineBoxes = (): Location[] => {
        this.points = [{ x: 0, y: 0 }];
        return this.points;
    };

    static convertToCommands = (points: Location[]): Command[] => {
        return [
            {
                command: 'START',
            },
            {
                command: 'STOP',
            },
        ];
    }
}
