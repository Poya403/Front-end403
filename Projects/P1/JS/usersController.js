document.addEventListener('alpine:init',() => {
    Alpine.data('usersdata',() => ({
        users: [],
        ShowModal : false,
        getUsers(){
            axios.get("https://jsonplaceholder.typicode.com/users").then((res)=>{
                this.users = res.data
            })
        }
    }))
})