import BoxSize = Models.BoxSize;
import Location = Models.Location;

// startPoint left bottom point of the rectangular of box
const getHorizontalLeftForm = ({ h, d, w }: BoxSize, startPoint: Location): Location[] =>
    [
        { x: h, y: h },
        { x: 0, y: h },
        { x: 0, y: h + d },
        { x: h, y: h + d },
        { x: h, y: 2 * h + d },
        { x: h + w, y: 2 * h + d },
        { x: h + w, y: h + d },
        { x: 2 * h + 2 * w, y: h + d },
        { x: 2 * h + 2 * w, y: h },
        { x: h + w, y: h },
        { x: h + w, y: 0 },
        { x: h, y: 0 },
        { x: h, y: h },
    ].map(p => ({ x: p.x + startPoint.x, y: p.y + startPoint.y }));

const getHorizontalRightForm = ({ h, d, w }: BoxSize, startPoint: Location): Location[] =>
    [
        { x: 2 * w + h, y: h },
        { x: 2 * w + 2 * h, y: h },
        { x: 2 * w + 2 * h, y: h + d },
        { x: 2 * w + h, y: h + d },
        { x: 2 * w + h, y: 2 * h + d },
        { x: w + h, y: 2 * h + d },
        { x: w + h, y: h + d },
        { x: 0, y: h + d },
        { x: 0, y: h },
        { x: w + h, y: h },
        { x: w + h, y: 0 },
        { x: 2 * w + h, y: 0 },
        { x: 2 * w + h, y: h },
    ].map(p => ({ x: p.x + startPoint.x, y: p.y + startPoint.y }));

// top-left, top-right, bottom-right, bottom-left
type Rectangular = {
    topLeft: Location;
    topRight: Location;
    bottomRight: Location;
    bottomLeft: Location;
};

export const getRectangularsFromBox = (box: Location[]): [Rectangular, Rectangular] => {
    return [
        { topLeft: box[4], topRight: box[5], bottomRight: box[10], bottomLeft: box[11] }, // shorter
        { topLeft: box[2], topRight: box[7], bottomRight: box[8], bottomLeft: box[1] }, // longer
    ];
};

const isBetween = (p: number, [l1, l2]: [number, number]): boolean => {
    return p > l1 && p < l2;
};

export const isIntersected = (r1: Rectangular, r2: Rectangular): boolean => {
    const isOnLeft = r1.topLeft.x <= r2.topLeft.x && r1.topRight.x <= r2.topLeft.x;
    const isOnRight = r1.topLeft.x >= r2.topRight.x && r1.topRight.x >= r2.topRight.x;
    const isAbove = r1.topLeft.y >= r2.topLeft.y && r1.bottomLeft.y >= r2.topLeft.y;
    const isUnder = r1.topLeft.y <= r2.bottomLeft.y && r1.bottomLeft.y <= r2.bottomLeft.y;
    if (!(isOnLeft || isOnRight) && !(isAbove || isUnder)) {
        return true;
    }
    return false;
};

export const FORMS = [getHorizontalLeftForm, getHorizontalRightForm];
