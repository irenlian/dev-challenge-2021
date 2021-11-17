import Koa from 'koa';
import CNC from '../lib/cnc';

export const simpleBoxController = async (ctx: Koa.Context) => {
    let sheet = (ctx.request.body as any).sheetSize as Models.Sheet;
    let box = (ctx.request.body as any).boxSize as Models.BoxSize;

    const cnc = new CNC(sheet, box);

    if (!cnc.canBeUsed()) {
        ctx.throw(
            422,
            JSON.stringify({
                success: false,
                error: 'Invalid sheet size. Too small for producing at least one box',
            }),
        );
    }

    const boxes: Models.Location[][] = cnc.bestLocatedBoxes();
    const commands: Models.Command[] = cnc.convertToCommands(boxes);

    ctx.status = 200;
    ctx.body = {
        success: true,
        amount: boxes.length,
        program: commands,
    };
};
