cd server 
> nodemon index.js

1) User Registeration =
    
    http://localhost:4000/register

        {
            "email":"shamal02@gmai.com",
            "password":"abcd"
        }

2) User Details =
 
    http://localhost:4000/getUserDetails

        {
            "userId":"637cb35c3a752f10efc0162d"
        }

3) User login =
   
    http://localhost:4000/login

        {
            "email":"shamal02@gmai.com",
            "password":"abcd"
        }

4) Get Database details =

    http://localhost:4000/getItems?id=637cb35c3a752f10efc0162d

5) Set Message = 
 
    http://localhost:4000/setMessage

        {
            "newMessage":"shama",
            "userId":"637cb35c3a752f10efc0162d"
        }

6) Get Message =

    http://localhost:4000/getMessage

        {
            "userId":"637cb35c3a752f10efc0162d"
        }

7) Get User Balance = 

    http://localhost:4000/getUserBalance

        {
            "userId":"637cb35c3a752f10efc0162d"
        }

8) Approve Owner address = 

    http://localhost:4000/ApproveOwner

        {
            "amount":"2"
        }

9) Transfer Token to user from owner = 

    http://localhost:4000/transferTokenOnBuy

            {
                "userId":"637cb35c3a752f10efc0162d",
                "amount" : "2"
            }

10) Approve User = 

    http://localhost:4000/ApproveUser

        {
            "userId":"637cb35c3a752f10efc0162d",
            "amount" : "2"
        }

11) Transfer Tokens from User to Admin = 

    http://localhost:4000/transferTokenOnSell

        {
            "userId":"637cb35c3a752f10efc0162d",
            "amount" : "2"
        }

12) Create Tokens 

    http://localhost:4000/CreateToken

        {
            "amount":"2"
        }