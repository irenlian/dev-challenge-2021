import CNC from '../cnc';

describe('CNC', () => {
    describe('combineBoxes', () => {
        it('returns a point', () => {
            const cnc = new CNC({ w: 1500, l: 1000 }, { w: 200, d: 200, h: 200 });
            const result = cnc.combineBoxes();
            expect(result).toHaveLength(1);
            expect(result[0].x).toEqual(0);
            expect(result[0].y).toEqual(0);
        });
    });

    describe('convertToCommands', () => {
        it('returns start and end commands', () => {
            const cnc = new CNC({ w: 1500, l: 1000 }, { w: 200, d: 200, h: 200 });
            const result = cnc.convertToCommands(cnc.combineBoxes());
            expect(result.filter(c => c.command === 'START')).toHaveLength(1);
            expect(result.filter(c => c.command === 'STOP')).toHaveLength(1);
            expect(result.filter(c => c.command === 'DOWN')).toHaveLength(1);
        });

        it('includes x and y only for GOTO', () => {
            const cnc = new CNC({ w: 1500, l: 1000 }, { w: 200, d: 200, h: 200 });
            const result = cnc.convertToCommands(cnc.combineBoxes());
            expect(result.find(c => c.command !== 'GOTO' && (c.x || c.y))).not.toBeDefined();
        });
    });

    describe.skip('bestLocatedBoxes', () => {
        it('check the smallest input', () => {
            const cnc = new CNC({ w: 600, l: 400 }, { w: 100, d: 100, h: 100 });
            const result = cnc.bestLocatedBoxes();
            expect(result).toEqual([
                [
                    { x: 100, y: 100 },
                    { x: 0, y: 100 },
                    { x: 0, y: 200 },
                    { x: 100, y: 200 },
                    { x: 100, y: 300 },
                    { x: 200, y: 300 },
                    { x: 200, y: 200 },
                    { x: 400, y: 200 },
                    { x: 400, y: 100 },
                    { x: 200, y: 100 },
                    { x: 200, y: 0 },
                    { x: 100, y: 0 },
                    { x: 100, y: 100 },
                ],
            ]);
        });

        it('check for two boxes', () => {
            const cnc = new CNC({ w: 500, l: 500 }, { w: 100, d: 100, h: 100 });
            const result = cnc.bestLocatedBoxes();
            expect(result).toEqual([
                [
                    { x: 100, y: 100 },
                    { x: 0, y: 100 },
                    { x: 0, y: 200 },
                    { x: 100, y: 200 },
                    { x: 100, y: 300 },
                    { x: 200, y: 300 },
                    { x: 200, y: 200 },
                    { x: 400, y: 200 },
                    { x: 400, y: 100 },
                    { x: 200, y: 100 },
                    { x: 200, y: 0 },
                    { x: 100, y: 0 },
                    { x: 100, y: 100 }
                ],
                [
                    { x: 200, y: 300 },
                    { x: 100, y: 300 },
                    { x: 100, y: 400 },
                    { x: 200, y: 400 },
                    { x: 200, y: 500 },
                    { x: 300, y: 500 },
                    { x: 300, y: 400 },
                    { x: 500, y: 400 },
                    { x: 500, y: 300 },
                    { x: 300, y: 300 },
                    { x: 300, y: 200 },
                    { x: 200, y: 200 },
                    { x: 200, y: 300 }
                ]
            ]);
        });
    });

    describe('minimum waste', () => {
        it('calculate average waste', () => {
            const res = Array.from(Array(100).keys(), key => {
                const sheet = { w: Math.random() * 1000, l: Math.random() * 1000 };
                const box = { w: Math.random() * 100, d: Math.random() * 100, h: Math.random() * 100 };
                const sheetSquare = sheet.w * sheet.l;
                const boxSquare = 2 * box.w * box.d + 2 * box.w * box.h + 2 * box.d * box.h;
                const cnc = new CNC(sheet, box);
                const boxes = cnc.combineBoxes().length;
                return 1 - (boxSquare * boxes) / sheetSquare;
            });

            const s = res.reduce((sum, i) => sum + i, 0);

            console.log(s / res.length);
        });
    });
});
