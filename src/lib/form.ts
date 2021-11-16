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

export const FORMS = [getHorizontalLeftForm, getHorizontalRightForm];
