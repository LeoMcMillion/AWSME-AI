const ts = Math.round(new Date().getTime() / 1000); 
let script = document.createElement('script'); 
script.src = 'https://cdn.jsdelivr.net/gh/awsmeai/AWSME-AI@latest/AI-Chat.js?v=' + ts;
script.type = 'module';
document.head.appendChild(script); 
let link = document.createElement('link');
link.href = 'https://cdn.jsdelivr.net/gh/awsmeai/AWSME-AI@latest/AI-Chat.css?v=' + ts;
link.rel = 'stylesheet';
document.head.appendChild(link);
