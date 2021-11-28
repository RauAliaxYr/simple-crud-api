import http from 'http'
import dotenv from 'dotenv'
import * as url from 'url'
import {Person} from './model.js'
import {validate} from "uuid";

dotenv.config()

const host = 'localhost'
const port = process.env.PORT

const persons = []

const server = http.createServer(((req, res,error) => {
        try {
            console.log("Request for " + req.url + ' by method ' + req.method)
            const urlparse = url.parse(req.url, true)

            const search = urlparse.path
            const [, adress, id] = search.split('/')
            if (adress !== 'person' || !adress) {
                res.writeHead(404, "Page is not found", {'Content-Type': 'text'})
                res.write("Page is not found")
                res.end()
            }

//GET
            if (req.method === 'GET' && adress === 'person') {
                if (id) {
                    if (validUUID(id)) {
                        if (persons.filter(person => person.id === id)) {
                            const person = persons.filter(person => person.id === id)
                            res.writeHead(200, {'Content-Type': 'application/json'})
                            res.end(JSON.stringify(person, null, true))
                        } else {
                            res.writeHead(404, {'Content-Type': 'HTML/text'})
                            res.write("Person is not found")
                            res.end()
                        }
                    } else {
                        res.writeHead(400, {'Content-Type': 'HTML/text'})
                        res.write("Invalid id")
                        res.end()
                    }
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify(persons, null, true))
                }
            }
//POST
            if (req.method === 'POST' && adress === 'person') {
                let data = ''
                req.on('data', chunk => {
                    data += chunk

                })
                req.on('end', () => {

                    let json = JSON.parse(data)

                    if (valid(json)) {
                        let newPerson = new Person(json.name, json.age, json.hobbies)
                        persons.push(newPerson)
                        res.writeHead(201, {'Content-Type': 'application/json'})
                        res.end(JSON.stringify(newPerson, null, true))
                    } else {
                        res.writeHead(400, {'Content-Type': 'HTML/text'})
                        res.write("Wrong person properties")
                        res.end()
                    }
                })
            }
///PUT
            if (req.method === 'PUT' && adress === 'person') {
                if (id) {
                    if (validUUID(id)) {
                        let data = ''
                        req.on('data', chunk => {
                            data += chunk
                        })
                        req.on('end', () => {
                            let json = JSON.parse(data)

                            if (persons.filter(person => person.id === id)) {

                                persons.forEach((person, index) => {
                                    if (person.id === id) {
                                        persons[index].name = json.name
                                        persons[index].age = json.age
                                        persons[index].hobbies = json.hobbies
                                    }
                                })
                                res.writeHead(200, {'Content-Type': 'application/json'})
                                res.end(JSON.stringify(persons.filter(person => person.id === id), null, true))
                            } else {
                                res.writeHead(404, {'Content-Type': 'HTML/text'})
                                res.write("Person is not found")
                                res.end()
                            }
                        })
                    } else {
                        res.writeHead(400, {'Content-Type': 'HTML/text'})
                        res.write("Invalid id")
                        res.end()
                    }
                } else {
                    res.writeHead(404, {'Content-Type': 'application/json'})
                    res.write("Page is not found")
                    res.end()
                }
            }

//DELETE
            if (req.method === 'DELETE' && adress === 'person') {
                if (id) {
                    if (validUUID(id)) {
                        for (let person in persons) {
                            if (persons[person].id === id) {
                                persons.splice(persons.indexOf(persons[person]), 1)
                                res.writeHead(204, {'Content-Type': 'HTML/text'})
                                res.end()
                            } else {
                                res.writeHead(404, {'Content-Type': 'HTML/text'})
                                res.write("Person is not found")
                                res.end()
                            }
                        }
                    } else {
                        res.writeHead(400, {'Content-Type': 'HTML/text'})
                        res.write("Invalid id")
                        res.end()
                    }
                } else {
                    res.writeHead(404, {'Content-Type': 'HTML/text'})
                    res.write("Page is not found")
                    res.end()
                }
            }
        }catch (e) {
            res.writeHead(500, {'Content-Type': 'HTML/text'})
            res.write("Something went wrong!")
            res.end()
        }
    }

))
//kek
function validUUID(id) {
    return validate(id)
}

function valid(json) {
    if ((typeof json.name) === 'string' && (typeof json.age) === 'number' && Object.keys(json).length === 3) {
        if (Array.isArray(json.hobbies)) {
            let array = json.hobbies
            let v = array.length
            while (v--) {
                if (!(typeof array[v] === 'string')) {
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

export {server}
