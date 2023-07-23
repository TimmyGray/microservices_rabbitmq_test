# microservices_rabbitmq_test

This is simple test application with two microservices and message broker - rabbitmq  
Microservice M1 - take http request and sends message into  rabbit request queue. It is just test app, so in the get method is create string as body replacer  
Microservice M2 - listen request from another port, it may be used in the future but not for current task  
In logs directory you can find logs from all actions  

How to start:  
1) Clone this repo  
2) Write in console "npm i" from the app directory (Node.js must be installed)
3) install docker  
4) Write in console docker pull rabbitmq  
5) Write in console docker run -p 5762:5762 rabbitmq  
6) (optional) In .env you can setup some environments or you can use default values  
7) Write in console "npm run m1" and "npm run m2"  
8) Open browser on host:port url (http:\\localhost:3001)  
