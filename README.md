# 🚀 SpaceX Launch Missions Repository

[![Deploy to GitHub Pages](https://github.com/ghanhass/spacex_repository/actions/workflows/deploy.yml/badge.svg)](https://github.com/ghanhass/spacex_repository/actions/workflows/deploy.yml)
[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.io/)
[![NgRx](https://img.shields.io/badge/NgRx-18-purple.svg)](https://ngrx.io/)

A modern Angular application that provides detailed analytics and insights into SpaceX launch missions, including launch history, success rates, and favorite tracking.

## 🌐 Live Demo

**https://ghanhass.github.io/spacex-prod/**

## ✨ Features

- 🚀 View all past SpaceX launches
- 🔍 Search and filter launches by name
- ⭐ Add/remove launches to favorites
- 📱 Fully responsive design
- 🎨 Material Design UI components

## 📋 Prerequisites

- **Node.js** (v20.x or later) - [Download](https://nodejs.org/)
- **npm** (v10.x or later) - Comes with Node.js
- **Angular CLI** (v21.x) - Install with: `npm install -g @angular/cli@21`

## 🛠️ Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/ghanhass/spacex_repository.git
cd spacex_repository

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the development server
ng serve

# 4. Open your browser to http://localhost:4200

## 📦 Available Commands
Command	Description
ng serve	Start development server at http://localhost:4200
ng build	Build the project to dist/ directory
ng build --prod	Production build with optimizations
ng test	Run unit tests with Karma/Jasmine
ng test --watch=false	Run tests once (CI mode)
ng test --code-coverage	Run tests with coverage report
🧪 Running Tests
bash
# Interactive mode (watches for changes)
ng test

# Run once (CI mode)
ng test --watch=false

# With code coverage
ng test --code-coverage --watch=false


## 🏗️ Building for Production
bash
ng build --configuration=production
The build artifacts will be stored in dist/spacex_repository/browser/

🐛 Troubleshooting
Common Issues & Solutions
npm install fails with peer dependency errors

bash
npm install --legacy-peer-deps
Port 4200 is already in use

bash
ng serve --port 4201
Tests fail with "No binary for Chrome browser"

bash
ng test --browsers=ChromeHeadless --watch=false
Clear npm cache and reinstall

bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps


## 🚢 Deployment
Automatic Deployment (GitHub Actions)
Every push to the main branch triggers:

Run all unit tests

Build production bundle

Deploy to production repository

Manual Deployment
bash
ng build --configuration=production
npx angular-cli-ghpages --dir=dist/spacex_repository/browser --repo=https://github.com/ghanhass/spacex-prod.git
📊 Tech Stack
Angular 21 - Frontend framework

NgRx 18 - State management

Angular Material - UI components

RxJS - Reactive programming

Karma/Jasmine - Unit testing

GitHub Actions - CI/CD pipeline


## 📁 Project Structure
text
spacex_repository/
├── src/
│   ├── app/
│   │   ├── components/      # Launch details & list components
│   │   ├── state/           # NgRx actions, reducer, selectors
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── services/        # SpaceX API service
│   │   └── app.component.ts # Root component
│   ├── assets/              # Static assets
│   └── index.html           # HTML entry point
├── angular.json             # Angular configuration
├── package.json             # npm dependencies
└── karma.conf.js            # Karma test configuration


## 🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 License
MIT License

📧 Contact
Hassoon - GitHub

Project Link: https://github.com/ghanhass/spacex_repository

Happy Coding! 🚀
