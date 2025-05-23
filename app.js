const socket = io('wss://ws.vinnyroca.info');
const iframe = document.getElementById('unity-frame');
var updateTime = false;
var time = 0;
var timeOffset = 0;
var globalTime = new Date();
var usernameAlert = null;
var innocNumberLocal = 1;
var isHungry = false;
var foodAccepted = false;
var isEating = false;
var gifts = 0;
var unityConnected = false;

socket.on('connect', () =>{
    //cSetUsernameCondition();
    console.log("Joined");

});
socket.on('messageRefresh', messageArray => {
    console.log(messageArray);
    console.log("recieved Messages");
    chatLog = document.getElementById("chatLog");
    chatLog.innerHTML = "";
    for(var i =0; i<messageArray.length; i++)
    {
        const div = document.createElement('div');
        div.className = 'message';
       
        div.innerHTML = `${messageArray[i]}`;
        chatLog.appendChild(div);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
socket.on('message', text =>{
    chatLog = document.getElementById("chatLog");
    const div = document.createElement('div');
    div.className = 'message';
    
    div.innerHTML = `${text}`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
});
socket.on('innocNumber', innocNumber => {
    innocNumberLocal = innocNumber;
    document.getElementById('innoc').innerHTML = "L.I.E " + `${innocNumber}`;
});
socket.on('gifts', gift => {
    gifts = gift;
    document.getElementById('gifts').innerHTML = "GIFTS: " + `${gift}`;
});
socket.on('time', timeServer =>{
    time = timeServer;
    var localTime = Date.now();
    timeOffset = time - localTime;
    console.log(timeOffset);
    updateTime = true;
});
socket.on('foodButton', hungry =>{
    console.log("food button is "+ hungry);
    if(hungry){
        isHungry = true;
        document.getElementById('hungry').innerHTML = "htrue";
        document.getElementById('feedButton').hidden = false;
    }
    else{
        isHungry = false;
        document.getElementById('hungry').innerHTML = "hfalse";
        document.getElementById('feedButton').hidden = true;
    }
    
});
socket.on('foodAccepted', accepted =>{
    if(accepted){
        foodAccepted = true;
        document.getElementById('hasAccepted').innerHTML = " ftrue";
        
    }
    else{
        foodAccepted = false;
        document.getElementById('hasAccepted').innerHTML = "ffalse";
       
    }
   // SendDebugToUnity("f " + document.getElementById('hasAccepted').innerHTML + " e" +document.getElementById('eating').innerHTML)
    if(unityConnected){
        const unityWindow = iframe.contentWindow; 
                var food = 0;
                if(!foodAccepted){
                    food = 0;
                }
                else{
                    food = 1;
                }
                unityWindow.MyGameInstance.SendMessage('LambController', 'SetAccept', food);
            }
    
});
socket.on('eating', eating =>{
    if(eating){
        isEating = true;
        document.getElementById('eating').innerHTML = " etrue";
        
    }
    else{
        isEating = false;
        document.getElementById('eating').innerHTML = "efalse";
      
    }
    //SendDebugToUnity("f " + document.getElementById('hasAccepted').innerHTML + " e" +document.getElementById('eating').innerHTML)
     if(unityConnected){
                 const unityWindow = iframe.contentWindow; 
               var eat = 0;
                if(!isEating){
                    eat = 0;
                }
                else{
                    eat = 1;
                }
                unityWindow.MyGameInstance.SendMessage('LambController', 'SetEating', eat);
            }
    
    
});


// socket.on('game', text =>{
//     console.log(text);
//     const unityWindow = iframe.contentWindow;
//     unityWindow.MyGameInstance.SendMessage('Lamb', 'CubeOn');
// });

// document.getElementById('sendButton').onclick = () =>
// {
//     const text = document.querySelector('input').value;
//     socket.emit('message',text);
// }

document.getElementById('feedButton').onclick = () =>
{
    // var formatedTime = GetTime();
    // const text = formatedTime + " - " + localStorage.getItem('name') + "(O:3)" + " made a food offering to" + " Innoc. " + innocNumberLocal;
    // socket.emit('food', text);
    var foodOffering = false;
    var foodOfferingRand = Math.random();
    if(foodOfferingRand>.5){
        foodOffering = false;
        console.log(foodOffering);
    }
    else{
        foodOffering = true;
        console.log(foodOffering);
    }
    socket.emit('feed', foodOffering);
}

// document.getElementById('sendButton2').onclick = () =>{
//     const text = document.getElementById('inputText').value;
//     socket.emit('message',text);
//     console.log(text);
// }


// document.getElementById('username-button').onclick = () =>
// {
//     const inputElement = document.getElementById('username-input');
//     const inputValue = inputElement.value;
//     if(inputValue.length == 3)
//     {
//         localStorage.setItem('name', inputValue);
//         SetUsernameCondition();
//         if(usernameAlert != null)
//         {
//             usernameAlert.remove();
//             usernameAlert = null;
//         }
//     }
//     else{
//         if(usernameAlert == null)
//         {
//             usernameAlert = document.createElement('div');
//             usernameAlert.innerHTML = "HINT: THREE CHARACTERS"
//             document.getElementById('main-content').append(usernameAlert);
//         }
        
//     }
// }

// document.getElementById('reset').onclick = () => {
//         console.log("pressed");
//         localStorage.clear();
//         SetUsernameCondition();
//     }
function updateClock(){
    if(updateTime)
        {
            var fTime = new Date(Date.now()+timeOffset);
            document.getElementById('time').innerHTML = GetTime() + ":"+ fTime.getSeconds();
            if(unityConnected){
                 const unityWindow = iframe.contentWindow; 
                unityWindow.MyGameInstance.SendMessage('LambController', 'SetSeconds', fTime.getSeconds());
            }
        }
    
}
function GetTime()
{
    var fTime = new Date(Date.now()+timeOffset);
    globalTime = fTime;
    var hour;
    var min;

    if(fTime.getHours().toString().length == 1)
    {
        var hour = "0"+fTime.getHours().toString();
    }
    else{
        var hour = fTime.getHours();
    }
    
    if(fTime.getMinutes().toString().length == 1)
    {
            
            var min = "0"+ fTime.getMinutes().toString();
    }
    else{
        var min = fTime.getMinutes();
    }
    return hour + ":" + min;
}

function GetSeconds(){
    var fTime = new Date(Date.now()+timeOffset);
    globalTime = fTime;

    console.log(fTime.getSeconds());
    var sec = fTime.getSeconds();
    fTime.getMilliseconds();
    return sec;
}

function GetMinute(){
    var fTime = new Date(Date.now()+timeOffset);
    globalTime = fTime;

    var min = fTime.getMinutes()

    if(min.toString().length == 1){
        console.log(min);
        return("0"+min);
    }
    else{
        var minString = min.toString();
        var secondNumberString = minString[1];
        console.log(min);
        return(minString[0] + secondNumberString);
    }

}

function SendDebugToUnity(message){
    if(unityConnected){
        const unityWindow = iframe.contentWindow; 
        unityWindow.MyGameInstance.SendMessage('LambController', 'PrintDebug', message);
    }
}


setInterval(updateClock,300);

document.addEventListener('DOMContentLoaded', () => {
    
    const unityWindow = iframe.contentWindow; 

    if (!iframe) {
        console.error('Iframe not found!');
        return;
    }

    iframe.onload = () => {
        unity = unityWindow.MyGameInstance
        if (!unityWindow) {
            console.error('unityWindow is not defined!');
            return;
        }
        
        //Set Unity Conditions

        const checkGameInstance = setInterval(() => {
            if (unityWindow.MyGameInstance) {
                clearInterval(checkGameInstance);
                unityConnected = true;
                console.log('gameInstance found! Sending message to Unity...');
                unityWindow.MyGameInstance.SendMessage('LambController', 'SetMinute', GetMinute());
                //unityWindow.MyGameInstance.SendMessage('LambController', 'SetWalkStart', GetSeconds());
                var fTime = new Date(Date.now()+timeOffset);
                var eat = 0;
                if(!isEating){
                    eat = 0;
                }
                else{
                    eat = 1;
                }
                unityWindow.MyGameInstance.SendMessage('LambController', 'SetEating', eat);
                var food = 0;
                if(!foodAccepted){
                    food = 0;
                }
                else{
                    food = 1;
                }
                unityWindow.MyGameInstance.SendMessage('LambController', 'SetAccept', food);

            
             
            } else {
                console.log('Waiting for gameInstance to be ready...');
            }
        }, 500);

        // document.getElementById('callUnity').onclick = () =>
        //    {
        //         console.log('click');
        //         unityWindow.MyGameInstance.SendMessage('Lamb', 'CubeOn');
        //         socket.emit('game', 'name');
        //     }

        
        //Chnage Camera View

        document.getElementById('right').onclick = () =>
        {
            unityWindow.MyGameInstance.SendMessage('MainCamera', 'ChangeCameraRight')
        }
        //^Change Camera Views
        document.getElementById('left').onclick = () =>
        {
            unityWindow.MyGameInstance.SendMessage('MainCamera', 'ChangeCameraLeft')
        }
    };

});

// function SetUsernameCondition()
// {
//     //localStorage.clear();
//     if(localStorage.getItem('name') != null){

//         document.getElementById('left').hidden = false;
//         document.getElementById('right').hidden = false;
//         document.getElementById('username-input').hidden = true;
//         document.getElementById('username-button').hidden = true;
//         document.getElementById('feedButton').hidden = true;
//         document.getElementById('chat-header').innerHTML = localStorage.getItem('name');
//     }
//     else
//     {
//         document.getElementById('left').hidden = true;
//         document.getElementById('right').hidden = true;
//         document.getElementById('username-input').hidden = true;
//         document.getElementById('username-button').hidden = true;
//         document.getElementById('chat-header').innerHTML = " ";
//         document.getElementById('feedButton').hidden = true;
//     }
// }

// socket.on('connect', () =>{
//     SetUsernameCondition();
//     console.log("Joined");
//     //socket.emit("messageRefresh", "hello");
//     // if(localStorage.getItem('name') != null){
//     //     newMessage = GetTime() + " - " + localStorage.getItem('name') + " has returned"
//     //     socket.emit('message', `${newMessage}`)

//     // }
//     // else{
//     //     newMessage = GetTime() + " - " + "Someone unknown has arrived";
//     //     socket.emit('message', `${newMessage}`);
//     // }
// });

// socket.on('messageRefresh', messageArray => {
//     console.log(messageArray);
//     console.log("recieved Messages");
//     chatLog = document.getElementById("chatLog");
//     chatLog.innerHTML = "";
//     for(var i =0; i<messageArray.length; i++)
//     {
//         const div = document.createElement('div');
//         div.className = 'message';
//         div.innerHTML = `${messageArray[i]}`;
//         chatLog.appendChild(div);
//         chatLog.scrollTop = chatLog.scrollHeight;
//     }
// });

// socket.on('message', text =>{
//     // const el = document.createElement('li');
//     // el.innerHTML = text;
//     // document.querySelector('ul').appendChild(el);
//     chatLog = document.getElementById("chatLog");
//     const div = document.createElement('div');
//     div.className = 'message';
    
//     div.innerHTML = `${text}`;
//     chatLog.appendChild(div);
//     chatLog.scrollTop = chatLog.scrollHeight;
// });

// socket.on('eat', text => {
//     document.getElementById('feedButton').hidden = true;
// });
// socket.on('innocNumber', innocNumber => {
//     innocNumberLocal = innocNumber;
//     document.getElementById('innoc').innerHTML = "Innoc. " + `${innocNumber}`;
// });

// socket.on('hunger', text => {
//     if(localStorage.getItem('name') != null)
//     {
//         console.log("false");
//         document.getElementById('feedButton').hidden = false;
//     }
// });


// socket.on('game', text =>{
//     console.log(text);
//     const unityWindow = iframe.contentWindow;
//     unityWindow.MyGameInstance.SendMessage('Lamb', 'CubeOn');
// });

// socket.on('time', timeServer =>{
//     time = timeServer;
//     var localTime = Date.now();
//     timeOffset = time - localTime;
//     console.log(timeOffset);
//     updateTime = true;
// });

// socket.on('innocFed', message =>{
//     document.getElementById('feedButton').hidden = true;
// });

// document.getElementById('sendButton').onclick = () =>
// {
//     const text = document.querySelector('input').value;
//     socket.emit('message',text);
// }

// document.getElementById('feedButton').onclick = () =>
// {
//     var formatedTime = GetTime();
//     const text = formatedTime + " - " + localStorage.getItem('name') + "(O:3)" + " made a food offering to" + " Innoc. " + innocNumberLocal;
//     socket.emit('food', text);
//     var foodOfferingRand = Math.floor(Math.random()*1);
//     socket.emit('foodOffering', foodOfferingRand);
// }

// document.getElementById('username-button').onclick = () =>
// {
//     const inputElement = document.getElementById('username-input');
//     const inputValue = inputElement.value;
//     if(inputValue.length == 3)
//     {
//         localStorage.setItem('name', inputValue);
//         SetUsernameCondition();
//         if(usernameAlert != null)
//         {
//             usernameAlert.remove();
//             usernameAlert = null;
//         }
//     }
//     else{
//         if(usernameAlert == null)
//         {
//             usernameAlert = document.createElement('div');
//             usernameAlert.innerHTML = "HINT: THREE CHARACTERS"
//             document.getElementById('main-content').append(usernameAlert);
//         }
        
//     }
// }

// document.getElementById('reset').onclick = () => {
    
    
//         console.log("pressed");
//         localStorage.clear();
//         SetUsernameCondition();
//     }




// function updateClock(){
//     if(updateTime)
//         {
            
//             // var localTime = +Date.now()
//             // var timeDiff =  
            
//             // var timediff = time.now() + 1000;
//             // time = new Date(timediff);
           


            
//             document.getElementById('time').innerHTML = GetTime();
//         }
// }

// function GetTime()
// {
//     var fTime = new Date(Date.now()+timeOffset);
//     globalTime = fTime;
//     var hour;
//     var min;
//     if(fTime.getHours().toString().length == 1)
//     {
//         var hour = "0"+fTime.getHours().toString();
//     }
//     else{
//         var hour = fTime.getHours();
//     }
    
//     if(fTime.getMinutes().toString().length == 1)
//     {
            
//             var min = "0"+ fTime.getMinutes().toString();
//     }
//     else{
//         var min = fTime.getMinutes();
//     }
//     return hour + ":" + min;
// }

// updateClock();
// setInterval(updateClock,1000);
// // setInterval(CheckTime, 1000)




// // Wait until Unity is fully loaded
// // iframe.onload = () => {
    

// //     document.getElementById('callUnity').addEventListener('click', () => {
// //         socket.emit('eat',"hi");
// //         //unityWindow.gameInstance.SendMessage('Lamb', 'OnCube');
// //         callUnityMethodSafe('Lamb', 'OnCube');
// //     });

    
// // };


// //var buildUrl = "Build";
// // var loaderUrl = "unityBuild/Build/unityBuild.loader.js";
// // var script = document.createElement("script");
// // script.src = loaderUrl;
// // script.onload = () => {
// //     document.addEventListener('DOMContentLoaded', () => {
// //     createUnityInstance(canvas, config, (progress) => { /*...*/ }).then((unityInstance) => {
// //         MyGameInstance = unityInstance;})
// //     if(MyGameInstance)
// //     {
// //         console.log('game instance found');
// //     }
// //     else{
// //         console.log('not found');
// //     }
// // });

    
//     // };
// document.addEventListener('DOMContentLoaded', () => {
    
//     const unityWindow = iframe.contentWindow; 

//     if (!iframe) {
//         console.error('Iframe not found!');
//         return;
//     }

//     iframe.onload = () => {
//         unity = unityWindow.MyGameInstance
//         if (!unityWindow) {
//             console.error('unityWindow is not defined!');
//             return;
//         }
            

//         const checkGameInstance = setInterval(() => {
//             if (unityWindow.MyGameInstance) {
//                 clearInterval(checkGameInstance);
//                 console.log('gameInstance found! Sending message to Unity...');
             
//             } else {
//                 console.log('Waiting for gameInstance to be ready...');
//             }
//         }, 500);

//         document.getElementById('callUnity').onclick = () =>
//             {
//                 console.log('click');
//                 //unityWindow.MyGameInstance.SendMessage('Lamb', 'CubeOn');
//                 socket.emit('game', 'gameOn');
//             }

//         document.getElementById('right').onclick = () =>
//         {
//             unityWindow.MyGameInstance.SendMessage('MainCamera', 'ChangeCameraRight')
//         }

//         document.getElementById('left').onclick = () =>
//         {
//             unityWindow.MyGameInstance.SendMessage('MainCamera', 'ChangeCameraLeft')
//         }
//     };

// });

// function SetUsernameCondition()
// {
//     //localStorage.clear();
//     if(localStorage.getItem('name') != null){

//         document.getElementById('left').hidden = false;
//         document.getElementById('right').hidden = false;
//         document.getElementById('username-input').hidden = true;
//         document.getElementById('username-button').hidden = true;
//         document.getElementById('feedButton').hidden = true;
//         document.getElementById('chat-header').innerHTML = localStorage.getItem('name') + " O:0";
//     }
//     else
//     {
//         document.getElementById('left').hidden = true;
//         document.getElementById('right').hidden = true;
//         document.getElementById('username-input').hidden = false;
//         document.getElementById('username-button').hidden = false;
//         document.getElementById('chat-header').innerHTML = " ";
//         document.getElementById('feedButton').hidden = true;
        
//     }
// }


    