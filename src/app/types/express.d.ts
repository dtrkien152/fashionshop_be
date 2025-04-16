import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number; // Định nghĩa userId trong session
    email: string;
    role: string;
    employeeId: number;
  }
}
