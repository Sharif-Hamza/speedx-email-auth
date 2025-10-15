# 🚨 PREVENT SPAM - Resend Domain Verification

## WHY EMAILS GO TO SPAM

1. ❌ **Using `onboarding@resend.dev`** - This is a shared domain that EVERYONE uses
2. ❌ **No SPF/DKIM/DMARC records** - Email providers mark unverified domains as spam
3. ❌ **No domain authentication** - Gmail/Outlook don't trust the sender

## THE FIX: Verify Your Domain

You MUST verify `speed-x.us` in Resend and add DNS records.

---

## STEP 1: Add Domain in Resend

1. Go to **Resend Dashboard**: https://resend.com/domains
2. Click **Add Domain**
3. Enter: `speed-x.us`
4. Click **Add**

Resend will give you **3 DNS records** to add:

---

## STEP 2: Add DNS Records

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these records:

### Record 1: SPF (TXT Record)
```
Type: TXT
Name: @ (or speed-x.us)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

### Record 2: DKIM (TXT Record)
```
Type: TXT
Name: resend._domainkey
Value: [Resend will provide this - copy from dashboard]
TTL: 3600
```

### Record 3: DMARC (TXT Record)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:support@speed-x.us
TTL: 3600
```

---

## STEP 3: Verify in Resend

1. After adding DNS records, wait 10-30 minutes for propagation
2. Go back to Resend dashboard
3. Click **Verify** next to your domain
4. Status should change to ✅ **Verified**

---

## STEP 4: Update Railway Environment Variable

Once domain is verified, update Railway:

```
FROM_EMAIL=support@speed-x.us
```

(Change from `onboarding@resend.dev` to your verified domain)

Save → Railway will restart automatically

---

## STEP 5: Test Email Deliverability

After verification, test signup:

1. Sign up with a Gmail account
2. Check inbox (NOT spam)
3. ✅ Email should arrive in PRIMARY inbox
4. ✅ Gmail will show: "From: SpeedX <support@speed-x.us>"
5. ✅ Will NOT show spam warning

---

## EMAIL DESIGN FIXED

✅ Changed from `<div>` layout to **table-based layout**
✅ All colors now use **inline styles** 
✅ Background color `#0C0C0C` applied to **every table cell**
✅ Gmail-compatible dark theme
✅ Works in all email clients (Gmail, Outlook, Apple Mail, etc.)

---

## WHY THIS WORKS

### Before:
- ❌ Sending from `onboarding@resend.dev` (shared, untrusted)
- ❌ No SPF/DKIM/DMARC authentication
- ❌ Gmail sees: "This email might not be from SpeedX"
- ❌ Goes to spam

### After:
- ✅ Sending from `support@speed-x.us` (verified, authenticated)
- ✅ SPF, DKIM, DMARC all pass
- ✅ Gmail sees: "This email is from SpeedX"
- ✅ Arrives in inbox

---

## EXPECTED RESULTS

### Email Deliverability:
- **Gmail**: ✅ Primary inbox (not spam)
- **Outlook**: ✅ Inbox (not junk)
- **Yahoo**: ✅ Inbox
- **Apple Mail**: ✅ Inbox

### Email Appearance:
- **Background**: ✅ Black (#0C0C0C) in all email clients
- **Text**: ✅ Light colors (#E0E0E0)
- **Button**: ✅ Green (#00FF7F)
- **Mobile**: ✅ Responsive design

---

## CHECK DNS PROPAGATION

After adding DNS records, verify they're working:

1. Go to: https://mxtoolbox.com/SuperTool.aspx
2. Enter: `speed-x.us`
3. Check:
   - **SPF Record**: Should show `v=spf1 include:_spf.resend.com ~all`
   - **DKIM**: Should exist
   - **DMARC**: Should show `v=DMARC1; p=none`

---

## TROUBLESHOOTING

### Domain not verifying in Resend?
- Wait 30 minutes for DNS propagation
- Check DNS records are correct (no typos)
- Use exact values from Resend dashboard

### Still going to spam?
- Make sure `FROM_EMAIL` is set to verified domain
- Check Railway logs for any errors
- Test with different email provider (Gmail, Outlook, Yahoo)

### Background still white in Gmail?
- New emails will have black background
- Old emails won't update retroactively
- Clear Gmail cache or test in incognito mode

---

## SUMMARY

1. ✅ **Add domain** in Resend dashboard
2. ✅ **Add DNS records** (SPF, DKIM, DMARC)
3. ✅ **Wait 30 minutes** for propagation
4. ✅ **Verify domain** in Resend
5. ✅ **Update Railway** `FROM_EMAIL` variable
6. ✅ **Test email** delivery

**After this, emails will go to inbox, not spam!** 📧✅

---

## IMPORTANT NOTES

- Domain verification is **REQUIRED** for production use
- Using `onboarding@resend.dev` is **ONLY for testing**
- SPF/DKIM/DMARC are **industry standard** for email authentication
- Without these, your emails **WILL go to spam**

This is not a Resend issue - **ALL email services require domain verification** (SendGrid, Mailgun, SES, etc.)
