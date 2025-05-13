document.addEventListener('alpine:init', () => {
    Alpine.data('usersdata', () => ({
        mainUsers: [],
        searchChar: "",
        users: [],
        pageUsers: [],
        ShowModal: false,
        pcount: 1, //page count
        icount: 5, //items count
        curr: 1, // current page
        isloading: false,
        useridtoedit: null,
        //the information of user
        full_name,
        UserInfo: {
            name: "",
            email: "",
            address: {
                street: "",
                city: "",
                zipcode: "",
            },
        },
        //getting the information of users from jsonplaceholder
        getUsers() {
            axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
                this.mainUsers = res.data
                this.users = res.data
                this.pagination()
            })
        },
        //Settings for displaying the number of users
        pagination() {
            this.pcount = Math.ceil(this.users.length / this.icount)
            let start = (this.curr * this.icount) - this.icount, end = this.curr * this.icount
            this.pageUsers = this.users.slice(start, end)
        },
        //Go to the next or previous page
        nextpage() { this.curr < this.pcount ? this.curr++ : this.curr = this.pcount, this.pagination() },
        previouspage() { this.curr > 1 ? this.curr-- : this.curr = 1, this.pagination() },
        //-------
        //searching a value in the user management page
        searching(value) {
            value = value.toLowerCase()
            this.users = this.mainUsers.filter(user => user.name.toLowerCase().includes(value) || 
                user.email.toLowerCase().includes(value) || user.address.city.toLowerCase().includes(value)
                 || user.address.street.toLowerCase().includes(value))
            this.curr = 1
            this.pagination()
        },
        //add new user
        AddUserInfo() {
            try {
                this.isloading = true
                axios.post("https://jsonplaceholder.typicode.com/users", this.UserInfo).then((res) => {
                    if (res.status === 201) {
                        this.mainUsers.push(res.data)
                        this.ShowModal = false
                        this.isloading = false
                        this.pagination()
                        this.ResetInfo()
                        M.toast({ html: 'عملیات با موفقیت انجام شد', classes: 'rounded' });
                    }
                })
            } catch (error) {
                console.error("Error occurred:", error);
            }
        },
        ResetInfo() {
            this.firstname = "",
                this.lastname = "",
                this.UserInfo = {
                    name: "",
                    email: "",
                    address: {
                        street: "",
                        city: "",
                        zipcode: "",
                    },
                }
        },
        DeleteInfo(user) {
            var toastHTML = '<button class="btn-flat toast-action" x-on:click="ConfirmDeleteInfo(' + user.id + ')">حذف</button> <span>کاربر  ' + user.name + ' حذف شود ؟ </span>';
            M.toast({ html: toastHTML });
        },
        ConfirmDeleteInfo(userId) {
            axios.delete("https://jsonplaceholder.typicode.com/users/" + userId).then((res) => {
                this.mainUsers = this.mainUsers.filter(user => user.id !== userId)
                this.users = this.users.filter(user => user.id !== userId)
                this.pagination()
                M.toast({ html: 'کاربر با موفقیت حذف شد', classes: 'green' })
            }).catch(error => {
                console.error("Error deleting user:", error);
            });
        },
        GetUserInfoToUpdate(user) {
            axios.get("https://jsonplaceholder.typicode.com/users/" + user.id).then(res => {
                if(res.status === 200){
                    this.UserInfo =  {
                        name: res.data.name,
                        email: res.data.email,
                        address: {
                            street: res.data.address.street,
                            city: res.data.address.city,
                            zipcode: res.data.address.zipcode,
                        },
                    }
                    this.useridtoedit = res.data.id
                }
            }) 
            this.ShowModal = true;
        },
        UpdateUserInfo(user) {
            try {
                this.isloading = true
                axios.put("https://jsonplaceholder.typicode.com/users/"+ this.useridtoedit, this.UserInfo).then((res) => {
                    if (res.status === 200) {
                        const userindex = this.mainUsers.findIndex(user => user.id === this.useridtoedit)
                        this.mainUsers[userindex] = res.data
                        this.ShowModal = false
                        this.isloading = false
                        this.useridtoedit = null
                        this.ResetInfo()
                        this.pagination()
                        M.toast({ html: 'عملیات با موفقیت انجام شد', classes: 'rounded' });
                    }
                })
            } catch (error) {
                console.error("Error occurred:", error);
            }
        },
    }))
})