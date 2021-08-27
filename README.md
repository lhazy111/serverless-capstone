# LouDev NOTE COLLECTOR

This app is created using serverless framework.

It allows to create and store notes and optionally update the note uploading scan of document or any image file.

It's using auth0 autentication which provide security of stored data for every user and the user can only access their data.

Creation time is generetad automatically and stored in database.

User also can delete the note if it is no longer required.

![image](https://user-images.githubusercontent.com/44120197/131193440-ac74b2f1-e764-45cc-a15f-522d2bbb14c1.png)
Login button has to be pressed to autenticate user

![image](https://user-images.githubusercontent.com/44120197/131193534-4d603145-6dab-4f56-b8a5-782231ecfb92.png)
User can login using email adress and password or using google account

![image](https://user-images.githubusercontent.com/44120197/131193640-0a18492e-6f15-4522-8207-8613c20505e3.png)
Note has to be typed into text window and at the end submitted using submit button.

![image](https://user-images.githubusercontent.com/44120197/131193744-37fc5b4e-7321-4cb7-bd01-ab1d48bcd346.png)
after submitting notes are displayed under the input window

![image](https://user-images.githubusercontent.com/44120197/131193828-63122585-4894-46b2-a610-2b2ef26d418b.png)
Two buttons on the right are used to : upload an image or delete the note.


To run a client application download a zip file, unzip and run following commands:

cd client
npm install
npm run start

This should start a development server with the React application that will interact with the Note Collector application.
