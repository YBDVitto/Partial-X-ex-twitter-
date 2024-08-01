import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


function loadTweetsFromLocalStorage() {
    const storedTweets = localStorage.getItem('tweetsData');
    if (storedTweets) {
        return JSON.parse(storedTweets);
    } else {
        return [];
    }
}


function saveTweetsToLocalStorage() {
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}


let tweetsData = loadTweetsFromLocalStorage();

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like);
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply);
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick();
    }
    else if(e.target.dataset.submitReply){
        handleSubmitReplyClick(e.target.dataset.submitReply);
    } else if(e.target.dataset.remove) {
        removeTweet(e.target.dataset.remove);
    }
})

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--;
    } else {
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    saveTweetsToLocalStorage()
    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--;
    } else {
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    saveTweetsToLocalStorage()
    render();
}

function handleReplyClick(replyId){
    const replyElement = document.getElementById(`replies-${replyId}`);
    replyElement.classList.toggle('hidden');
}

function handleSubmitReplyClick(tweetId) {
    const tweetToReply = tweetsData.find(tweet => tweet.uuid === tweetId);
    
    const replyInput = document.getElementById(`reply-input-${tweetId}`);
    
    if(replyInput.value){
        tweetToReply.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
        });
        
        replyInput.value = ''
        saveTweetsToLocalStorage()
        render();
    }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        });
        tweetInput.value = ''
        saveTweetsToLocalStorage()
        render();
    }
}

function removeTweet(tweetId) {
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId);


    const tweetToRemove = tweetsData[tweetIndex];
    
    if (tweetToRemove.handle !== '@Scrimba') {
        alert("You can delete just the tweets you wrote");
    } else {
        tweetsData.splice(tweetIndex, 1);
        saveTweetsToLocalStorage()
        render();
    }
}

function getFeedHtml(){
    let feedHtml = '';
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = '';
        if (tweet.isLiked){
            likeIconClass = 'liked';
        }
        
        let retweetIconClass = '';
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted';
        }
        
        let repliesHtml = '';
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                        </div>
`;
            });
        }
        
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <button class="delete-btn" data-remove="${tweet.uuid}" id="delete-btn-${tweet.uuid}">DELETE</button>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                    <div class="reply-input-container">
                        <input type="text" id="reply-input-${tweet.uuid}" class="reply-input" placeholder="Scrivi una risposta...">
                        <button data-submit-reply="${tweet.uuid}" class="reply-btn general-btn">Rispondi</button>
                    </div>
                </div>   
            </div>
`;
   });
   return feedHtml; 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();
}

render();
