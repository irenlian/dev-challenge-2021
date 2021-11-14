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
});
