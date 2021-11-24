import { v4 as uuid } from 'uuid'

class Person {

    constructor(name, age, hobbies) {
        this.id = uuid()
        this.name = name
        this.age = age
        this.hobbies = hobbies
    }

}