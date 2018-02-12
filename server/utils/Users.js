
class Users {

    constructor(){
        this.users = [];
    }

    addUser (id, name, room){
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser (id) {
        //returns an array with users that there id is not equal the id passed to the function.
        this.users =  this.users.filter(user => user.id !== id);
    }

    getUserById (id) {
        return  this.users.find(u => u.id === id);
    }
    getUsersByRoom (room) {
        //returns an array with users in the room supplied by the parameter.
        let users = this.users.filter(u => u.room ===room);
        //returns an array that contains only the names of the users.
        return users.map(u => u.name);
    }

}

module.exports = {Users};