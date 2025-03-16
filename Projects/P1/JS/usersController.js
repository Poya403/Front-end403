document.addEventListener('alpine:init',() => {
    Alpine.data('usersdata',() => ({
        mainUser : [],
        searchChar : "",
        users: [],
        pageUsers: [],
        ShowModal : false,
        pcount : 1, //page count
        icount : 5, //items count
        curr : 1 , // current page
        isloading : false,
        //the information of new user
        firstname : "",
        lastname : "",
        AddUserInfo:{
            name : "",
            email : "",
            address :{
                street : "",
                city : "",
                zipcode : "",
            },
        },
        getUsers(){
            axios.get("https://jsonplaceholder.typicode.com/users").then((res)=>{
                this.mainUser = res.data
                this.users = res.data
                this.pagination()
            })
        },
        pagination(){
            this.pcount = Math.ceil(this.users.length / this.icount)
            let start = (this.curr * this.icount) - this.icount  ,  end = this.curr * this.icount
            this.pageUsers = this.users.slice(start , end)
        },
        nextpage(){ this.curr < this.pcount ? this.curr++ : this.curr = this.pcount , this.pagination() },
        previouspage(){ this.curr > 1 ? this.curr-- : this.curr = 1  , this.pagination() },
        searching(value){
            this.users = this.mainUser.filter(user => user.name.includes(value) || user.email.includes(value) || 
                user.address.city.includes(value) || user.address.street.includes(value))
            this.curr = 1
            this.pagination()
        },
        SubmitInfo(){
            try{
                this.AddUserInfo.name = this.firstname + " " + this.lastname
                this.isloading = true
                axios.post("https://jsonplaceholder.typicode.com/users", this.AddUserInfo).then((res)=>{
                    if(res.status === 201){
                        this.mainUser.push(res.data)
                        this.ShowModal = false
                        this.isloading = false
                        this.ResetInfo()
                        this.pagination()
                        M.toast({html: 'عملیات با موفقیت انجام شد', classes: 'rounded'});
                    }
                })
            }catch(error){
                console.error("Error occurred:", error);
            }
        },
        ResetInfo(){
            this.firstname = "",
            this.lastname = "",
            this.AddUserInfo = {
                name : "",
                email : "",
                address :{
                    street : "",
                    city : "",
                    zipcode : "",
                },
            }
        },
        DeleteInfo(name){
            var toastHTML = '<button class="btn-flat toast-action">حذف</button> <span>کاربر  '+name+' حذف شود ؟ </span>';
            M.toast({html: toastHTML});
        }
    }))
})