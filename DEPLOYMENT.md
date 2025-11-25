# Deployment Guide for Pferdeäpfel

## Prerequisites

Before deploying, you need to prepare your code for production:

### Required Code Changes

1. **Update `server.js`** - Change line 3:
   ```javascript
   const PORT = process.env.PORT || 3001;
   ```

2. **Update `src/gameManager.ts`** - Change lines 210-213:
   ```typescript
   const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
   const wsUrl = window.location.hostname === 'localhost' 
     ? 'ws://localhost:3001'
     : `${protocol}//${window.location.hostname}`;
   ```

3. **Update `package.json`** - Change the start script:
   ```json
   "start": "node server.js"
   ```

4. **Update `server.js`** - Add Express to serve static files (full replacement needed):
   ```javascript
   import { WebSocketServer } from 'ws';
   import express from 'express';
   import { fileURLToPath } from 'url';
   import { dirname, join } from 'path';
   import { createServer } from 'http';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   const PORT = process.env.PORT || 3001;
   const app = express();

   // Serve static files from dist folder
   app.use(express.static(join(__dirname, 'dist')));

   // Serve index.html for all routes (SPA support)
   app.get('*', (req, res) => {
     res.sendFile(join(__dirname, 'dist', 'index.html'));
   });

   // Create HTTP server
   const server = createServer(app);

   // Attach WebSocket server to HTTP server
   const wss = new WebSocketServer({ server });

   // ... rest of your WebSocket code ...

   server.listen(PORT, () => {
     console.log(`🎮 Pferdeäpfel server running on port ${PORT}`);
   });
   ```

5. **Install Express**:
   ```bash
   npm install express
   ```

---

## Option 1: Deploy to Render.com (Recommended - FREE)

### Step 1: Prepare Your Repository

1. Commit all your changes to Git:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push
   ```

2. Push to GitHub (if not already there):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended for easy deployment)
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `pferdeaepfel` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 4: Environment Variables (Optional)

Add environment variables if needed:
- `NODE_ENV` = `production`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for initial deployment
3. Render will automatically:
   - Install dependencies
   - Build your Vite app
   - Start the server
   - Provide you with a URL like: `https://pferdeaepfel.onrender.com`

### Step 6: Test

1. Open the provided URL
2. Test creating and joining games
3. WebSocket should work automatically over WSS (secure WebSocket)

### Notes on Render Free Tier:

- ⚠️ **Server spins down after 15 minutes of inactivity**
- First request after inactivity takes 30-60 seconds to wake up
- Automatic HTTPS/WSS included
- 750 hours/month free (enough for hobby projects)

### Auto-Deploy:

- Every push to `main` branch triggers automatic redeployment
- Can set up different branches for staging/production

---

## Option 2: Deploy to Azure App Service

### Step 1: Prerequisites

1. Install Azure CLI:
   - Download from [https://learn.microsoft.com/en-us/cli/azure/install-azure-cli](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
   - Or use PowerShell:
     ```powershell
     Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
     Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
     ```

2. Login to Azure:
   ```bash
   az login
   ```

### Step 2: Create Azure Resources

1. **Create Resource Group**:
   ```bash
   az group create --name pferdeaepfel-rg --location eastus
   ```

2. **Create App Service Plan**:
   
   For FREE tier (limited):
   ```bash
   az appservice plan create --name pferdeaepfel-plan --resource-group pferdeaepfel-rg --sku F1 --is-linux
   ```
   
   For BASIC tier ($13/month, recommended):
   ```bash
   az appservice plan create --name pferdeaepfel-plan --resource-group pferdeaepfel-rg --sku B1 --is-linux
   ```

3. **Create Web App**:
   ```bash
   az webapp create --resource-group pferdeaepfel-rg --plan pferdeaepfel-plan --name pferdeaepfel-game --runtime "NODE:20-lts"
   ```
   
   Note: `pferdeaepfel-game` must be globally unique. Try adding numbers if taken.

### Step 3: Enable WebSocket

```bash
az webapp config set --resource-group pferdeaepfel-rg --name pferdeaepfel-game --web-sockets-enabled true
```

### Step 4: Configure Deployment

**Option A: Deploy from Local Git**

1. Enable local Git deployment:
   ```bash
   az webapp deployment source config-local-git --name pferdeaepfel-game --resource-group pferdeaepfel-rg
   ```

2. Get deployment credentials:
   ```bash
   az webapp deployment list-publishing-credentials --name pferdeaepfel-game --resource-group pferdeaepfel-rg --query "{Username:publishingUserName, Password:publishingPassword}"
   ```

3. Add Azure as Git remote:
   ```bash
   git remote add azure https://<username>@pferdeaepfel-game.scm.azurewebsites.net/pferdeaepfel-game.git
   ```

4. Deploy:
   ```bash
   git push azure main
   ```

**Option B: Deploy from GitHub**

1. In Azure Portal:
   - Go to your Web App
   - Navigate to **Deployment Center**
   - Select **GitHub** as source
   - Authorize and select your repository
   - Select branch (`main`)
   - Azure will create GitHub Actions workflow automatically

### Step 5: Configure Build Settings

1. Set Node version and build command:
   ```bash
   az webapp config appsettings set --resource-group pferdeaepfel-rg --name pferdeaepfel-game --settings NODE_ENV=production SCM_DO_BUILD_DURING_DEPLOYMENT=true
   ```

2. Configure startup command:
   ```bash
   az webapp config set --resource-group pferdeaepfel-rg --name pferdeaepfel-game --startup-file "npm start"
   ```

### Step 6: Add Build Configuration

Create `.deployment` file in your project root:
```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT = true
```

Create `web.config` file in your project root:
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="true" />
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### Step 7: Deploy and Test

1. Push code (if using Git):
   ```bash
   git push azure main
   ```

2. Monitor deployment:
   ```bash
   az webapp log tail --name pferdeaepfel-game --resource-group pferdeaepfel-rg
   ```

3. Your app will be available at:
   ```
   https://pferdeaepfel-game.azurewebsites.net
   ```

### Step 8: Configure Custom Domain (Optional)

1. Add custom domain:
   ```bash
   az webapp config hostname add --webapp-name pferdeaepfel-game --resource-group pferdeaepfel-rg --hostname www.yourdomain.com
   ```

2. Enable HTTPS:
   ```bash
   az webapp update --name pferdeaepfel-game --resource-group pferdeaepfel-rg --https-only true
   ```

---

## Troubleshooting

### WebSocket Connection Issues

1. **Check if WebSocket is enabled** (Azure):
   ```bash
   az webapp config show --name pferdeaepfel-game --resource-group pferdeaepfel-rg --query webSocketsEnabled
   ```

2. **Check logs**:
   - Render: View logs in Render dashboard
   - Azure: `az webapp log tail --name pferdeaepfel-game --resource-group pferdeaepfel-rg`

3. **Verify protocol**: Your app should automatically use `wss://` (secure WebSocket) in production

### Build Failures

1. **Clear cache and rebuild** (Render): Go to dashboard → Manual Deploy → Clear build cache

2. **Check Node version**: Ensure `package.json` has:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

### Performance Issues

1. **Azure Free Tier**: Limited to 60 minutes/day compute time
2. **Render Free Tier**: Spins down after 15 minutes inactivity
3. **Solution**: Upgrade to paid tier for always-on service

---

## Cost Comparison

| Platform | Free Tier | Paid Tier | WebSocket | Always-On |
|----------|-----------|-----------|-----------|-----------|
| **Render** | ✅ 750 hrs/mo | $7/mo | ✅ | ❌ Free / ✅ Paid |
| **Azure App Service** | ✅ Limited | $13/mo (B1) | ✅ | ❌ Free / ✅ Paid |
| **Railway** | 500 hrs trial | $5/mo usage-based | ✅ | ✅ |
| **Fly.io** | ✅ 3 VMs | ~$2-10/mo | ✅ | ✅ |

---

## Recommended Choice

**For Hobby/Demo**: Use **Render.com** (easiest, free, good enough)

**For Production/Business**: Use **Azure App Service B1 tier** (reliable, scalable, enterprise support)

**For Indie Dev**: Use **Railway.app** (best balance of price/performance)

---

## Next Steps After Deployment

1. ✅ Test all game features in production
2. ✅ Set up monitoring (Azure Application Insights or Render metrics)
3. ✅ Configure custom domain (optional)
4. ✅ Set up CI/CD for automatic deployments
5. ✅ Add error tracking (Sentry, LogRocket, etc.)
6. ✅ Test WebSocket reconnection on mobile networks
7. ✅ Add rate limiting to prevent abuse
8. ✅ Set up database for persistent game history (optional)

---

## Support

- Render Docs: [https://render.com/docs](https://render.com/docs)
- Azure Docs: [https://learn.microsoft.com/en-us/azure/app-service/](https://learn.microsoft.com/en-us/azure/app-service/)
- Azure WebSocket Guide: [https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs](https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs)
