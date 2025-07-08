# TaskFlow Pro - Professional Task Management

A lightweight, professional task management application built with pure HTML, CSS, and JavaScript. No dependencies, no build tools - just open and use!

## ✨ Features

### Core Functionality
- ✅ **Add Tasks** - Create new tasks with intuitive input
- ✅ **Edit Tasks** - Inline editing with save/cancel options
- ✅ **Delete Tasks** - Remove tasks with confirmation
- ✅ **Mark Complete** - Toggle task completion status
- ✅ **Persistent Storage** - All data saved in localStorage

### Advanced Features
- 🎨 **Dark/Light Theme** - Toggle between themes with system preference detection
- 🔍 **Search Tasks** - Real-time search functionality
- 📊 **Filter Tasks** - Filter by All, Pending, or Completed
- 📈 **Statistics** - Live task counters and progress tracking
- ⌨️ **Keyboard Shortcuts** - Efficient keyboard navigation
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔔 **Notifications** - Success/error feedback messages
- ⏰ **Timestamps** - Creation and modification dates
- 🎯 **Priority Levels** - High, Medium, Low priority indicators

### User Experience
- 🚀 **Fast Loading** - Optimized performance
- 💫 **Smooth Animations** - Polished micro-interactions
- ♿ **Accessibility** - WCAG compliant design
- 🎭 **Empty States** - Helpful guidance when no tasks exist
- 📦 **Bulk Actions** - Mark all complete or clear completed tasks

## 🚀 Quick Start

### Option 1: Direct Download
1. Download all files:
   - `index.html`
   - `style.css`
   - `script.js`
2. Place them in the same folder
3. Open `index.html` in your web browser
4. Start managing your tasks!

### Option 2: Clone Repository
```bash
git clone <repository-url>
cd taskflow-pro
open index.html
```

## 📁 File Structure

```
taskflow-pro/
├── index.html          # Main HTML file
├── style.css           # All styles and themes
├── script.js           # Application logic
└── README.md           # This file
```

## 🎮 How to Use

### Adding Tasks
1. Type your task in the input field
2. Click "Add Task" or press Enter
3. Your task appears in the list instantly

### Managing Tasks
- **Complete**: Click the checkbox next to any task
- **Edit**: Click the edit icon (pencil) to modify task text
- **Delete**: Click the delete icon (trash) to remove a task

### Filtering & Search
- Use filter buttons to show All, Pending, or Completed tasks
- Type in the search box to find specific tasks
- Combine filters and search for precise results

### Bulk Operations
- **Mark All Complete**: Complete all pending tasks at once
- **Clear Completed**: Remove all completed tasks

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Focus search box
- `Ctrl/Cmd + Enter` - Focus task input
- `Enter` - Save when editing a task
- `Escape` - Cancel editing

## 🎨 Themes

TaskFlow Pro supports both light and dark themes:

- **Auto Detection**: Automatically matches your system preference
- **Manual Toggle**: Click the theme button in the top-right corner
- **Persistent**: Your theme choice is remembered

## 💾 Data Storage

- All tasks are stored locally in your browser's localStorage
- No data is sent to external servers
- Your tasks persist between browser sessions
- Works completely offline

## 🔧 Customization

### Colors
Edit CSS custom properties in `style.css`:
```css
:root {
  --primary-500: #3b82f6;  /* Primary color */
  --success-500: #10b981;  /* Success color */
  --error-500: #ef4444;    /* Error color */
  /* ... more variables */
}
```

### Sample Tasks
Modify the sample tasks in `script.js`:
```javascript
const sampleTasks = [
  {
    text: 'Your custom sample task',
    priority: 'high',
    // ... other properties
  }
];
```

## 🌐 Browser Support

TaskFlow Pro works on all modern browsers:

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Experience

- Fully responsive design
- Touch-friendly interface
- Optimized for mobile screens
- Swipe gestures supported

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators
- Semantic HTML structure

## 🔒 Privacy & Security

- **No tracking** - Zero analytics or tracking scripts
- **Local only** - All data stays on your device
- **No accounts** - No sign-up or login required
- **Offline capable** - Works without internet connection

## 🧪 Testing Examples

Try these sample tasks to test the application:

```
Review quarterly budget report
Prepare presentation for Monday's client meeting
Buy groceries for the week
Call dentist to schedule appointment
Update project documentation
Schedule team meeting for next week
Research new productivity tools
Plan weekend activities
```

## 🐛 Troubleshooting

### Tasks not saving?
- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode
- Clear browser cache and try again

### Theme not switching?
- Check if JavaScript is enabled
- Try refreshing the page
- Clear localStorage: `localStorage.clear()`

### Performance issues?
- Clear completed tasks regularly
- Avoid having thousands of tasks
- Use search/filters for large task lists

## 🔄 Updates & Versions

### Version 1.0.0 (Current)
- Initial release
- Core task management features
- Dark/light theme support
- Responsive design
- Local storage persistence

## 🤝 Contributing

This is a standalone project, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Design inspiration from modern productivity apps
- Built with ❤️ for productivity enthusiasts

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all files are in the same directory
4. Try opening in a different browser

---

**Made with ❤️ using modern web technologies**

*TaskFlow Pro - Stay Organized, Stay Productive*