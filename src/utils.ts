import Location = Models.Location;

// top-left, top-right, bottom-right, bottom-left
type Rectangular = {
    topLeft: Location;
    topRight: Location;
    bottomRight: Location;
    bottomLeft: Location;
};

const getTopLeft = (dots: Location[]) => {
    const minX = Math.min(...dots.map(d => d.x));
    const maxY = Math.max(...dots.map(d => d.y));
    return dots.find(d => d.x === minX && d.y === maxY) as Location;
}
const getTopRight = (dots: Location[]) => {
    const maxX = Math.max(...dots.map(d => d.x));
    const maxY = Math.max(...dots.map(d => d.y));
    return dots.find(d => d.x === maxX && d.y === maxY) as Location;
}
const getBottomLeft = (dots: Location[]) => {
    const minX = Math.min(...dots.map(d => d.x));
    const minY = Math.min(...dots.map(d => d.y));
    return dots.find(d => d.x === minX && d.y === minY) as Location;
}
const getBottomRight = (dots: Location[]) => {
    const maxX = Math.max(...dots.map(d => d.x));
    const minY = Math.min(...dots.map(d => d.y));
    return dots.find(d => d.x === maxX && d.y === minY) as Location;
}

const getRectangularsFromBox = (box: Location[]): [Rectangular, Rectangular] => {
    const shorter = [box[4], box[5], box[10], box[11]];
    const longer = [box[2], box[7], box[8], box[1]];
    return [
        { topLeft: getTopLeft(shorter), topRight: getTopRight(shorter), bottomRight: getBottomRight(shorter), bottomLeft: getBottomLeft(shorter) }, // shorter
        { topLeft: getTopLeft(longer), topRight: getTopRight(longer), bottomRight: getBottomRight(longer), bottomLeft: getBottomLeft(longer) }, // longer
    ];
};

const isIntersected = (r1: Rectangular, r2: Rectangular): boolean => {
    const isOnLeft = r1.topLeft.x <= r2.topLeft.x && r1.topRight.x <= r2.topLeft.x;
    const isOnRight = r1.topLeft.x >= r2.topRight.x && r1.topRight.x >= r2.topRight.x;
    const isAbove = r1.topLeft.y >= r2.topLeft.y && r1.bottomLeft.y >= r2.topLeft.y;
    const isUnder = r1.topLeft.y <= r2.bottomLeft.y && r1.bottomLeft.y <= r2.bottomLeft.y;
    if (!(isOnLeft || isOnRight) && !(isAbove || isUnder)) {
        return true;
    }
    return false;
};

export const isBoxOverlapped = (boxes: Location[][], newBox: Location[]): boolean => {
    const recs = getRectangularsFromBox(newBox);
    // for each box already located on the sheet
    for (const b of boxes) {
        // split it on two rectangulars
        const boxRecs = getRectangularsFromBox(b);
        // check 4 rectangulars if they overlap
        for (const r1 of recs) {
            for (const r2 of boxRecs) {
                if (isIntersected(r1, r2)) {
                    return true;
                }
            }
        }
    }
    return false;
}
