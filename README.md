##

<p align="center">
  <img src="https://socialify.git.ci/zen-ikigai/qued/image?description=1&amp;descriptionEditable=Effortless%20Organization%0AMaster%20Your%20Tasks%2C%20Own%20Your%20Time&amp;font=Source%20Code%20Pro&amp;language=1&amp;name=1&amp;pattern=Plus&amp;theme=Dark" alt="project-image">
</p>

# Qued - Task Management Simplified

Qued is a robust task management platform designed to simplify how you organize and track your daily tasks. Leveraging a clean and intuitive interface, Qued makes it effortless to manage tasks, enhancing productivity every day.

Visit the demo here: [Qued](https://qued-pesto.vercel.app/)
## Features

- **Google Single Sign-On**: Effortlessly sign in with your Google account.
- **Dynamic Task Management**: Create, edit, and delete tasks with a few clicks.
- **Drag and Drop**: Easily update the status of tasks using a drag-and-drop interface.
- **Responsive Task Filtering**: Filter tasks by status, due dates, or custom search queries.
- **Advanced Sorting**: Sort tasks by creation date, and due date.
- **Personalised Profile**: Profile with analytics, 1-Click tasks and profile delete.
- **Responsive UI**: A mobile first interface ideal for both mobile and desktop users alike.
- **Custom Unique Avatars**: Every user gets a unique avatar from the [HueMan API.](https://hueman.space)

## Technology Stack

- **Frontend**: React, Next.js
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google Provider
- **Styling**: Tailwind CSS, Sass
- **Deployment**: Vercel
- **Formatting**: Prettier
- **Testing**: Postman, Lighthouse

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 12.x)
- npm/yarn
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/qued.git
   cd qued
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   ```plaintext
   Rename .env.example to .env and update the values accordingly.
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing and Security

- **API Testing**: Extensively tested with Postman to ensure API reliability and performance.
- **Responsive Testing**: Utilized browser developer tools to ensure a seamless user experience on various devices.
- **Performance and Accessibility**: Enhanced with Lighthouse to optimize performance, accessibility, SEO, and best practices.
- **Security Measures**: Implemented HOC and basic security practices, including secure HTTP headers, authenticated flows and data validation to protect against common vulnerabilities.

## Contributing

Contributions are welcome! Here’s how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- **Notifications**: Integration with Amazon SES for task reminders and notifications is in progress. Exploring the use of a Node.js server with cron job capabilities for scheduled notifications. Exploring different modes of notifications like SMS, Push Notifications etc.
