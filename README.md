# CSConnect - Student Project Collaboration Platform

A modern web platform built with Next.js and Spring Boot that connects CS/SWE students for collaborative project development. CSConnect aims to bridge the gap between academic learning and real-world experience by facilitating project-based learning and team collaboration.

## 🎯 Mission

To empower CS and Software Engineering students to gain practical experience through collaborative projects, helping them build portfolios and develop essential teamwork skills in a real-world context.

## ⚡ Tech Stack

- **Frontend**: Next.js 15.1 with TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Email/Password + Google OAuth (planned)
- **UI Components**: Custom components with Geist font integration
- **Development**: TurboPack for fast builds
- **Backend**: Spring Boot (Java)
- **Database**: PostgreSQL
- **API Communication**: RESTful APIs with JWT authentication

## 🚀 Key Features

### MVP Features
- User Profiles with skill tracking
- Project idea posting and discovery
- Skill-based project matching
- Basic collaboration tools
- Secure authentication system

### Future Enhancements
- GitHub integration
- Mentorship system
- AI-powered project matching
- Advanced project tracking
- Recruiter portal

## 🛠️ Getting Started

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/CSConnect.git
   cd CSConnect/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd CSConnect/backend
   ```
2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
3. Build and run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
4. The backend will be available at `http://localhost:8080`

### Database Setup
1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE CSConnect_db;
   ```
2. Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/CSConnect_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## 📁 Project Structure

```
CSConnect/
├── frontend/
│   ├── src/
│   │   ├── app/ # Next.js 13+ App Router
│   │   ├── (auth)/ # Authentication routes
│   │   ├── ideas/ # Project ideation features
│   │   └── page.tsx # Landing page
│   ├── components/ # Reusable components
│   ├── public/ # Static assets
│   └── tailwind.config.ts # TailwindCSS configuration
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/CSConnect/ # Backend source code
│   │   │   ├── controllers/ # REST controllers
│   │   │   ├── services/ # Business logic
│   │   │   ├── repositories/ # Database interactions
│   │   │   └── models/ # Entity models
│   │   ├── resources/
│   │   │   ├── application.properties # Configurations
│   └── pom.xml # Maven dependencies
```  

## 👥 Target Audience

- CS/SWE students
- Coding bootcamp graduates
- Beginning developers
- Student project teams
- Tech mentors

## 📞 Contact

For questions or support, please reach out to [ibraheemd101@gmail.com](mailto:ibraheemd101@gmail.com)

