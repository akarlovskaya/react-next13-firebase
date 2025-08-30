# AI Agent Cloud Functions Deployment Guide

## 🎯 **Overview**

The AI Agent system consists of two main components:

- **Backend**: Cloud Functions in `functions/ai-agent.js` for server-side operations
- **Frontend**: Client library in `app/lib/ai-agent.js` for React components

This guide shows you how to deploy the Cloud Functions separately or together with your main functions.

## 📁 **File Structure**

```
functions/
├── index.js          # Main functions (email notifications)
├── ai-agent.js       # AI Agent functions (content discovery)
└── package.json      # Shared dependencies

app/
├── lib/
│   └── ai-agent.js   # Frontend client library
├── components/
│   └── AIAgentDashboard.js  # Main dashboard component
└── ai-agent-dashboard/
    └── page.js       # AI Agent Dashboard page route
```

## 🚀 **Deployment Options**

### **Option 1: Deploy AI Agent Functions Separately (Recommended)**

```bash
# Deploy only AI Agent functions
firebase deploy --only functions:discoverContent,functions:getArticlesFromLast7Days,functions:approveArticle,functions:dailyContentDiscovery,functions:aiAgentHealth
```

### **Option 2: Deploy All Functions Together**

```bash
# Deploy all functions (main + AI Agent)
firebase deploy --only functions
```

### **Option 3: Deploy by Function Groups**

```bash
# Deploy main functions only
firebase deploy --only functions:sendFollowNotification,functions:sendClassNotification

# Deploy AI Agent functions only
firebase deploy --only functions:discoverContent,functions:getArticlesFromLast7Days,functions:approveArticle,functions:dailyContentDiscovery,functions:aiAgentHealth
```

## ⚙️ **Configuration Setup**

### **1. Set AI Agent Access Control**

```bash
# Set the user ID who can access AI Agent functions
firebase functions:config:set ai_agent.access_user_id="your_firebase_user_uid_here"
```

### **2. Set OpenAI API Key (if needed later)**

```bash
firebase functions:config:set openai.api_key="your_openai_api_key_here"
```

### **3. Set Frontend Environment Variables**

Create `.env.development` file in your project root:

```bash
# AI Agent Access Control (must match Firebase config)
NEXT_PUBLIC_AI_AGENT_ACCESS_USER_ID="your_firebase_user_uid_here"
```

### **4. Verify Configuration**

```bash
firebase functions:config:get
```

## 🔧 **Function Details**

### **Available AI Agent Functions:**

| Function                   | Type          | Purpose                           | Access              |
| -------------------------- | ------------- | --------------------------------- | ------------------- |
| `discoverContent`          | HTTP Callable | Scrape and store fitness articles | Authenticated users |
| `getArticlesFromLast7Days` | HTTP Callable | Retrieve recent articles          | Authenticated users |
| `approveArticle`           | HTTP Callable | Mark articles as approved         | Authenticated users |
| `dailyContentDiscovery`    | Scheduled     | Daily content scraping            | System (every 24h)  |
| `aiAgentHealth`            | HTTP Callable | Health check and status           | Authenticated users |

## 📊 **Monitoring & Logs**

### **View Function Logs**

```bash
# View all AI Agent function logs
firebase functions:log --only discoverContent,getArticlesFromLast7Days,approveArticle,dailyContentDiscovery,aiAgentHealth

# View specific function logs
firebase functions:log --only discoverContent
```

### **Function Status**

```bash
# Check function status
firebase functions:list
```

## 🧪 **Testing Functions**

### **1. Test Content Discovery**

```bash
# Test the discoverContent function
curl -X POST "https://us-central1-YOUR_PROJECT.cloudfunctions.net/discoverContent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -d '{}'
```

### **2. Test Health Check**

```bash
# Test the health check function
curl -X POST "https://us-central1-YOUR_PROJECT.cloudfunctions.net/aiAgentHealth" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -d '{}'
```

## 🔒 **Security Considerations**

### **Multi-Layer Access Control**

- **Frontend**: Dashboard checks `NEXT_PUBLIC_AI_AGENT_ACCESS_USER_ID` against user UID
- **Backend**: Cloud Functions verify user authentication and authorization
- **Page Route**: `/ai-agent-dashboard` route protected by component-level access control

### **Authentication Required**

- All AI Agent functions require user authentication
- Functions check `context.auth` before processing
- Only users with matching UID can access the functions
- Access control happens both client-side and server-side

### **Rate Limiting**

- Consider implementing rate limiting for production use
- Monitor function usage and costs

## 💰 **Cost Optimization**

### **Function Configuration**

- **Memory**: 256MB (default) - sufficient for web scraping
- **Timeout**: 60 seconds (default) - adequate for most operations
- **Concurrency**: 80 (default) - good for moderate usage

### **Scheduled Function**

- `dailyContentDiscovery` runs every 24 hours
- Minimal cost impact (~$0.01/month)

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Function Not Found**

   ```bash
   # Redeploy the specific function
   firebase deploy --only functions:discoverContent
   ```

2. **Authentication Errors**

   - Ensure user is signed in
   - Check Firebase Auth configuration

3. **Scraping Failures**
   - Check website accessibility
   - Verify selectors in AI_CONFIG
   - Monitor function logs

### **Debug Mode**

Enable detailed logging in the AI Agent functions:

```javascript
// In functions/ai-agent.js
const DEBUG = true;

if (DEBUG) {
  console.log("Debug mode enabled");
  console.log("Function parameters:", data);
}
```

## 📈 **Performance Monitoring**

### **Key Metrics to Watch**

- **Function execution time**
- **Memory usage**
- **Error rates**
- **Article discovery success rate**
- **Storage costs**

### **Firebase Console**

Monitor functions in the Firebase Console:

1. Go to Functions section
2. View execution logs
3. Monitor performance metrics
4. Check error rates

## 🔄 **Updates & Maintenance**

### **Updating AI Agent Functions**

```bash
# Make changes to functions/ai-agent.js
# Then redeploy
firebase deploy --only functions:discoverContent,functions:getArticlesFromLast7Days,functions:approveArticle,functions:dailyContentDiscovery,functions:aiAgentHealth
```

### **Rollback Strategy**

```bash
# Rollback to previous version
firebase functions:rollback --only discoverContent,getArticlesFromLast7Days,approveArticle,dailyContentDiscovery,aiAgentHealth
```

## 📝 **Next Steps**

1. **Set environment variables** in `.env.development` and Firebase config
2. **Deploy AI Agent functions** using one of the deployment options above
3. **Test the dashboard** at `/ai-agent-dashboard` route
4. **Test the functions** using the testing commands
5. **Monitor performance** in Firebase Console
6. **Adjust configuration** as needed for your use case

## 🌐 **Frontend Deployment**

### **Deploy Frontend Changes**

```bash
# Deploy Next.js app (if using hosting)
firebase deploy --only hosting

# Or build and deploy manually
npm run build
# Deploy your built files to your hosting provider
```

### **Access the AI Agent Dashboard**

- Navigate to `/ai-agent-dashboard` in your deployed app
- Only users with matching UID can access the dashboard
- Unauthorized users will see access denied message

## 🆘 **Support**

If you encounter issues:

1. **Frontend Issues**:

   - Check browser console for errors
   - Verify `NEXT_PUBLIC_AI_AGENT_ACCESS_USER_ID` is set correctly
   - Ensure user is authenticated with Firebase

2. **Backend Issues**:

   - Check Firebase function logs
   - Verify function configuration
   - Test individual functions
   - Check authentication setup

3. **Access Control Issues**:
   - Verify UID matches between frontend and backend
   - Check Firebase Auth configuration
   - Ensure user has proper permissions

---

**Note**: The AI Agent system now includes both frontend and backend components. The Cloud Functions can be deployed independently, but the frontend dashboard requires proper environment variable configuration to function correctly.
