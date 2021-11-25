import http from 'http'
import dotenv from 'dotenv'
import * as url from 'url'
import {Person} from './model.js'

dotenv.config()

const host = 'localhost'
const port = process.env.PORT

const persons = []

const server = http.createServer(((req, res) => {
    console.log("Request for " + req.url + ' by method ' + req.method)
    const urlparse = url.parse(req.url, true)

    const search = urlparse.path
    const [, adress, id] = search.split('/')

    if (req.method === 'GET' && adress === 'person') {
        if (id) {
            if (persons.filter(person => person.id === id)) {
                const person = persons.filter(person => person.id === id)
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(person, null, true))
            } else {
                res.writeHead(404, {'Content-Type': 'HTML/text'})
                res.end()
            }
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(persons, null, true))
        }
    }
    if (req.method === 'POST' && adress === 'person') {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            let json = JSON.parse(data)

            if (valid(json)){
                let newPerson = new Person(json.name,json.age,json.hobbies)
                persons.push(newPerson)
                res.writeHead(201, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(newPerson, null, true))
            } else {
                res.writeHead(400, {'Content-Type': 'HTML/text'})
                res.end()
            }
        })
    }
}))

function valid(json){
    if ((typeof json.name)==='string' && (typeof json.age) === 'number' && Object.keys(json).length ===3){
        if (Array.isArray(json.hobbies)){
            let array = json.hobbies
            let v = array.length
            while (v--){
                if (!(typeof array[v] === 'string')){
                    return false
                }
            }
        }
        return true
    }
    return false
}


server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})
