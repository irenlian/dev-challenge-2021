import Location = Models.Location;
import { getRectangularsFromBox, isIntersected } from './form';

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
