import CNC from '../cnc';

describe('CNC', () => {
    describe('combineBoxes', () => {
        it('returns a point', () => {
            const cnc = new CNC({ w: 1500, l: 1000 }, { w: 200, d: 200, h: 200 });
            const result = cnc.cutV1();
            expect(result).toHaveLength(1);
            expect(result[0].x).toEqual(0);
            expect(result[0].y).toEqual(0);
        });
    });

    describe('convertToCommands', () => {
        it('returns start and end commands', () => {
            const cnc = new CNC({ w: 800, l: 600 }, { w: 200, d: 200, h: 200 });
            const result = cnc.convertToCommands(cnc.cutV4());
            expect(result.filter(c => c.command === 'START')).toHaveLength(1);
            expect(result.filter(c => c.command === 'STOP')).toHaveLength(1);
        });

        it('includes x and y only for GOTO', () => {
            const cnc = new CNC({ w: 1500, l: 1000 }, { w: 200, d: 200, h: 200 });
            const result = cnc.convertToCommands(cnc.cutV4());
            expect(result.find(c => c.command !== 'GOTO' && (c.x || c.y))).not.toBeDefined();
        });

        it('number of GOTO commands reflect the number of points', () => {
            const cnc = new CNC({ w: 1500, l: 1000 }, { w: 200, d: 200, h: 200 });
            const boxes = cnc.cutV4();
            const result = cnc.convertToCommands(boxes);
            expect(result.filter(c => c.command === 'GOTO')).toHaveLength(13 * boxes.length);
        });

        it('check the exact commands', () => {
            const cnc = new CNC({ w: 800, l: 600 }, { w: 200, d: 200, h: 200 });
            const result = cnc.convertToCommands(cnc.cutV4());
            expect(result).toEqual([
                { command: 'START' },
                { command: 'GOTO', x: 200, y: 200 },
                { command: 'DOWN' },
                { command: 'GOTO', x: 0, y: 200 },
                { command: 'UP' },
                { command: 'GOTO', x: 0, y: 400 },
                { command: 'DOWN' },
                { command: 'GOTO', x: 200, y: 400 },
                { command: 'GOTO', x: 200, y: 600 },
                { command: 'UP' },
                { command: 'GOTO', x: 400, y: 600 },
                { command: 'DOWN' },
                { command: 'GOTO', x: 400, y: 400 },
                { command: 'GOTO', x: 800, y: 400 },
                { command: 'UP' },
                { command: 'GOTO', x: 800, y: 200 },
                { command: 'DOWN' },
                { command: 'GOTO', x: 400, y: 200 },
                { command: 'GOTO', x: 400, y: 0 },
                { command: 'UP' },
                { command: 'GOTO', x: 200, y: 0 },
                { command: 'DOWN' },
                { command: 'GOTO', x: 200, y: 200 },
                { command: 'UP' },
                { command: 'STOP' },
            ]);
        });
    });

    describe.skip('Iterative V3', () => {
        it('check the smallest input', () => {
            const cnc = new CNC({ w: 600, l: 400 }, { w: 100, d: 100, h: 100 });
            const result = cnc.cutV3();
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
                [
                    { x: 500, y: 200 },
                    { x: 600, y: 200 },
                    { x: 600, y: 300 },
                    { x: 500, y: 300 },
                    { x: 500, y: 400 },
                    { x: 400, y: 400 },
                    { x: 400, y: 300 },
                    { x: 200, y: 300 },
                    { x: 200, y: 200 },
                    { x: 400, y: 200 },
                    { x: 400, y: 100 },
                    { x: 500, y: 100 },
                    { x: 500, y: 200 },
                ],
            ]);
        });

        it('check for two boxes', () => {
            const cnc = new CNC({ w: 500, l: 500 }, { w: 100, d: 100, h: 100 });
            const result = cnc.cutV3();
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
                    { x: 200, y: 300 },
                ],
            ]);
        });

        it('check', () => {
            const cnc = new CNC({ w: 36, l: 22 }, { w: 7, d: 2, h: 7 });
            const result = cnc.cutV3(); // 1 box, waste 0.8
            expect(result).toHaveLength(1);
        });

        it('check', () => {
            const cnc = new CNC({ w: 50, l: 47 }, { w: 7, d: 5, h: 8 });
            const result = cnc.cutV3(); // 4 box, 0.74
            expect(result).toHaveLength(4);
        });
    });

    describe('Stacking V4', () => {
        it('check the smallest input', () => {
            const cnc = new CNC({ w: 300, l: 400 }, { w: 100, d: 100, h: 100 });
            const result = cnc.cutV4();
            expect(result).toEqual([
                [
                    { x: 100, y: 300 },
                    { x: 100, y: 400 },
                    { x: 200, y: 400 },
                    { x: 200, y: 300 },
                    { x: 300, y: 300 },
                    { x: 300, y: 200 },
                    { x: 200, y: 200 },
                    { x: 200, y: 0 },
                    { x: 100, y: 0 },
                    { x: 100, y: 200 },
                    { x: 0, y: 200 },
                    { x: 0, y: 300 },
                    { x: 100, y: 300 },
                ],
            ]);
        });

        it('check for two boxes', () => {
            const cnc = new CNC({ w: 500, l: 500 }, { w: 100, d: 100, h: 100 });
            const result = cnc.cutV4();
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
                [
                    { x: 300, y: 300 },
                    { x: 400, y: 300 },
                    { x: 400, y: 400 },
                    { x: 300, y: 400 },
                    { x: 300, y: 500 },
                    { x: 200, y: 500 },
                    { x: 200, y: 400 },
                    { x: 0, y: 400 },
                    { x: 0, y: 300 },
                    { x: 200, y: 300 },
                    { x: 200, y: 200 },
                    { x: 300, y: 200 },
                    { x: 300, y: 300 },
                ],
            ]);
        });

        it('check for three boxes', () => {
            const cnc = new CNC({ w: 21, l: 11 }, { w: 2, d: 4, h: 2 });
            const result = cnc.cutV4();
            expect(result).toHaveLength(3);
            expect(result).toEqual([
                [
                    { x: 2, y: 6 },
                    { x: 2, y: 8 },
                    { x: 6, y: 8 },
                    { x: 6, y: 6 },
                    { x: 8, y: 6 },
                    { x: 8, y: 4 },
                    { x: 6, y: 4 },
                    { x: 6, y: 0 },
                    { x: 2, y: 0 },
                    { x: 2, y: 4 },
                    { x: 0, y: 4 },
                    { x: 0, y: 6 },
                    { x: 2, y: 6 },
                ],
                [
                    { x: 12, y: 2 },
                    { x: 12, y: 0 },
                    { x: 8, y: 0 },
                    { x: 8, y: 2 },
                    { x: 6, y: 2 },
                    { x: 6, y: 4 },
                    { x: 8, y: 4 },
                    { x: 8, y: 8 },
                    { x: 12, y: 8 },
                    { x: 12, y: 4 },
                    { x: 14, y: 4 },
                    { x: 14, y: 2 },
                    { x: 12, y: 2 },
                ],
                [
                    { x: 14, y: 6 },
                    { x: 14, y: 8 },
                    { x: 18, y: 8 },
                    { x: 18, y: 6 },
                    { x: 20, y: 6 },
                    { x: 20, y: 4 },
                    { x: 18, y: 4 },
                    { x: 18, y: 0 },
                    { x: 14, y: 0 },
                    { x: 14, y: 4 },
                    { x: 12, y: 4 },
                    { x: 12, y: 6 },
                    { x: 14, y: 6 },
                ],
            ]);
        });
    });

    describe.skip('Effectiveness comparison', () => {
        const TESTS_NUMBER = 10;
        it('calculate average waste', () => {
            let combineBoxesSimpleWaste = [] as number[];
            let simpleWins = 0;
            let recursiveWins = 0;
            let iterativeWins = 0;
            let stackingWins = 0;
            const res = Array.from(Array(TESTS_NUMBER).keys(), key => {
                const sheet = { w: Math.round(Math.random() * 100 + 2), l: Math.round(Math.random() * 100 + 2) };
                const box = {
                    w: Math.round(Math.random() * 10 + 1),
                    d: Math.round(Math.random() * 10 + 1),
                    h: Math.round(Math.random() * 10 + 1),
                };
                console.log(sheet, box);
                const sheetSquare = sheet.w * sheet.l;
                const boxSquare = 2 * box.w * box.d + 2 * box.w * box.h + 2 * box.d * box.h;
                const cnc = new CNC(sheet, box);
                const boxes = [cnc.cutV1().length, cnc.cutV3().length, cnc.cutV2().length, cnc.cutV4().length];
                const w1 = 1 - (boxSquare * boxes[1]) / sheetSquare;
                const w2 = 1 - (boxSquare * boxes[0]) / sheetSquare;
                console.log('waste:', w1, w2, 'boxes:', boxes, 'sheetSquare:', sheetSquare);
                const max = Math.max(...boxes);
                if (boxes[0] === max) simpleWins++;
                if (boxes[1] === max) iterativeWins++;
                if (boxes[2] === max) recursiveWins++;
                if (boxes[3] === max) stackingWins++;
                if (boxes[0]) combineBoxesSimpleWaste.push(w2);
                if (!boxes) return 0;
                return w1;
            });

            const s1 = res.reduce((sum, i) => sum + i, 0);
            const s2 = combineBoxesSimpleWaste.reduce((sum, i) => sum + i, 0);

            console.log(s1 / res.length, s2 / combineBoxesSimpleWaste.length);
            console.log(
                'simpleWins',
                simpleWins,
                'iterativeWins',
                iterativeWins,
                'recursiveWins',
                recursiveWins,
                'stackingWins',
                stackingWins,
            );
        });

        it('calculate average time', () => {
            let simpleTime = 0;
            let iterativeTime = 0;
            let stackingTime = 0;
            const res = Array.from(Array(TESTS_NUMBER).keys(), key => {
                const sheet = { w: Math.round(Math.random() * 100 + 2), l: Math.round(Math.random() * 100 + 2) };
                const box = {
                    w: Math.round(Math.random() * 10 + 1),
                    d: Math.round(Math.random() * 10 + 1),
                    h: Math.round(Math.random() * 10 + 1),
                };
                console.log(sheet, box);
                let start = Date.now();
                const cnc = new CNC(sheet, box);
                cnc.cutV1();
                simpleTime += Date.now() - start;
                start = Date.now();
                cnc.cutV3();
                iterativeTime += Date.now() - start;
                start = Date.now();
                cnc.cutV4();
                stackingTime += Date.now() - start;
                return 0;
            });

            console.log('simple', simpleTime, 'iterative', iterativeTime, 'stackingTime', stackingTime);
        });
    });
});
