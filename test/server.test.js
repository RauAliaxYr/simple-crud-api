import { server } from '../src/server'
import http from 'http'
import dotenv from 'dotenv'
import {expect} from "@jest/globals";


test('E2E test by scenario ', () => {

    let port = process.env.PORT
    const options = {
        port: port,
        host: 'localhost',
        method: 'GET',
        body: 'q'
    };
    const req = http.request(options);
    req.end()


    req.on('connect', (res, socket, head) => {
        console.log('got connected!');
        expect(res.statusCode).toBe(200)
    })
    req.on('close', () => {
        console.log('got connected!');
    })

    expect()
})