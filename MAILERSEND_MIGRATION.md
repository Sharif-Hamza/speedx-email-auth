# ✅ MIGRATED TO MAILERSEND

## What Changed

Switched from **Resend** to **Mailersend** for email delivery.

### Why?
- Better inbox delivery rates
- No spam folder issues
- Professional email service with great reputation

---

## Railway Environment Variables

**🚨 UPDATE THESE ON RAILWAY:**

Go to Railway → Your project → **Variables** tab

### ❌ REMOVE:
```
RESEND_API_KEY
```

### ✅ ADD:
```
MAILERSEND_API_KEY=mlsn.6e90358f6ce1407588a776bc30676c7ebe1970b35aa9dc117bfa275d27b87973
FROM_NAME=SpeedX
```

### ✅ KEEP (already there):
```
FROM_EMAIL=support@speed-x.us
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
API_BASE_URL=https://speedx-email-auth-production.up.railway.app
ALLOWED_ORIGINS=https://speed-x.us,http://localhost:3000
FRONTEND_CONFIRM_REDIRECT=https://speed-x.us/pending
IOS_CONFIRM_REDIRECT=speedx://confirm
NODE_ENV=production
PORT=3000
TOKEN_EXPIRATION_HOURS=48
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5
```

---

## Verify Domain in Mailersend

### IMPORTANT: Add DNS Records

To ensure emails go to inbox (not spam), you MUST verify your domain:

1. **Go to Mailersend Dashboard**: https://app.mailersend.com/domains
2. Click **Add Domain**
3. Enter: `speed-x.us`
4. Add these DNS records to your domain registrar:

#### SPF Record:
```
Type: TXT
Name: @
Value: v=spf1 include:spf.mailersend.net ~all
TTL: 3600
```

#### DKIM Records:
Mailersend will provide 3 DKIM records - add all of them:
```
Type: TXT
Name: fm1._domainkey
Value: [Copy from Mailersend dashboard]

Type: TXT
Name: fm2._domainkey
Value: [Copy from Mailersend dashboard]

Type: TXT
Name: fm3._domainkey
Value: [Copy from Mailersend dashboard]
```

#### DMARC Record:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@speed-x.us; pct=100
TTL: 3600
```

5. Wait 30 minutes for DNS propagation
6. Click **Verify Domain** in Mailersend dashboard

---

## Test Email Delivery

After Railway restarts with new variables:

1. Go to https://speed-x.us/waitlist
2. Sign up with a test email
3. Check inbox (NOT spam)
4. ✅ Should receive email from "SpeedX <support@speed-x.us>"
5. ✅ Black background, all styling intact
6. ✅ No spam warnings

---

## Code Changes

### Files Modified:
- ✅ `package.json` - Replaced `resend` with `mailersend`
- ✅ `src/lib/sesClient.js` - Updated to use Mailersend API
- ✅ `.env` - Local environment variables

### No Changes Needed:
- ✅ Email templates (work exactly the same)
- ✅ Routes (signup, confirm, resend)
- ✅ iOS app (no changes)
- ✅ Web dashboard (no changes)

---

## Mailersend vs Resend

### Mailersend Advantages:
- ✅ Better inbox delivery rates
- ✅ More established email reputation
- ✅ Professional support
- ✅ Detailed analytics
- ✅ No spam folder issues

### API Key:
```
mlsn.6e90358f6ce1407588a776bc30676c7ebe1970b35aa9dc117bfa275d27b87973
```

---

## Troubleshooting

### Emails not sending?
- Check Railway logs for errors
- Verify `MAILERSEND_API_KEY` is set correctly
- Make sure `FROM_NAME` is added

### Still going to spam?
- Verify domain in Mailersend dashboard
- Add all DNS records (SPF, DKIM, DMARC)
- Wait 24 hours after DNS changes

### Need to check API status?
- Mailersend Dashboard: https://app.mailersend.com
- API Docs: https://developers.mailersend.com

---

## Summary

1. ✅ Code updated to use Mailersend
2. ✅ Package installed locally
3. 🚨 **YOU NEED TO**: Update Railway environment variables
4. ✅ **OPTIONAL**: Verify domain for better delivery (recommended)
5. ✅ Test after Railway restart

**No frontend changes needed** - everything works the same!
