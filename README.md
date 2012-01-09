# Recursive Node
Web based editor, console and testing environment. For developing Node.Js made with Node.Js.
It was made as a university project at http://www.psut.edu.jo.

## Recursive or Nested
So it's nested, though recursive sounds more interesting.

## How to start it
It requires Node.Js for sure, and it will help if you some tool like `supervisor` to run it.
Some libraries are also required, though not included like expressjs and socket.io.
Ace -- the JavaScript code editor is used in the core of the 

`$ supervisor master.js` in case you have supervisor.
`$ node master.js` or just use the old way.

### Notes
Until now this code will not run unless you add the full `src` directory of Ace in the root folder of the project. Proper link to all required git repositories will be added, hopefully soon enough.

## Usage Details
It's an editor, that allows multiple users to edit/run their own instances of Node.Js. The editor is Ace code editors. Everyone access it is required to enter and ID, it should be unique within that session (for now it's from 10 to 95). Will be used for other purposes like being his/her port number.
A user can save/restart his app, which is essentially one server file called `server.js`, and one client file called `client.html`. The app is an expressjs server with a socket.io server, while it's a client for both on the client side.
No authentication or authorization were used, so be careful if you were using it while a hacker is present. At least I was ready since I knew all or at least most of the vulnerabilities. Though some have been exploit it way faster than I thought.

## More Resources
See the presentation on this link: https://docs.google.com/presentation/d/186gjmM57OWfl0SYobPqSK8IOSUY8LS6-GkBoaBZuLLI/edit
Yes it's not very comprehensive. I made it in about one hour.

## Development Notes
Code comments are rarely exists. Hopefully, will be added soon.

## Thanks
 - Dr. Lo'ai Tawalbeh http://www.just.edu.jo/~tawalbeh for his kind support. (supervisor)
 - Ala'a Mubaied for exploiting the application live during the presentation. https://plus.google.com/u/0/105061254239060981213/about.

