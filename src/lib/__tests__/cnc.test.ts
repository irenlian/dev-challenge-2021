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
