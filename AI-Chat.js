function awsmeAiChatModule() {
  // ------ Passed variables --------
  // Settings
  const awsmeId = chatSettings_625791["userId"];
  const AIFirstGreeting = chatSettings_625791["greetText"];
  const triggerLabel = chatSettings_625791["triggerLabel"];
  const headline = chatSettings_625791["headline"];
  const paragraph = chatSettings_625791["paragraph"];
  
  // Styling 
  const botImgUrl = chatSettings_625791["botImg"];
  const visitorImgUrl = chatSettings_625791["visitorImg"];
  const triggerBgCol = chatSettings_625791["triggerBgCol"];
  const triggerTextCol = chatSettings_625791["triggerTextCol"];
  const headBgCol = chatSettings_625791["headBgCol"];
  const headTextCol = chatSettings_625791["headTextCol"];
  const chatBgCol = chatSettings_625791["chatBgCol"];
  const chatTextCol = chatSettings_625791["chatTextCol"];
  const inputBgCol = chatSettings_625791["inputBgCol"];
  const inputTextCol = chatSettings_625791["inputTextCol"];
  // -------------------------
  
  
  // Applying dynamic style here
  var newStyleTag = document.createElement('style');
  var dynamicAddedCSS = `.awsme-ai-chat .trigger {
        background-color: ${triggerBgCol};
      }      
      .awsme-ai-chat .trigger p {
        color: ${triggerTextCol};
      }
      .awsme-ai-chat .top-area {
        background: ${headBgCol};
      }
      .awsme-ai-chat .sidebar-title {
        color: ${headTextCol};
      }
      .awsme-ai-chat .chat-input {
        background: ${inputBgCol};
      }
      .awsme-ai-chat .review-options i {
        color: ${inputTextCol};
      }
      .awsme-ai-chat .user-input {
        color: ${inputTextCol}; 
      }
      .awsme-ai-chat .user-input::placeholder,
      .awsme-ai-chat .user-input::-moz-placeholder,
      .awsme-ai-chat .user-input::-webkit-input-placeholder,
      .awsme-ai-chat .user-input::-ms-input-placeholder {
        color: ${chatTextCol};
      }
      .awsme-ai-chat .sidebar {
        background: ${chatBgCol};
      }
      .awsme-ai-chat .bot .profile {
        background-image: url(${botImgUrl});
      }
      .awsme-ai-chat .user .profile {
        background-image: url(${visitorImgUrl});
      }`;
  
  newStyleTag.textContent = dynamicAddedCSS;
  document.head.appendChild(newStyleTag);
  
   
  const chatHTML = `<div class="awsme-ai-chat" style="z-index:1000; position: relative;">
    <div class="trigger">
        <span class="wave">👋</span> 
      <p style="margin-bottom: 0px;">
        ${triggerLabel}
      </p>
    </div>
    <div class="sidebar">
      <div class="top-area">
        <div class="close-x"><i class="fa-thin fa-xmark" style="font-size: 1.5em; color: white;"></i></div>
        <div class="sidebar-title">
          ${headline}
        </div>
      </div>
  
      <div class="sidebar-inner">
        <div class="chat-area">
        </div>
  
        <div class="input-area">
          <div class="chat-input">
            <textarea class="user-input" type="text" placeholder="${paragraph}"></textarea>
            <div class="send-icon"><i class="fa-regular fa-paper-plane" style="font-size: 1em; color: gray;"></i></div>
          </div>
          <p class="input-note">
            <a href="https://awsme.ai" target="_blank">AWSME.ai</a> - Always on. Always AWSME.
          </p>
        </div>
      </div>
    </div>
  </div>`
  
  
  document.addEventListener("DOMContentLoaded", function () {
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = chatHTML;
    document.body.appendChild(tempDiv.firstElementChild);
  
    setTimeout(function() {
      const chatWidth = 580;
      const triggerButton = document.querySelector('.trigger');
      const sendButton = document.querySelector('.send-icon');
      const closeButton = document.querySelector('.close-x i');
      const sidebar = document.querySelector('.sidebar');
      
      firstClick = true;
      triggerButton.addEventListener('click', () => {
        sidebar.style.right = '0';
        document.querySelector(".user-input").focus();
        if (firstClick) {
          updateMetric("numTriggerClicks");
          firstClick = false;
        }
      });
      closeButton.addEventListener('click', () => {
        sidebar.style.right = '-' + chatWidth + 'px';
      });
      
      
      // AI loader indicator HTML template
      function loaderIndicatorGen() {
        loader = `<div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>`
        return loader;
      }
      
      // AI RESPONSE AND CHAT LOGIC
      const userInput = document.querySelector(".user-input");
      const messageArea = document.querySelector(".chat-area"); // Where messages will be displayed
      
      // AI write functionality
      function AITextGen(element, text) {
          index = 0;
          interval = setInterval(() => {
              if (index < text.length){
                  element.innerText += text.charAt(index);
                  index++;
                
                  if (index % 25 == 0) {
                    messageArea.scrollTop = messageArea.scrollHeight;
                  }
              }
              else {
                  clearInterval(interval)
              }
          }, 20)
        waiting = false
      }
      
      // Generat unique id
      function generateUniqueId() {
        timeStamp = Date.now();
        randomNumber = Math.floor(Math.random() * 1000000).toString();
        return `id-${timeStamp}-${randomNumber}`;
      }
      
      // generate response row
      function responseRowGen(isAI, text, id, showReview) {
        let row;
        if (showReview) {
          const row_index = $(".review-row").length;
          row = `<div class="chat-row-wrapper ${row_index} ${isAI ? "bot": "user"} ${showReview ? "review-row": ""}">
                    <div class="profile">
                        ${isAI ? "": ""}
                    </div>
                    <div class="message-col">
                      <p class="message" id=${id}>${text}</p> 
                      <div class="review-options">
                        <div class="thumbs-up"><i class="fa-light fa-thumbs-up"></i></div>
                        <div class="neutral"><i class="fa-light fa-face-meh"></i></div>
                        <div class="thumbs-down"><i class="fa-light fa-thumbs-down"></i></div>
                      </div>
                    </div>
                </div>`;
        } 
        else {
          row = `<div class="chat-row-wrapper ${isAI ? "bot": "user"}">
                    <div class="profile">
                        ${isAI ? "": ""}
                    </div>
                    <p class="message" id=${id}>${text}</p>
                </div>`;
        }
        return row;
      }
      
      let reviews = [];
      let conversation = '{system: ' + presetBehavior + '}'
      async function getAIResponse(userMessage) {
        conversation += `{user: ${userMessage}}`
        response = await fetch('https://teckon.se/api/call/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversation,
            company: awsmeId
          }),
        })
      
        response = await response.text();
        response = JSON.parse(response);
      
        const message = response.response;
        const new_ref = response.ref;
        reviews.push(new_ref);
        conversation += `{assistant: ${message}}`;
      
        return message;
      }
      
      
      // Response review saving
      async function updateReviews(rating, responseRef) {
        updateMetric("numRatings");
        response = await fetch('https://teckon.se/api/reviews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: responseRef,
            rating: rating,
            company: awsmeId
          }),
        })
      
        response = await response.text();
        message = JSON.parse(response).response;
        console.log(message);
      }
      
      function updateClickEvents() {
        // UPDATE HUBDB WHEN ICON IS PRESSED
        document.querySelectorAll(".thumbs-up").forEach(function(element) {
          element.addEventListener("click", function() {
            var score = "Good";
            var parentClasses = element.parentElement.parentElement.parentElement.className.split(" ");
            var refIndex = parseInt(parentClasses[1]);
            var responseRef = reviews[refIndex];
            updateReviews(score, responseRef);
            updateMetric("numThumbsUp");
          });
        });
        document.querySelectorAll(".neutral").forEach(function(element) {
          element.addEventListener("click", function() {
            var score = "Okay";
            var parentClasses = element.parentElement.parentElement.parentElement.className.split(" ");
            var refIndex = parseInt(parentClasses[1]);
            var responseRef = reviews[refIndex];
            updateReviews(score, responseRef);
            updateMetric("numThumbsNeutral");
          });
        });
        document.querySelectorAll(".thumbs-down").forEach(function(element) {
          element.addEventListener("click", function() {
            var score = "Bad";
            var parentClasses = element.parentElement.parentElement.parentElement.className.split(" ");
            var refIndex = parseInt(parentClasses[1]);
            var responseRef = reviews[refIndex];
            updateReviews(score, responseRef);
            updateMetric("numThumbsDown");
          });
        });
        // CHANGE LOOK OF ICONS ON CLICK
        var elements = document.querySelectorAll('.thumbs-up, .neutral, .thumbs-down');
        elements.forEach(function(element) {
          element.addEventListener('click', function() {
            var icons = element.parentElement.children;
            for (var i = 0; i < icons.length; i++) {
              var icon = icons[i].querySelector("i");
              icon.classList.remove('fa-solid');
              icon.classList.add('fa-light');
            }
            icon = element.querySelector("i");
            icon.classList.remove('fa-light');
            icon.classList.add('fa-solid');
          });
        });
      }
      
      // Event listener for user input submission
      let lastEnterTimestamp = 0;
      let isLongDelay = true;
      let waiting = false;
      userInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && event.shiftKey && !waiting) {
          const currentTime = Date.now();
      
          if (isLongDelay || currentTime - lastEnterTimestamp > 300) {
            if (isLongDelay) {
              isLongDelay = false;
              setTimeout(() => {
                isLongDelay = true;
              }, 1000); // Change this delay for the initial long delay
            }
      
            lastEnterTimestamp = currentTime;
      
            event.preventDefault(); // Prevent sending the message
            cursorPosition = userInput.selectionStart; // Get the cursor position
            textBeforeCursor = userInput.value.substring(0, cursorPosition);
            textAfterCursor = userInput.value.substring(cursorPosition);
            newText = textBeforeCursor + '\n' + textAfterCursor;
            userInput.value = newText;
            userInput.scrollTop = userInput.scrollHeight;
          }
        }
        else if (event.key === "Enter" && !waiting) {
          event.preventDefault();
          waiting = true;
          submit();
        }
      });
      
      sendButton.onclick = () => {
        waiting = true;
        document.querySelector(".user-input").focus();
        submit();
      }
      
      firstEngagement = true;
      async function submit() {
        if (firstEngagement) {
          firstEngagement = false;
          updateMetric("numEngagements");
        }
        updateMetric("numResponses");
        
        inputText = userInput.value;
        userInput.value = "";
      
        // User chat row
        messageArea.innerHTML += responseRowGen(false, inputText, "", false)
      
        uniqueId = generateUniqueId();
        // Ai chat row
        messageArea.innerHTML += responseRowGen(true, "", uniqueId, true)
        messageArea.scrollTop = messageArea.scrollHeight;
      
        // Add loading indicator
        responseDiv = document.querySelector(`#${uniqueId}`);
        responseParent = responseDiv.parentNode;
        responseParent.innerHTML += loaderIndicatorGen();
      
        // Wait for AI response
        aiResponse = await getAIResponse(inputText);
      
        // Remove load indicator
        responseParent.querySelector(".typing-indicator").remove()
      
        // Write out AI response
        responseDiv = document.querySelector(`#${uniqueId}`);
        if (aiResponse) {
          AITextGen(responseDiv, aiResponse)
        }
        else {
          AITextGen(responseDiv, "Something went wrong, I couldn't answer. Try again")
        }
        updateClickEvents();
      }
      
      // First prompt from AI
      uniqueId = generateUniqueId();
      messageArea.innerHTML += responseRowGen(true, "", uniqueId, false)
      responseDiv = document.querySelector(`#${uniqueId}`);
      AITextGen(responseDiv, AIFirstGreeting)
            
                
      // UPDATE METRICS IN FIRESTORE
      async function updateMetric(metricName) {
        response = await fetch('https://teckon.se/api/metric/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metric: metricName,
            user_id: awsmeId,
          }),
        })
        response = await response.text();
        message = JSON.parse(response).response;
        console.log(message);
      }
      
      updateMetric("numTriggerViews");
    }, 200)
  });
}

awsmeAiChatModule();
  
         
  
