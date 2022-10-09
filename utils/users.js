const users = []
// User joining to a chat
userJoin = (id,username,room) => {
    console.log(id,username,room,'is the user id , user name and user room!')
    const user = {id,username,room }
    // Now push this user to the users array ( incase if you are using a database to store the users and create a cookie for the users you can write the db code instead of pushng  the user into the users array and  use JWt :)
    users.push(user)
    console.log(user,'is the user')
    return user
}
// A function to find the user with the id 
getCurrentUser = (id) => users.find(user => user.id === id)
// Now a function to remove the user from the users array when the user leaves
userLeave = (id) => {
    const index = users.findIndex(user => user.id === id)
    if(index != -1) return users.splice(index,1)[0]
}
// Now a function to get the room users
getRoomUsers = (room) => users.filter(user => user.room === room)

// Now Exporting the functions
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}