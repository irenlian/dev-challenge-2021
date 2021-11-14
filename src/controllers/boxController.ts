import Koa from 'koa';
import CNC from '../lib/boxCutting';

export const simpleBoxController = async (ctx: Koa.Context) => {
    let sheet = (ctx.request.body as any).sheetSize as Models.Paper;
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

    const boxes: Models.Location[] = cnc.combineBoxes();
    const commands: Models.Command[] = CNC.convertToCommands(boxes);

    ctx.status = 200;
    ctx.body = {
        success: true,
        amount: boxes.length,
        program: commands,
    };
};
