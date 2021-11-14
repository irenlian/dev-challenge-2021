import app from '../app';
import * as http from 'http';
import supertest from 'supertest';

describe('Box Endpoints', () => {
    const apptest = supertest(http.createServer(app.callback()));

    it('should create a new post', async () => {
        const res = await apptest.post('/api/simple_box').send({
            sheetSize: {
                w: 1500,
                l: 1000,
            },
            boxSize: {
                w: 200,
                d: 200,
                h: 200,
            },
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toEqual(true);
    });

    describe('Validation:', () => {
        it('returns an error if there is no input data', async () => {
            const res = await apptest.post('/api/simple_box').send();
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid Request Body - "sheetSize" is required`);
        });

        it('returns an error if there is no sheet data', async () => {
            const res = await apptest.post('/api/simple_box').send({
                boxSize: {
                    w: 200,
                    d: 200,
                    h: 200,
                },
            });
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid Request Body - "sheetSize" is required`);
        });

        it('returns an error if there is no box data', async () => {
            const res = await apptest.post('/api/simple_box').send({
                sheetSize: {
                    w: 1500,
                    l: 1000,
                },
            });
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid Request Body - "boxSize" is required`);
        });

        it('returns an error if there is no parameter inside dimensions', async () => {
            const res = await apptest.post('/api/simple_box').send({
                sheetSize: {
                    w: 1500,
                    l: 1000,
                },
                boxSize: {
                    w: 200,
                    d: 200,
                },
            });
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid Request Body - "boxSize.h" is required`);
        });

        it('returns an error if there is a wrong data type', async () => {
            const res = await apptest.post('/api/simple_box').send({
                sheetSize: {
                    w: 1500,
                    l: 1000,
                },
                boxSize: {
                    w: 200,
                    d: 200,
                    h: 'hi'
                },
            });
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid Request Body - "boxSize.h" must be a number`);
        });

        it('returns an error if there is a negative number', async () => {
            const res = await apptest.post('/api/simple_box').send({
                sheetSize: {
                    w: 1500,
                    l: 1000,
                },
                boxSize: {
                    w: 200,
                    d: 200,
                    h: -200
                },
            });
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid Request Body - "boxSize.h" must be a positive number`);
        });

        it('returns an error if there is a floating number', async () => {
            const res = await apptest.post('/api/simple_box').send({
                sheetSize: {
                    w: 1500,
                    l: 1000,
                },
                boxSize: {
                    w: 200,
                    d: 200,
                    h: 200.1
                },
            });
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid Request Body - "boxSize.h" must be an integer`);
        });

        it('returns an error if there is no enough place for a box', async () => {
            const res = await apptest.post('/api/simple_box').send({
                sheetSize: {
                    w: 700,
                    l: 700,
                },
                boxSize: {
                    w: 200,
                    d: 200,
                    h: 200
                },
            });
            expect(res.statusCode).toEqual(422);
            expect(res.body).toHaveProperty('success');
            expect(res.body.success).toEqual(false);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toEqual(`Invalid sheet size. Too small for producing at least one box`);
        });
    });
});
