# AI Agent Cloud Functions Deployment Guide

## 🎯 **Overview**

The AI Agent functions are now separated into their own file (`functions/ai-agent.js`) for better organization and independent deployment. This guide shows you how to deploy them separately or together with your main functions.

## 📁 **File Structure**

```
functions/
├── index.js          # Main functions (email notifications)
├── ai-agent.js       # AI Agent functions (content discovery)
└── package.json      # Shared dependencies
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

### **1. Set OpenAI API Key (if needed later)**

```bash
firebase functions:config:set openai.api_key="your_openai_api_key_here"
```

### **2. Verify Configuration**

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

### **Authentication Required**

- All AI Agent functions require user authentication
- Functions check `context.auth` before processing
- Only authenticated users can access the functions

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

1. **Deploy AI Agent functions** using one of the deployment options above
2. **Test the functions** using the testing commands
3. **Monitor performance** in Firebase Console
4. **Adjust configuration** as needed for your use case

## 🆘 **Support**

If you encounter issues:

1. Check Firebase function logs
2. Verify function configuration
3. Test individual functions
4. Check authentication setup

---

**Note**: The AI Agent functions are designed to work independently but can be deployed together with your main functions if preferred.
