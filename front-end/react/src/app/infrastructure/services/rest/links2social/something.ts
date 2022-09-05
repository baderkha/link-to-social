import { request } from "http";

export class Person {

    private age:number = 0;
    private name:string = "";
    private  lastName:string = "";

    constructor() {
    }

    setAge(age : number) : Person {
        this.age = age
        return this
    }

     setName(Name : string) : Person {
        this.name = Name
        return this
    }

     setLastName(lastName : string) : Person {
        this.lastName = lastName
        return this
    }
}


