# 🚀 Quick Start - Test Lesson & Sentence Management

## Current Status
✅ All servers running
✅ MongoDB connected
✅ Ready to test

## URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Admin Panel**: After login, click "Bài Học" or "Câu Văn" tabs

---

## 5-Minute Quick Test

### Step 1: Login (30 seconds)
```
Email: admin@example.com
Password: Admin123
```

### Step 2: Create a Lesson (1 minute)
1. Click "Bài Học" tab in top navigation
2. Fill the form:
   - **Title**: "Lesson 1: Greetings"
   - **Image**: Leave blank or paste any valid image URL
   - **Level**: Select A1
   - **Order**: 1
   - **Published**: Check
3. Click "Thêm bài học" button
4. ✅ See "Thêm bài học thành công!" notification
5. ✅ Lesson appears in right sidebar list

### Step 3: Create a Sentence with Audio (2 minutes)
1. Click "Câu Văn" tab
2. Fill the form:
   - **Select lesson**: "Lesson 1: Greetings"
   - **Text**: "Hello, how are you today?"
   - **Type**: "speaking"
   - **Order**: 1
3. Click "Thêm câu văn" button
4. ✅ See notification: "Thêm câu văn thành công! (Audio sẽ được tạo tự động)"
5. **Wait 2-3 seconds** for audio generation
6. ✅ Audio player appears in right sidebar
7. ✅ Click play button to hear the sentence pronounced

### Step 4: Test Edit (1 minute)
1. In sentences list, click edit button (✏️ icon)
2. ✅ Form auto-populates with current data
3. Change text to: "Goodbye, see you tomorrow!"
4. Click "Cập nhật" button
5. ✅ New audio generated
6. ✅ Audio player updated in list

### Step 5: Test Delete (30 seconds)
1. Click edit button again
2. Click "Xóa" (Delete) button
3. Confirm in popup
4. ✅ Sentence removed from list

---

## 🎯 What Just Happened

You've successfully:
1. ✅ Created lesson data in MongoDB
2. ✅ Created sentence data with automatic audio generation
3. ✅ Edited data with form auto-population
4. ✅ Deleted data with confirmation
5. ✅ Generated speech from text using Google TTS

---

## 🔊 Audio Technical Details

**When you created the sentence:**
1. Your English text was sent to Google's TTS service
2. Google generated MP3 audio file (pronunciation)
3. File saved to: `backend/public/audio/{uuid}.mp3`
4. URL stored in database: `/static/audio/{uuid}.mp3`
5. Audio player loads from this URL

**Files generated:**
- Check `backend/public/audio/` folder
- You'll see MP3 files created for each sentence

---

## 🛠️ If Something Goes Wrong

**Audio not generating:**
- Check internet connection (Google TTS needs it)
- Check browser console for errors (F12)
- Check terminal for backend errors

**Form not auto-populating on edit:**
- Refresh page
- Close and reopen adminpanel

**Audio not playing:**
- Try different browser (Chrome recommended)
- Check file path in browser Network tab (F12)

---

## 📱 UI Features You Can Test

| Feature | Where | How |
|---------|-------|-----|
| Lesson Form | "Bài Học" tab | Fill and submit form |
| Lesson List | Below form | Shows all lessons created |
| Sentence Form | "Câu Văn" tab | Select lesson first |
| Audio Player | Sentence list | Click play button |
| Edit Mode | Click ✏️ icon | Form populates automatically |
| Delete | Click "Xóa" button | Confirm in popup |

---

## 🎓 Learning Outcomes

After this test, you've verified:
- ✅ Admin CRUD operations work
- ✅ TTS audio generation works
- ✅ Database storage works
- ✅ Frontend UI is responsive
- ✅ Authentication/Authorization works
- ✅ Error handling works

---

## 📚 Next Features to Implement (Optional)

1. Batch sentence creation from CSV
2. Sentence reordering with drag-drop
3. Audio quality settings (voice, speed, language)
4. Sentence search/filter
5. Audio export functionality
6. Student lesson viewer

---

## 💡 Pro Tips

- Each sentence generates a unique MP3 file
- Files persist even if you delete from database (cleanup needed)
- Admin-only feature (non-admin users can't access)
- Form validation prevents empty submissions
- Notifications auto-close after 3 seconds

---

**Perfect! Your Lesson & Sentence admin management system is live! 🎉**
