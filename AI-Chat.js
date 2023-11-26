
const awsmeId = chatSettings_625791["userId"];
function awsmeAiChatModule() {
  // ------ Passed variables --------
  // Settings
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
    <div class="trigger" style="bottom: 15%;">
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
    
    const chatWidth = 580;
    const triggerButton = document.querySelector('.trigger');
    const sendButton = document.querySelector('.send-icon');
    const closeButton = document.querySelector('.close-x');
    const sidebar = document.querySelector('.sidebar');
  
    setTimeout(function() {
      sidebar.style.right = '-' + chatWidth + 'px';
      sidebar.style.width = chatWidth + 'px';
      
      firstClick = true;
      triggerButton.addEventListener('click', () => {
        sidebar.style.right = '0';
        document.querySelector(".user-input").focus();
        if (firstClick) {
          updateMetric(user_metric="numTriggerClicks");
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
      function AITextGen(element, textList) {
        index = 0;
        interval = setInterval(() => {
            if (index < textList.length) {
            element.innerHTML += textList[index];
            if (index % 25 == 0) {
                messageArea.scrollTop = messageArea.scrollHeight;
            }
            index++;
            }
            else {
              setTimeout(function() {
                messageArea.scrollTop = messageArea.scrollHeight;
              }, 200);
              clearInterval(interval);
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
                        <div class="thumbs-up">
                        <span class="fa-light">
                            {% icon
                              name="{{ module.style.icons.thumbs_up.name }}"
                              style="{{ module.style.icons.thumbs_up.type }}"
                              unicode="{{ module.style.icons.thumbs_up.unicode }}"
                              icon_set="{{ module.style.icons.thumbs_up.icon_set }}"
                            %}
                          <span>
                        </div>
                        <div class="neutral">
                          <span class="fa-light">
                            {% icon
                              name="{{ module.style.icons.neutral.name }}"
                              style="{{ module.style.icons.neutral.type }}"
                              unicode="{{ module.style.icons.neutral.unicode }}"
                              icon_set="{{ module.style.icons.neutral.icon_set }}"
                            %}
                          </span>
                        </div>
                        <div class="thumbs-down">
                          <span class="fa-light">
                            {% icon
                              name="{{ module.style.icons.icon_field.name }}"
                              style="{{ module.style.icons.icon_field.type }}"
                              unicode="{{ module.style.icons.icon_field.unicode }}"
                              icon_set="{{ module.style.icons.icon_field.icon_set }}"
                            %}
                          </span>
                        </div>
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
      
      function responseHTMLModifier(string, className, action_data) {
        action_id = action_data[0]
        stringList = string.split("");
        if (action_id.length == 20) {
          action_url = action_data[1]
          action_cta = action_data[2]
          updateMetric(userMetric="", subcollection="actions", sub_doc_ref=action_id, sub_metric="views")
          
          ctaHTML = `<a class="${className} cta-callout" href="${action_url}" target="_blank"onclick="updateMetric(userMetric='', subcollection='actions', sub_doc_ref='${action_id}', sub_metric='clicks')">
            <span class="cta-callout-label">${action_cta}</span>
            </a>`
          stringList.push(ctaHTML);
        }
        return stringList;
      }

      let conversation = "";
      let reviewRefs = [];
      let questionsAndAnswers = [];
      async function getAIResponse(userMessage) {
        userMessage = userMessage.replace("{", "");
        userMessage = userMessage.replace("}", "");
        
        let lead_stage = localStorage.getItem('lead_stage') != null ? localStorage.getItem('lead_stage'): "";
        let lead_ref = localStorage.getItem('lead_ref') != null ? localStorage.getItem('lead_ref'): "";
        
        newMessage = `{user: ${userMessage}}`;

        while (conversation.length + newMessage.length > 3000) {
            conversation = conversation.substring(conversation.indexOf('}') + 1).trim();
        }
        conversation += newMessage;

        if (firstEngagement) {
            new_session = true;
        }
        else {
            new_session = false;
        }

        response = await fetch('https://awsme.co/api/call/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: conversation,
                user_id: awsmeId,
                lead_stage: lead_stage,
                lead_ref: lead_ref,
                new_session: new_session
            }),
        })

        response = await response.text();
        response = JSON.parse(response);

        action_data = response.action_data;
        lead_stage = response.lead_stage;
        lead_ref = response.lead_ref;

        localStorage.setItem('lead_stage', lead_stage)
        if (lead_ref.length > 0) {
          localStorage.setItem('lead_ref', lead_ref)
        }

        message = response.response;
        message = message.replace("{", "");
        message = message.replace("}", "");

        reviewRefs.push("");
        questionsAndAnswers.push({"question": userMessage, "answer": message})
        conversation += `{assistant: ${message}}`;

        return [message, action_data];
      }


      // Response review saving
      async function saveReview(rating, question, answer, reviewIndex) {
        updateMetric(user_metric="numRatings");
        if (rating == "Good") {
          updateMetric(user_metric="numThumbsUp");
        }
        else if (rating == "Okay") {
          updateMetric(user_metric="numThumbsNeutral");
        }
        else if (rating == "Bad") {
          updateMetric(user_metric="numThumbsDown");
        }

        response = await fetch('https://awsme.co/api/save-review/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: question,
            answer: answer,
            rating: rating,
            user_id: awsmeId
          }),
        })

        response = await response.text();
        response = JSON.parse(response);
        message = response.response;
        ref = response.ref;
        reviewRefs[reviewIndex] = ref;
        console.log(message);
      }

      async function updateReview(rating, ref) {
        response = await fetch('https://awsme.co/api/update-review/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: ref,
            rating: rating,
            user_id: awsmeId
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
            var responseRef = reviewRefs[refIndex];
            if (responseRef == "") {
              saveReview(score, questionsAndAnswers[refIndex]["question"], questionsAndAnswers[refIndex]["answer"], refIndex)
            }
            else {
              updateReview(score, responseRef);
            }
          });
        });
        document.querySelectorAll(".neutral").forEach(function(element) {
          element.addEventListener("click", function() {
            var score = "Okay";
            var parentClasses = element.parentElement.parentElement.parentElement.className.split(" ");
            var refIndex = parseInt(parentClasses[1]);
            var responseRef = reviewRefs[refIndex];
            if (responseRef == "") {
              saveReview(score, questionsAndAnswers[refIndex]["question"], questionsAndAnswers[refIndex]["answer"], refIndex)
            }
            else {
              updateReview(score, responseRef);
            }
          });
        });
        document.querySelectorAll(".thumbs-down").forEach(function(element) {
          element.addEventListener("click", function() {
            var score = "Bad";
            var parentClasses = element.parentElement.parentElement.parentElement.className.split(" ");
            var refIndex = parseInt(parentClasses[1]);
            var responseRef = reviewRefs[refIndex];
            if (responseRef == "") {
              saveReview(score, questionsAndAnswers[refIndex]["question"], questionsAndAnswers[refIndex]["answer"], refIndex)
            }
            else {
              updateReview(score, responseRef);
            }
          });
        });
        // CHANGE LOOK OF ICONS ON CLICK
        var elements = document.querySelectorAll('.thumbs-up, .neutral, .thumbs-down');
        elements.forEach(function(element) {
          element.addEventListener('click', function() {
            var icons = element.parentElement.children;
            for (var i = 0; i < icons.length; i++) {
              var icon = icons[i].querySelector("span");
              icon.classList.remove('fa-solid');
              icon.classList.add('fa-light');
            }
            icon = element.querySelector("span");
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
        [aiResponse, action_data] = await getAIResponse(inputText);

        // Remove load indicator
        responseParent.querySelector(".typing-indicator").remove()

        // Write out AI response
        responseDiv = document.querySelector(`#${uniqueId}`);

        // Modify AI response string to instead have html elements in it
        actionElementClass = generateUniqueId();
        aiResponseList = responseHTMLModifier(aiResponse, actionElementClass, action_data);

        if (aiResponse) {
            AITextGen(responseDiv, aiResponseList)
        }
        else {
            AITextGen(responseDiv, "Something went wrong, I couldn't answer. Try again".split(''))
        }

        updateClickEvents();
        if (firstEngagement) {
            firstEngagement = false;
            updateMetric(user_metric="numEngagements");
        }
        updateMetric(user_metric="numResponses");
    }

      // First prompt from AI
      uniqueId = generateUniqueId();
      messageArea.innerHTML += responseRowGen(true, "", uniqueId, false)
      responseDiv = document.querySelector(`#${uniqueId}`);
      AITextGen(responseDiv, AIFirstGreeting)

      updateMetric(user_metric="numTriggerViews");
    }, 200)

    $(document).ready(function(){
      $('textarea.user-input').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    });

  });
}

awsmeAiChatModule();

// UPDATE METRICS IN FIRESTORE (Must be in global scope)
async function updateMetric(user_metric="", subcollection="", sub_doc_ref="", sub_metric="") {
  response = await fetch('https://awsme.co/api/metric/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: awsmeId,
      user_metric: user_metric,
      subcollection: subcollection,
      sub_doc_ref: sub_doc_ref,
      sub_metric: sub_metric
    }),
  })
  response = await response.text();
  message = JSON.parse(response).response;
  console.log(message);
}
         
  
