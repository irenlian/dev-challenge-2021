import { Form } from './types';

// startPoint left bottom point of the rectangular of box
export const getHorizontalLeftForm: Form = ({ h, d, w }, startPoint) =>
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

export const getHorizontalRightForm: Form = ({ h, d, w }, startPoint) =>
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

export const getVerticalTopForm: Form = ({ h, d, w }, startPoint) =>
    [
        { x: h, y: 2 * w + h },
        { x: h, y: 2 * w + 2 * h },
        { x: h + d, y: 2 * w + 2 * h },
        { x: h + d, y: 2 * w + h },
        { x: 2 * h + d, y: 2 * w + h },
        { x: 2 * h + d, y: w + h },
        { x: h + d, y: w + h },
        { x: h + d, y: 0 },
        { x: h, y: 0 },
        { x: h, y: w + h },
        { x: 0, y: w + h },
        { x: 0, y: 2 * w + h },
        { x: h, y: 2 * w + h },
    ].map(p => ({ x: p.x + startPoint.x, y: p.y + startPoint.y }));

export const getVerticalBottomForm: Form = ({ h, d, w }, startPoint) =>
    [
        { x: h + d, y: h },
        { x: h + d, y: 0 },
        { x: h, y: 0 },
        { x: h, y: h },
        { x: 0, y: h },
        { x: 0, y: h + w },
        { x: h, y: h + w },
        { x: h, y: 2 * h + 2 * w },
        { x: h + d, y: 2 * h + 2 * w },
        { x: h + d, y: h + w },
        { x: 2 * h + d, y: h + w },
        { x: 2 * h + d, y: h },
        { x: h + d, y: h },
    ].map(p => ({ x: p.x + startPoint.x, y: p.y + startPoint.y }));

export const FORMS: Form[] = [getHorizontalLeftForm, getHorizontalRightForm, getVerticalTopForm, getVerticalBottomForm];
