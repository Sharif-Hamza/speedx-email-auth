# SpeedX Email Authentication Service

Node.js microservice for handling user signup and email confirmation using Amazon SES and Supabase.

## 🚀 Features

- ✅ User signup with email/password
- ✅ Email confirmation via Amazon SES
- ✅ Secure token generation and validation
- ✅ Resend confirmation email functionality
- ✅ iOS deep link support for mobile app
- ✅ Rate limiting and security best practices
- ✅ Admin approval workflow integration
- ✅ Branded HTML email templates
- ✅ Railway deployment ready

## 📋 Prerequisites

Before deployment, you need:

1. **Supabase Project**
   - Project URL
   - Service Role Key (from Settings → API)

2. **Amazon SES Account**
   - Verified sender email (`support@speed-x.us`)
   - AWS Access Key ID
   - AWS Secret Access Key
   - Move out of SES sandbox for production

3. **Deployment Platform** (Railway recommended)

## 🛠️ AWS SES Setup

### Step 1: Verify Your Email

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Navigate to **Verified identities**
3. Click **Create identity**
4. Choose **Email address**
5. Enter `support@speed-x.us`
6. Click **Create identity**
7. Check your email and click the verification link

### Step 2: Create IAM User for Sending

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. User name: `speedx-ses-sender`
4. Click **Next**
5. Select **Attach policies directly**
6. Search and select: `AmazonSESFullAccess`
7. Click **Next** → **Create user**

### Step 3: Generate Access Keys

1. Click on the newly created user
2. Go to **Security credentials** tab
3. Scroll to **Access keys**
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next** → **Create access key**
7. **IMPORTANT**: Copy both:
   - Access key ID (starts with `AKIA...`)
   - Secret access key (show and copy)
8. Save these securely - you'll need them for environment variables

### Step 4: Move Out of SES Sandbox (Production)

By default, SES is in sandbox mode (can only send to verified emails).

1. Go to SES Console → **Account dashboard**
2. Click **Request production access**
3. Fill out the form:
   - **Mail type**: Transactional
   - **Website URL**: https://speed-x.us
   - **Use case description**: 
     ```
     SpeedX is a speed tracking mobile application. We need to send
     transactional emails for user account confirmation during signup.
     Expected volume: 100-200 emails/day initially.
     ```
4. Submit request
5. AWS typically approves within 24 hours

**For Testing**: You can stay in sandbox mode and verify recipient test emails.

## 📦 Installation

### 1. Clone and Install Dependencies

```bash
cd email-auth-service
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
PORT=3000
NODE_ENV=production

# Supabase (from https://app.supabase.com/project/YOUR_PROJECT/settings/api)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AWS SES (from IAM user created above)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-secret-access-key
SES_SOURCE_EMAIL=support@speed-x.us

# Application URLs
FRONTEND_CONFIRM_REDIRECT=https://speed-x.us/waitlist
IOS_CONFIRM_REDIRECT=speedx://confirm
API_BASE_URL=https://your-app.railway.app

# Security
JWT_SIGNING_SECRET=your-long-random-secret-min-32-chars
TOKEN_EXPIRATION_HOURS=48

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5

# CORS
ALLOWED_ORIGINS=https://speed-x.us,https://admin.speed-x.us,speedx://
```

### 3. Run Database Migration

Run this SQL in your Supabase SQL Editor:

```bash
# Copy the contents of migrations/001_create_email_confirmations.sql
# Paste into Supabase Dashboard → SQL Editor → New Query → Run
```

### 4. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 to see the service running.

## 🚂 Railway Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: SpeedX email auth service"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/speedx-email-auth.git
git push -u origin main
```

### 2. Deploy to Railway

1. Go to [Railway.app](https://railway.app/)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your `speedx-email-auth` repository
5. Click **Deploy**

### 3. Add Environment Variables

In Railway dashboard:

1. Go to your project → **Variables**
2. Click **+ New Variable**
3. Add all variables from your `.env` file (one by one)
4. **IMPORTANT**: Update `API_BASE_URL` to your Railway URL (e.g., `https://speedx-email-auth-production.up.railway.app`)

### 4. Verify Deployment

1. Check **Deployments** tab for build status
2. Once deployed, click **Settings** → **Domains** to get your app URL
3. Visit `https://your-app.railway.app/health` to verify it's running

## 📡 API Endpoints

### POST /api/signup

Create a new user and send confirmation email.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "metadata": {
    "referral": "facebook"
  }
}
```

**Response:**
```json
{
  "message": "Signup accepted. Check your email for confirmation link.",
  "email": "user@example.com"
}
```

### GET /api/confirm?token=xxxxx

Confirm user email address. Redirects to waitlist on success.

### POST /api/resend

Resend confirmation email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "A new confirmation link has been sent to your email.",
  "email": "user@example.com"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "speedx-email-auth",
  "timestamp": "2025-01-15T01:00:00.000Z"
}
```

## 🔧 Frontend Integration

### F1 Dashboard (Next.js)

Update your waitlist/signup page:

```javascript
// app/waitlist/page.tsx or pages/waitlist.tsx

async function handleSignup(email, password) {
  try {
    const response = await fetch('https://your-app.railway.app/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Show success message
      alert('Check your email for confirmation link!');
    } else {
      alert(data.error || 'Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
}

// Resend confirmation
async function handleResend(email) {
  const response = await fetch('https://your-app.railway.app/api/resend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  alert(data.message);
}
```

## 📱 iOS Integration

### 1. Configure Deep Links

Add to your `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>speedx</string>
        </array>
    </dict>
</array>
```

### 2. Call Signup API

```swift
// In your signup view
func signup(email: String, password: String) async {
    let url = URL(string: "https://your-app.railway.app/api/signup")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = ["email": email, "password": password]
    request.httpBody = try? JSONEncoder().encode(body)
    
    do {
        let (data, response) = try await URLSession.shared.data(for: request)
        let result = try JSONDecoder().decode(SignupResponse.struct, from: data)
        // Show success message
        print(result.message)
    } catch {
        print("Signup error: \\(error)")
    }
}
```

### 3. Handle Deep Link

```swift
// In your App delegate or Scene delegate
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    if url.scheme == "speedx" && url.host == "confirm" {
        // Handle confirmation
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        if let email = components?.queryItems?.first(where: { $0.name == "email" })?.value {
            // Show confirmation success
            showAlert(title: "Email Confirmed!", message: "Your email \\(email) has been confirmed. Awaiting admin approval.")
        }
        return true
    }
    return false
}
```

## 🧪 Testing

### Test Signup

```bash
curl -X POST https://your-app.railway.app/api/signup \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"testPassword123"}'
```

### Test Resend

```bash
curl -X POST https://your-app.railway.app/api/resend \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com"}'
```

### Test Health

```bash
curl https://your-app.railway.app/health
```

## 🔒 Security Features

- ✅ Rate limiting (5 requests per minute on signup/resend)
- ✅ CORS protection with whitelist
- ✅ Helmet.js security headers
- ✅ Secure token generation (cryptographically random)
- ✅ Token expiration (48 hours by default)
- ✅ Single-use tokens
- ✅ Email validation
- ✅ Password strength requirements (min 8 characters)
- ✅ Service role key never exposed to clients
- ✅ IP and User-Agent logging for audit trail

## 📊 Monitoring

### Check Logs

**Railway:**
- Go to your project → **Deployments** → Click latest deployment → **View Logs**

### Monitor Email Delivery

**AWS SES:**
- Go to SES Console → **Account dashboard** → **Sending statistics**
- Check bounce/complaint rates

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check SES sandbox status**: Verify sender email and recipient emails if in sandbox
2. **Check AWS credentials**: Ensure IAM user has SES permissions
3. **Check logs**: Look for SES errors in Railway logs
4. **Verify email**: Make sure `support@speed-x.us` is verified in SES

### Confirmation Links Not Working

1. **Check `API_BASE_URL`**: Must match your Railway deployment URL
2. **Check database**: Verify `email_confirmations` table exists
3. **Check token expiration**: Tokens expire after 48 hours by default

### CORS Errors

1. **Update `ALLOWED_ORIGINS`**: Include your frontend domain
2. **Check protocol**: Must use `https://` in production

## 📝 License

ISC

## 👥 Support

For issues or questions:
- Email: support@speed-x.us
- GitHub: [Create an issue](https://github.com/YOUR_USERNAME/speedx-email-auth/issues)

---

**Built with ❤️ for SpeedX**
