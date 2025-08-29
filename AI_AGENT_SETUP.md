# AI Agent Setup Guide for VanKlas

This guide will help you set up and integrate the AI Content Agent into your VanKlas fitness app.

## Overview

The AI Agent automatically:

1. **Discovers** trending fitness content from multiple sources
2. **Generates** engaging social media posts using AI
3. **Creates** AI-generated images for posts
4. **Schedules** posts for approval and publishing
5. **Integrates** with social media platforms

## Prerequisites

- Firebase project with Firestore and Cloud Functions enabled
- OpenAI API key (for content generation and image creation)
- Node.js 18+ and npm

## Setup Steps

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install axios cheerio openai
```

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# OpenAI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (if not already set)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Configure Firebase Functions

Set your OpenAI API key in Firebase Functions:

```bash
firebase functions:config:set openai.api_key="your_openai_api_key_here"
```

### 4. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

### 5. Firestore Security Rules

Update your `firestore.rules` to allow access to the new collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Existing rules...

    // AI Agent collections
    match /scheduledPosts/{postId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    match /aiContent/{contentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Firebase Storage Rules

Update your storage rules to allow AI-generated images:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Existing rules...

    // AI-generated images
    match /ai-generated-images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Configuration Options

### Content Sources

Edit `app/lib/ai-agent.js` to customize content discovery sources:

```javascript
const AI_CONFIG = {
  discovery: {
    sources: [
      "https://www.acefitness.org/news/",
      "https://www.ideafit.com/news/",
      "https://www.fitness.org/news/",
      "https://www.nsca.com/news/",
      // Add your preferred fitness news sources
    ],
    keywords: [
      "fitness",
      "workout",
      "exercise",
      "health",
      "wellness",
      "sports",
      "training",
      "nutrition",
      "motivation",
      "fitness trends",
      // Customize keywords for your niche
    ],
    maxArticles: 10,
  },
};
```

### Social Media Platforms

Configure which platforms to post to:

```javascript
socialMedia: {
  platforms: ['twitter', 'linkedin', 'instagram', 'facebook'],
  defaultTags: [
    '#fitness', '#workout', '#health', '#wellness', '#motivation',
    // Add your brand-specific hashtags
  ],
  maxTags: 5,
}
```

### AI Model Configuration

Customize the AI model settings:

```javascript
openai: {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  model: 'gpt-4', // or 'gpt-3.5-turbo' for cost savings
  maxTokens: 500,
}
```

## Usage

### 1. Access the Dashboard

Navigate to `/ai-agent` in your app to access the AI Agent Dashboard.

### 2. Content Discovery

- Click "Refresh Content" to discover new fitness articles
- Review relevance scores and article summaries
- Add custom instructions for post generation
- Click "Generate Post" to create content

### 3. Manual Post Generation

- Enter a topic (e.g., "Morning workout routine")
- Add custom instructions for tone and focus
- Generate and edit AI-created content
- Schedule for approval

### 4. Post Approval

- Review generated posts in the approval tab
- Edit content, tags, and scheduling
- Approve posts to publish to social media
- Reject posts that don't meet your standards

## Social Media Integration

### Twitter/X API Setup

1. Create a Twitter Developer account
2. Create an app and get API keys
3. Add to your Cloud Functions:

```javascript
// In functions/index.js
const Twitter = require("twitter-api-v2");

const client = new Twitter({
  appKey: functions.config().twitter.app_key,
  appSecret: functions.config().twitter.app_secret,
  accessToken: functions.config().twitter.access_token,
  accessSecret: functions.config().twitter.access_secret,
});
```

### LinkedIn API Setup

1. Create a LinkedIn Developer account
2. Create an app and get OAuth tokens
3. Implement posting functionality in Cloud Functions

### Instagram API Setup

1. Connect to Facebook Graph API
2. Use Instagram Basic Display API
3. Implement image posting with captions

## Cost Optimization

### Free Tier Alternatives

- **Hugging Face**: Free open-source models
- **Replicate**: Free tier for AI models
- **NewsAPI**: 100 requests/day free
- **RSS feeds**: Completely free content

### Cost-Effective Options

- **GPT-3.5-turbo**: $0.002/1K tokens (vs GPT-4 at $0.03/1K)
- **DALL-E 2**: $0.02/image (vs DALL-E 3 at $0.04/image)
- **Batch processing**: Generate multiple posts at once

## Monitoring and Analytics

### Firebase Analytics

Track AI Agent usage:

```javascript
// In your components
import { getAnalytics, logEvent } from "firebase/analytics";

logEvent(analytics, "ai_post_generated", {
  content_length: post.content.length,
  tags_count: post.tags.length,
  source: post.sourceArticle?.source,
});
```

### Performance Metrics

Monitor:

- Content discovery success rate
- Post generation quality scores
- Social media posting success rates
- User engagement with AI-generated content

## Troubleshooting

### Common Issues

1. **Content Discovery Fails**

   - Check website accessibility
   - Verify scraping selectors
   - Monitor rate limiting

2. **AI Generation Errors**

   - Verify OpenAI API key
   - Check API quota limits
   - Review prompt formatting

3. **Social Media Posting Fails**
   - Verify API credentials
   - Check platform rate limits
   - Review content policies

### Debug Mode

Enable debug logging in Cloud Functions:

```javascript
// In functions/index.js
if (process.env.NODE_ENV === "development") {
  console.log("Debug mode enabled");
}
```

## Security Considerations

1. **API Key Protection**

   - Never expose API keys in client-side code
   - Use Firebase Functions for all API calls
   - Rotate keys regularly

2. **Content Moderation**

   - Implement content filtering
   - Review all generated content before posting
   - Monitor for inappropriate content

3. **Rate Limiting**
   - Implement request throttling
   - Monitor API usage
   - Set reasonable limits per user

## Future Enhancements

1. **Advanced AI Features**

   - Multi-language support
   - Content personalization
   - A/B testing for posts

2. **Enhanced Integration**

   - More social media platforms
   - Email newsletter integration
   - Content calendar management

3. **Analytics Dashboard**
   - Performance metrics
   - Content insights
   - ROI tracking

## Support

For technical support or questions:

- Check Firebase Functions logs
- Review browser console errors
- Test individual components
- Verify API configurations

## License

This AI Agent integration is part of the VanKlas project and follows the same licensing terms.
