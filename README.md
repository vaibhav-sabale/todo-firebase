# Angular + Firebase TODO App

## Host Link:- https://to-do-9eff1.web.app/

A real-time TODO application built with Angular 21 and Firebase Firestore.

## Features

### Core Features ✅
- **Create TODO** - Add new todos with title, description, and status
- **Update TODO** - Edit existing todos
- **Mark Status** - Toggle between Pending → In Progress → Completed
- **List TODOs** - Real-time updates from Firestore

### Optional Features ✅
- **Group by Date** - TODOs grouped into Today, Yesterday, and Older sections

## Tech Stack
- Angular 21
- Reactive Forms
- Firebase Firestore (real-time database)
- TypeScript

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Update `src/environments/environment.ts` with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

### 3. Run the App
```bash
npm start
```

Navigate to `http://localhost:4200`

## Firestore Structure

```
Collection: todos
├── id: string (auto-generated)
├── title: string
├── description: string
├── status: 'pending' | 'in-progress' | 'completed'
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

## Pages
- **/** - Todo List (home)
- **/add** - Add new todo
- **/edit/:id** - Edit existing todo
