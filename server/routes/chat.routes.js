const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { messages } = req.body;
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  const lastMessage = messages[messages.length - 1].content.toLowerCase();
  
  let reply = "Hello! I am Don, Deraya's Research Assistant. I can help you find papers across our 4 faculties, summarize research topics, or guide you through creating your own academic profile.";
  
  if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
    reply = "Greetings! How can I assist you with your research in Deraya today?";
  } else if (lastMessage.includes('faculty') || lastMessage.includes('faculties')) {
    reply = "Deraya University features 4 premier faculties: Business Administration, Physical Therapy, Dentistry, and Pharmacy. Each faculty publishes their research papers regularly on this platform.";
  } else if (lastMessage.includes('research') || lastMessage.includes('paper')) {
    reply = "You can discover over 120+ peer-reviewed papers in our Repository. Try searching by keywords like 'Clinical Pharmacology' or 'Zirconia crowns' in the top search bar.";
  } else if (lastMessage.includes('who are you')) {
    reply = "I'm Don, a virtual academic assistant powered by Deraya Edge. I'm here to streamline your research process and help you uncover knowledge.";
  } else {
    // Generate some contextual academic sounding response
    reply = `That is an interesting topic. Given my current database of Deraya publications, I suggest checking out the "Research Papers" section for more detailed methodologies and peer-reviewed insights regarding that specific subject.`;
  }

  // Simulate network delay to make it feel like AI
  setTimeout(() => {
    res.json({ reply });
  }, 1000);
});

module.exports = router;
